import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { sendWelcomeEmail, sendPasswordResetEmail, sendVerificationStatusEmail } from "./email";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import {
  addSeafarerDocument, countCompanies, countJobs, countSeafarers, countUsers,
  createBlog, createCompany, createJob, createJobApplication, createNotification,
  createSeafarer, createVessel, createVerificationRequest,
  deleteBlog, deleteFaq, deleteJob, deleteRank, deleteSeafarerDocument, deleteShipType, deleteSlider,
  getActiveFaqs, getActiveSliders, getAllCountries, getAllEducationLevels, getAllFaqs,
  getAllRanks, getAllShipTypes, getAllSliders, getAllUsers,
  getBlogById, getBlogBySlug, getBlogs, getCitiesByCountry,
  getCompanies, getCompanyById, getCompanyByUserId,
  getJobApplications, getJobById, getJobs, getSeafarerApplications,
  getPageBySlug, getSeafarerById, getSeafarerByUserId, getSeafarerDocuments,
  getSeafarerShipTypes, getSeafarers, getUserByEmail, getUserById,
  getUserNotifications, getVesselsByCompany, getVerificationByUserId, getVerificationRequests,
  markAllNotificationsRead, markNotificationRead, countUnreadNotifications,
  updateBlog, updateCompany, updateJob, updateJobApplication, updatePage,
  updateSeafarer, updateUserById, updateVerificationRequest,
  upsertCity, upsertCountry, upsertFaq, upsertRank, upsertShipType, upsertSlider, upsertUser,
} from "./db";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new Error("FORBIDDEN");
  return next({ ctx });
});

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    register: publicProcedure.input(z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      accountType: z.enum(["seafarer", "company"]),
    })).mutation(async ({ ctx, input }) => {
      const existing = await getUserByEmail(input.email);
      if (existing) throw new Error("Email already registered");
      const passwordHash = await bcrypt.hash(input.password, 12);
      const openId = `email_${nanoid(16)}`;
      await upsertUser({
        openId, name: input.name, email: input.email,
        loginMethod: "email", lastSignedIn: new Date(),
      });
      const user = await getUserByEmail(input.email);
      if (user) {
        await updateUserById(user.id, { passwordHash, accountType: input.accountType });
        if (input.accountType === "seafarer") {
          await createSeafarer({ userId: user.id, email: input.email, firstNameEn: input.name });
        }
        sendWelcomeEmail(input.email, input.name).catch(() => {});
        // Create session cookie so user is logged in immediately
        const sessionToken = await sdk.createSessionToken(openId, { name: input.name, expiresInMs: ONE_YEAR_MS });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      }
      return { success: true, openId };
    }),
    login: publicProcedure.input(z.object({
      email: z.string().email(),
      password: z.string(),
    })).mutation(async ({ ctx, input }) => {
      const user = await getUserByEmail(input.email);
      if (!user || !user.passwordHash) throw new Error("Invalid credentials");
      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) throw new Error("Invalid credentials");
      if (user.isBlocked) throw new Error("Account is blocked");
      await updateUserById(user.id, { lastSignedIn: new Date() });
      // Create session cookie
      const sessionToken = await sdk.createSessionToken(user.openId, { name: user.name || "", expiresInMs: ONE_YEAR_MS });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      return { success: true, userId: user.id, openId: user.openId };
    }),
    forgotPassword: publicProcedure.input(z.object({
      email: z.string().email(),
      origin: z.string(),
    })).mutation(async ({ input }) => {
      const user = await getUserByEmail(input.email);
      if (!user) return { success: true };
      const token = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 3600000);
      await updateUserById(user.id, { resetToken: token, resetTokenExpiry: expiry });
      const resetUrl = `${input.origin}/reset-password?token=${token}`;
      await sendPasswordResetEmail(input.email, resetUrl);
      return { success: true };
    }),
    resetPassword: publicProcedure.input(z.object({
      token: z.string(),
      password: z.string().min(6),
    })).mutation(async ({ input }) => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const { users } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const result = await db.select().from(users).where(eq(users.resetToken, input.token)).limit(1);
      const user = result[0];
      if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) throw new Error("Invalid or expired token");
      const passwordHash = await bcrypt.hash(input.password, 12);
      await updateUserById(user.id, { passwordHash, resetToken: null, resetTokenExpiry: null });
      return { success: true };
    }),
  }),

  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const user = await getUserById(ctx.user.id);
      if (!user) return null;
      if (user.accountType === "company") {
        const company = await getCompanyByUserId(user.id);
        return { user, company, seafarer: null };
      }
      const seafarer = await getSeafarerByUserId(user.id);
      return { user, seafarer, company: null };
    }),
    updateSeafarer: protectedProcedure.input(z.object({
      firstNameEn: z.string().optional(), lastNameEn: z.string().optional(),
      firstNameAr: z.string().optional(), lastNameAr: z.string().optional(),
      phone: z.string().optional(), rankId: z.number().optional(),
      educationLevelId: z.number().optional(), countryId: z.number().optional(),
      cityId: z.number().optional(), experienceMonths: z.number().optional(),
      availabilityStatus: z.enum(["available", "onboard", "unavailable"]).optional(),
      bio: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      const seafarer = await getSeafarerByUserId(ctx.user.id);
      if (!seafarer) throw new Error("Seafarer profile not found");
      await updateSeafarer(seafarer.id, input);
      return { success: true };
    }),
    updateCompany: protectedProcedure.input(z.object({
      nameEn: z.string().optional(), nameAr: z.string().optional(),
      registrationNumber: z.string().optional(), email: z.string().optional(),
      phone: z.string().optional(), address: z.string().optional(),
      website: z.string().optional(), description: z.string().optional(),
      countryId: z.number().optional(), cityId: z.number().optional(),
    })).mutation(async ({ ctx, input }) => {
      const company = await getCompanyByUserId(ctx.user.id);
      if (!company) throw new Error("Company profile not found");
      await updateCompany(company.id, input);
      return { success: true };
    }),
    uploadFile: protectedProcedure.input(z.object({
      fileBase64: z.string(), fileName: z.string(), fileType: z.string(),
      purpose: z.enum(["avatar", "cv", "document", "logo"]),
      docType: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      const buffer = Buffer.from(input.fileBase64, "base64");
      const key = `${ctx.user.id}/${input.purpose}/${nanoid(8)}-${input.fileName}`;
      const { url } = await storagePut(key, buffer, input.fileType);
      if (input.purpose === "avatar") {
        await updateUserById(ctx.user.id, { avatarUrl: url });
      } else if (input.purpose === "cv") {
        const seafarer = await getSeafarerByUserId(ctx.user.id);
        if (seafarer) await updateSeafarer(seafarer.id, { cvUrl: url });
      } else if (input.purpose === "document") {
        const seafarer = await getSeafarerByUserId(ctx.user.id);
        if (seafarer) await addSeafarerDocument({ seafarerId: seafarer.id, fileUrl: url, fileName: input.fileName, docType: input.docType || "other" });
      } else if (input.purpose === "logo") {
        const company = await getCompanyByUserId(ctx.user.id);
        if (company) await updateCompany(company.id, { logoUrl: url });
      }
      return { url };
    }),
    deleteDocument: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteSeafarerDocument(input.id);
      return { success: true };
    }),
    getDocuments: protectedProcedure.query(async ({ ctx }) => {
      const seafarer = await getSeafarerByUserId(ctx.user.id);
      if (!seafarer) return [];
      return getSeafarerDocuments(seafarer.id);
    }),
  }),

  jobs: router({
    list: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input }) => {
      return getJobs({ limit: input?.limit, active: true });
    }),
    get: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getJobById(input.id);
    }),
    count: publicProcedure.query(() => countJobs()),
    submitApplication: protectedProcedure.input(z.object({
      jobId: z.number(), coverLetter: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      const seafarer = await getSeafarerByUserId(ctx.user.id);
      if (!seafarer) throw new Error("Only seafarers can apply");
      await createJobApplication({ jobId: input.jobId, seafarerId: seafarer.id, coverLetter: input.coverLetter });
      return { success: true };
    }),
    myApplications: protectedProcedure.query(async ({ ctx }) => {
      const seafarer = await getSeafarerByUserId(ctx.user.id);
      if (!seafarer) return [];
      return getSeafarerApplications(seafarer.id);
    }),
    getApplications: protectedProcedure.input(z.object({ jobId: z.number() })).query(async ({ input }) => {
      return getJobApplications(input.jobId);
    }),
    create: protectedProcedure.input(z.object({
      titleEn: z.string(), titleAr: z.string().optional(),
      descriptionEn: z.string().optional(), descriptionAr: z.string().optional(),
      rankId: z.number().optional(), shipTypeId: z.number().optional(),
      salary: z.string().optional(), currency: z.string().optional(),
      contractDuration: z.string().optional(), countryId: z.number().optional(),
    })).mutation(async ({ ctx, input }) => {
      const company = await getCompanyByUserId(ctx.user.id);
      if (!company) throw new Error("Only companies can create jobs");
      await createJob({ ...input, companyId: company.id });
      return { success: true };
    }),
  }),

  seafarers: router({
    list: publicProcedure.input(z.object({ limit: z.number().optional(), status: z.string().optional() }).optional()).query(async ({ input }) => {
      return getSeafarers({ limit: input?.limit, status: input?.status });
    }),
    get: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getSeafarerById(input.id);
    }),
    count: publicProcedure.query(() => countSeafarers()),
  }),

  companies: router({
    list: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input }) => {
      return getCompanies({ limit: input?.limit, approved: true });
    }),
    get: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getCompanyById(input.id);
    }),
    count: publicProcedure.query(() => countCompanies()),
    register: protectedProcedure.input(z.object({
      nameEn: z.string(), nameAr: z.string().optional(),
      registrationNumber: z.string(), email: z.string().email(),
      phone: z.string(), address: z.string().optional(),
      website: z.string().optional(), description: z.string().optional(),
      countryId: z.number().optional(),
    })).mutation(async ({ ctx, input }) => {
      await updateUserById(ctx.user.id, { accountType: "company" });
      await createCompany({ ...input, userId: ctx.user.id });
      return { success: true };
    }),
    vessels: protectedProcedure.input(z.object({ companyId: z.number() })).query(async ({ input }) => {
      return getVesselsByCompany(input.companyId);
    }),
  }),

  verification: router({
    request: protectedProcedure.input(z.object({
      documentBase64: z.string().optional(), fileName: z.string().optional(),
      fileType: z.string().optional(), notes: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      let documentUrl = "";
      if (input.documentBase64 && input.fileName) {
        const buffer = Buffer.from(input.documentBase64, "base64");
        const key = `verification/${ctx.user.id}/${nanoid(8)}-${input.fileName}`;
        const { url } = await storagePut(key, buffer, input.fileType || "application/pdf");
        documentUrl = url;
      }
      const user = await getUserById(ctx.user.id);
      await createVerificationRequest({
        userId: ctx.user.id,
        requestType: user?.accountType || "seafarer",
        documentUrl, notes: input.notes,
      });
      return { success: true };
    }),
    status: protectedProcedure.query(async ({ ctx }) => {
      return getVerificationByUserId(ctx.user.id);
    }),
  }),

  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserNotifications(ctx.user.id);
    }),
    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      return countUnreadNotifications(ctx.user.id);
    }),
    markRead: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await markNotificationRead(input.id);
      return { success: true };
    }),
    markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
      await markAllNotificationsRead(ctx.user.id);
      return { success: true };
    }),
  }),

  content: router({
    sliders: publicProcedure.query(() => getActiveSliders()),
    faqs: publicProcedure.query(() => getActiveFaqs()),
    page: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      return getPageBySlug(input.slug);
    }),
    blogs: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input }) => {
      return getBlogs({ limit: input?.limit, published: true });
    }),
    blog: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      return getBlogBySlug(input.slug);
    }),
  }),

  lookups: router({
    countries: publicProcedure.query(() => getAllCountries()),
    cities: publicProcedure.input(z.object({ countryId: z.number() })).query(async ({ input }) => {
      return getCitiesByCountry(input.countryId);
    }),
    ranks: publicProcedure.query(() => getAllRanks()),
    shipTypes: publicProcedure.query(() => getAllShipTypes()),
    educationLevels: publicProcedure.query(() => getAllEducationLevels()),
  }),

  admin: router({
    stats: adminProcedure.query(async () => {
      const [userCount, seafarerCount, companyCount, jobCount] = await Promise.all([
        countUsers(), countSeafarers(), countCompanies(), countJobs(),
      ]);
      return { userCount, seafarerCount, companyCount, jobCount };
    }),
    users: adminProcedure.query(() => getAllUsers()),
    updateUser: adminProcedure.input(z.object({
      id: z.number(), role: z.enum(["user", "admin"]).optional(),
      isBlocked: z.boolean().optional(), isVerified: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateUserById(id, data);
      return { success: true };
    }),
    companies: adminProcedure.query(() => getCompanies()),
    approveCompany: adminProcedure.input(z.object({
      id: z.number(), approved: z.boolean(),
    })).mutation(async ({ input }) => {
      await updateCompany(input.id, { isApproved: input.approved });
      return { success: true };
    }),
    jobs: adminProcedure.query(() => getJobs()),
    deleteJob: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteJob(input.id);
      return { success: true };
    }),
    verificationRequests: adminProcedure.input(z.object({ status: z.string().optional() }).optional()).query(async ({ input }) => {
      return getVerificationRequests({ status: input?.status });
    }),
    reviewVerification: adminProcedure.input(z.object({
      id: z.number(), status: z.enum(["approved", "rejected"]),
      adminNotes: z.string().optional(),
    })).mutation(async ({ input }) => {
      await updateVerificationRequest(input.id, {
        status: input.status, adminNotes: input.adminNotes, reviewedAt: new Date(),
      });
      const { getDb } = await import("./db");
      const db = await getDb();
      if (db) {
        const { verificationRequests: vrTable } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const vr = await db.select().from(vrTable).where(eq(vrTable.id, input.id)).limit(1);
        if (vr[0]) {
          await updateUserById(vr[0].userId, { isVerified: input.status === "approved" });
          if (input.status === "approved") {
            const user = await getUserById(vr[0].userId);
            if (user?.accountType === "seafarer") {
              const s = await getSeafarerByUserId(vr[0].userId);
              if (s) await updateSeafarer(s.id, { isVerified: true });
            } else {
              const c = await getCompanyByUserId(vr[0].userId);
              if (c) await updateCompany(c.id, { isApproved: true });
            }
          }
          await createNotification({
            userId: vr[0].userId,
            titleEn: input.status === "approved" ? "Account Verified!" : "Verification Update",
            titleAr: input.status === "approved" ? "تم توثيق حسابك!" : "تحديث التوثيق",
            messageEn: input.status === "approved" ? "Congratulations! Your account has been verified." : "Your verification request was not approved.",
            messageAr: input.status === "approved" ? "تهانينا! تم توثيق حسابك." : "لم تتم الموافقة على طلب التوثيق.",
          });
        }
      }
      return { success: true };
    }),
    blogs: adminProcedure.query(() => getBlogs()),
    createBlog: adminProcedure.input(z.object({
      titleEn: z.string(), titleAr: z.string().optional(),
      contentEn: z.string().optional(), contentAr: z.string().optional(),
      excerptEn: z.string().optional(), excerptAr: z.string().optional(),
      imageUrl: z.string().optional(), isPublished: z.boolean().optional(),
    })).mutation(async ({ ctx, input }) => {
      await createBlog({ ...input, authorId: ctx.user.id, slug: slugify(input.titleEn), publishedAt: input.isPublished ? new Date() : null });
      return { success: true };
    }),
    updateBlog: adminProcedure.input(z.object({
      id: z.number(), titleEn: z.string().optional(), titleAr: z.string().optional(),
      contentEn: z.string().optional(), contentAr: z.string().optional(),
      excerptEn: z.string().optional(), excerptAr: z.string().optional(),
      imageUrl: z.string().optional(), isPublished: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateBlog(id, data);
      return { success: true };
    }),
    deleteBlog: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteBlog(input.id);
      return { success: true };
    }),
    sliders: adminProcedure.query(() => getAllSliders()),
    upsertSlider: adminProcedure.input(z.object({
      id: z.number().nullable(), titleEn: z.string().optional(), titleAr: z.string().optional(),
      subtitleEn: z.string().optional(), subtitleAr: z.string().optional(),
      imageUrl: z.string(), linkUrl: z.string().optional(),
      sortOrder: z.number().optional(), isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await upsertSlider(id, data);
      return { success: true };
    }),
    deleteSlider: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteSlider(input.id);
      return { success: true };
    }),
    faqs: adminProcedure.query(() => getAllFaqs()),
    upsertFaq: adminProcedure.input(z.object({
      id: z.number().nullable(), questionEn: z.string(), questionAr: z.string().optional(),
      answerEn: z.string(), answerAr: z.string().optional(),
      sortOrder: z.number().optional(), isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await upsertFaq(id, data);
      return { success: true };
    }),
    deleteFaq: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteFaq(input.id);
      return { success: true };
    }),
    upsertRank: adminProcedure.input(z.object({
      id: z.number().nullable(), nameEn: z.string(), nameAr: z.string().optional(),
      department: z.enum(["deck", "engine", "catering", "other"]).optional(), sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await upsertRank(id, data);
      return { success: true };
    }),
    deleteRank: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteRank(input.id);
      return { success: true };
    }),
    upsertShipType: adminProcedure.input(z.object({
      id: z.number().nullable(), nameEn: z.string(), nameAr: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await upsertShipType(id, data);
      return { success: true };
    }),
    deleteShipType: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteShipType(input.id);
      return { success: true };
    }),
    updatePage: adminProcedure.input(z.object({
      slug: z.string(), titleEn: z.string().optional(), titleAr: z.string().optional(),
      contentEn: z.string().optional(), contentAr: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { slug, ...data } = input;
      await updatePage(slug, data);
      return { success: true };
    }),
    updateApplication: adminProcedure.input(z.object({
      id: z.number(), status: z.enum(["pending", "reviewed", "accepted", "rejected"]),
    })).mutation(async ({ input }) => {
      await updateJobApplication(input.id, { status: input.status });
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
