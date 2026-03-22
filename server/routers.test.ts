import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

// Helper to create mock context
function createMockContext(user: TrpcContext["user"] = null): {
  ctx: TrpcContext;
  cookies: { set: Array<{ name: string; value: string; options: any }>; cleared: Array<{ name: string; options: any }> };
} {
  const cookies = {
    set: [] as Array<{ name: string; value: string; options: any }>,
    cleared: [] as Array<{ name: string; options: any }>,
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: any) => {
        cookies.set.push({ name, value, options });
      },
      clearCookie: (name: string, options: any) => {
        cookies.cleared.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, cookies };
}

function createAuthUser(overrides: Partial<NonNullable<TrpcContext["user"]>> = {}): NonNullable<TrpcContext["user"]> {
  return {
    id: 1,
    openId: "test-open-id",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "email",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
}

function createAdminUser(overrides: Partial<NonNullable<TrpcContext["user"]>> = {}): NonNullable<TrpcContext["user"]> {
  return createAuthUser({ role: "admin", ...overrides });
}

describe("auth.me", () => {
  it("returns null when not authenticated", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user when authenticated", async () => {
    const user = createAuthUser();
    const { ctx } = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.email).toBe("test@example.com");
    expect(result?.name).toBe("Test User");
  });
});

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const user = createAuthUser();
    const { ctx, cookies } = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(cookies.cleared).toHaveLength(1);
    expect(cookies.cleared[0]?.name).toBe(COOKIE_NAME);
    expect(cookies.cleared[0]?.options).toMatchObject({ maxAge: -1 });
  });
});

describe("lookups", () => {
  it("returns ranks list", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const ranks = await caller.lookups.ranks();
    expect(Array.isArray(ranks)).toBe(true);
  });

  it("returns ship types list", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const shipTypes = await caller.lookups.shipTypes();
    expect(Array.isArray(shipTypes)).toBe(true);
  });

  it("returns countries list", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const countries = await caller.lookups.countries();
    expect(Array.isArray(countries)).toBe(true);
  });

  it("returns education levels list", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const levels = await caller.lookups.educationLevels();
    expect(Array.isArray(levels)).toBe(true);
  });
});

describe("content", () => {
  it("returns FAQs list", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const faqs = await caller.content.faqs();
    expect(Array.isArray(faqs)).toBe(true);
  });

  it("returns sliders list", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const sliders = await caller.content.sliders();
    expect(Array.isArray(sliders)).toBe(true);
  });

  it("returns blogs list", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const blogs = await caller.content.blogs();
    expect(Array.isArray(blogs)).toBe(true);
  });
});

describe("jobs", () => {
  it("returns jobs list", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const jobs = await caller.jobs.list();
    expect(Array.isArray(jobs)).toBe(true);
  });

  it("returns job count", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const count = await caller.jobs.count();
    expect(typeof count).toBe("number");
  });
});

describe("seafarers", () => {
  it("returns seafarers list", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const seafarers = await caller.seafarers.list();
    expect(Array.isArray(seafarers)).toBe(true);
  });

  it("returns seafarer count", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const count = await caller.seafarers.count();
    expect(typeof count).toBe("number");
  });
});

describe("companies", () => {
  it("returns companies list", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const companies = await caller.companies.list();
    expect(Array.isArray(companies)).toBe(true);
  });

  it("returns company count", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const count = await caller.companies.count();
    expect(typeof count).toBe("number");
  });
});

describe("protected routes - unauthenticated", () => {
  it("profile.get throws when not authenticated", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.profile.get()).rejects.toThrow();
  });

  it("notifications.list throws when not authenticated", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.notifications.list()).rejects.toThrow();
  });

  it("verification.status throws when not authenticated", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.verification.status()).rejects.toThrow();
  });
});

describe("admin routes - non-admin user", () => {
  it("admin.stats throws for non-admin user", async () => {
    const user = createAuthUser({ role: "user" });
    const { ctx } = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("admin.users throws for non-admin user", async () => {
    const user = createAuthUser({ role: "user" });
    const { ctx } = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.users()).rejects.toThrow();
  });
});

describe("admin routes - admin user", () => {
  it("admin.stats returns stats for admin", async () => {
    const user = createAdminUser();
    const { ctx } = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const stats = await caller.admin.stats();
    expect(stats).toHaveProperty("userCount");
    expect(stats).toHaveProperty("seafarerCount");
    expect(stats).toHaveProperty("companyCount");
    expect(stats).toHaveProperty("jobCount");
    expect(typeof stats.userCount).toBe("number");
  });

  it("admin.users returns users list for admin", async () => {
    const user = createAdminUser();
    const { ctx } = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const users = await caller.admin.users();
    expect(Array.isArray(users)).toBe(true);
  });

  it("admin.jobs returns jobs list for admin", async () => {
    const user = createAdminUser();
    const { ctx } = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const jobs = await caller.admin.jobs();
    expect(Array.isArray(jobs)).toBe(true);
  });

  it("admin.blogs returns blogs list for admin", async () => {
    const user = createAdminUser();
    const { ctx } = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const blogs = await caller.admin.blogs();
    expect(Array.isArray(blogs)).toBe(true);
  });

  it("admin.faqs returns faqs list for admin", async () => {
    const user = createAdminUser();
    const { ctx } = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const faqs = await caller.admin.faqs();
    expect(Array.isArray(faqs)).toBe(true);
  });

  it("admin.sliders returns sliders list for admin", async () => {
    const user = createAdminUser();
    const { ctx } = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const sliders = await caller.admin.sliders();
    expect(Array.isArray(sliders)).toBe(true);
  });

  it("admin.companies returns companies list for admin", async () => {
    const user = createAdminUser();
    const { ctx } = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const companies = await caller.admin.companies();
    expect(Array.isArray(companies)).toBe(true);
  });

  it("admin.verificationRequests returns list for admin", async () => {
    const user = createAdminUser();
    const { ctx } = createMockContext(user);
    const caller = appRouter.createCaller(ctx);
    const requests = await caller.admin.verificationRequests();
    expect(Array.isArray(requests)).toBe(true);
  });
});
