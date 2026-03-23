/**
 * Rate Limiting & Spam Protection Middleware
 * In-memory rate limiter (use Redis in production for multi-instance deployments)
 */

import type { Request, Response, NextFunction } from "express";

interface RateLimitEntry {
  count: number;
  resetAt: number;
  blocked: boolean;
  blockedUntil?: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

function getClientId(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0] || req.socket.remoteAddress || "unknown";
  return ip.trim();
}

interface RateLimitOptions {
  windowMs: number;       // Time window in milliseconds
  max: number;            // Max requests per window
  blockDurationMs?: number; // How long to block after exceeding (default: windowMs)
  message?: string;
  keyPrefix?: string;
}

export function createRateLimiter(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    blockDurationMs = windowMs * 2,
    message = "Too many requests, please try again later.",
    keyPrefix = "rl",
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = getClientId(req);
    const key = `${keyPrefix}:${clientId}`;
    const now = Date.now();

    let entry = store.get(key);

    // Check if currently blocked
    if (entry?.blocked && entry.blockedUntil && entry.blockedUntil > now) {
      const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", 0);
      return res.status(429).json({
        error: "Too Many Requests",
        message,
        retryAfter,
      });
    }

    // Reset if window expired
    if (!entry || entry.resetAt < now) {
      entry = { count: 0, resetAt: now + windowMs, blocked: false };
    }

    entry.count++;

    if (entry.count > max) {
      entry.blocked = true;
      entry.blockedUntil = now + blockDurationMs;
      store.set(key, entry);

      const retryAfter = Math.ceil(blockDurationMs / 1000);
      res.setHeader("Retry-After", retryAfter);
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", 0);
      return res.status(429).json({
        error: "Too Many Requests",
        message,
        retryAfter,
      });
    }

    store.set(key, entry);

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - entry.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(entry.resetAt / 1000));

    next();
  };
}

// ─── Pre-configured limiters ──────────────────────────────────────────────────

/** General API limiter: 200 requests per minute */
export const generalLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 200,
  keyPrefix: "general",
  message: "Too many requests. Please slow down.",
});

/** Auth limiter: 10 attempts per 15 minutes (prevents brute force) */
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  blockDurationMs: 30 * 60 * 1000, // Block for 30 minutes after exceeding
  keyPrefix: "auth",
  message: "Too many authentication attempts. Please wait 30 minutes.",
});

/** Post creation limiter: 20 posts per hour */
export const postLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 20,
  keyPrefix: "post",
  message: "You are posting too frequently. Please wait before posting again.",
});

/** Application limiter: 30 job applications per hour */
export const applicationLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 30,
  keyPrefix: "apply",
  message: "Too many applications submitted. Please wait before applying again.",
});

/** CV generation limiter: 10 per hour */
export const cvLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  keyPrefix: "cv",
  message: "Too many CV generation requests.",
});

// ─── Spam Content Detection ───────────────────────────────────────────────────

const SPAM_PATTERNS = [
  /\b(buy now|click here|free money|make money fast|earn \$\d+|100% free|guaranteed|no risk)\b/i,
  /https?:\/\/[^\s]+\.(xyz|tk|ml|ga|cf|gq)\b/i,
  /(.)\1{10,}/,  // Repeated characters (aaaaaaaaaa)
  /[A-Z\s]{20,}/,  // Excessive caps
];

export function detectSpam(text: string): { isSpam: boolean; reason?: string } {
  if (!text || text.trim().length === 0) return { isSpam: false };

  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      return { isSpam: true, reason: "Content flagged as potential spam" };
    }
  }

  // Check for excessive URLs
  const urlCount = (text.match(/https?:\/\//g) || []).length;
  if (urlCount > 3) {
    return { isSpam: true, reason: "Too many URLs in content" };
  }

  return { isSpam: false };
}

// ─── Security Headers Middleware ──────────────────────────────────────────────
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
}
