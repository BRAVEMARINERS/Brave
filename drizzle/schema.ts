import { boolean, decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 32 }),
  passwordHash: varchar("passwordHash", { length: 256 }),
  avatarUrl: varchar("avatarUrl", { length: 1024 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  accountType: mysqlEnum("accountType", ["seafarer", "company"]).default("seafarer"),
  isVerified: boolean("isVerified").default(false),
  isBlocked: boolean("isBlocked").default(false),
  resetToken: varchar("resetToken", { length: 256 }),
  resetTokenExpiry: timestamp("resetTokenExpiry"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// ─── Countries ────────────────────────────────────────────────────────────────
export const countries = mysqlTable("countries", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 128 }).notNull(),
  nameAr: varchar("nameAr", { length: 128 }),
  code: varchar("code", { length: 8 }),
});

// ─── Cities ───────────────────────────────────────────────────────────────────
export const cities = mysqlTable("cities", {
  id: int("id").autoincrement().primaryKey(),
  countryId: int("countryId").notNull(),
  nameEn: varchar("nameEn", { length: 128 }).notNull(),
  nameAr: varchar("nameAr", { length: 128 }),
});

// ─── Ranks ────────────────────────────────────────────────────────────────────
export const ranks = mysqlTable("ranks", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 128 }).notNull(),
  nameAr: varchar("nameAr", { length: 128 }),
  department: mysqlEnum("department", ["deck", "engine", "catering", "other"]).default("deck"),
  sortOrder: int("sortOrder").default(0),
});

// ─── Ship Types ───────────────────────────────────────────────────────────────
export const shipTypes = mysqlTable("ship_types", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 128 }).notNull(),
  nameAr: varchar("nameAr", { length: 128 }),
  iconUrl: varchar("iconUrl", { length: 1024 }),
});

// ─── Education Levels ─────────────────────────────────────────────────────────
export const educationLevels = mysqlTable("education_levels", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 128 }).notNull(),
  nameAr: varchar("nameAr", { length: 128 }),
});

// ─── Contact Types ────────────────────────────────────────────────────────────
export const contactTypes = mysqlTable("contact_types", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 64 }).notNull(),
  icon: varchar("icon", { length: 64 }),
});

// ─── Companies ────────────────────────────────────────────────────────────────
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  nameEn: varchar("nameEn", { length: 256 }).notNull(),
  nameAr: varchar("nameAr", { length: 256 }),
  registrationNumber: varchar("registrationNumber", { length: 128 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 32 }),
  address: text("address"),
  website: varchar("website", { length: 512 }),
  logoUrl: varchar("logoUrl", { length: 1024 }),
  countryId: int("countryId"),
  cityId: int("cityId"),
  description: text("description"),
  isApproved: boolean("isApproved").default(false),
  isBlocked: boolean("isBlocked").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Seafarers ────────────────────────────────────────────────────────────────
export const seafarers = mysqlTable("seafarers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  firstNameEn: varchar("firstNameEn", { length: 128 }),
  middleNameEn: varchar("middleNameEn", { length: 128 }),
  lastNameEn: varchar("lastNameEn", { length: 128 }),
  firstNameAr: varchar("firstNameAr", { length: 128 }),
  middleNameAr: varchar("middleNameAr", { length: 128 }),
  lastNameAr: varchar("lastNameAr", { length: 128 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 32 }),
  rankId: int("rankId"),
  educationLevelId: int("educationLevelId"),
  countryId: int("countryId"),
  cityId: int("cityId"),
  birthDate: timestamp("birthDate"),
  experienceMonths: int("experienceMonths").default(0),
  availabilityStatus: mysqlEnum("availabilityStatus", ["available", "onboard", "unavailable"]).default("available"),
  profileImageUrl: varchar("profileImageUrl", { length: 1024 }),
  cvUrl: varchar("cvUrl", { length: 1024 }),
  bio: text("bio"),
  isVerified: boolean("isVerified").default(false),
  isBlocked: boolean("isBlocked").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Seafarer Documents ───────────────────────────────────────────────────────
export const seafarerDocuments = mysqlTable("seafarer_documents", {
  id: int("id").autoincrement().primaryKey(),
  seafarerId: int("seafarerId").notNull(),
  docType: varchar("docType", { length: 128 }),
  fileUrl: varchar("fileUrl", { length: 1024 }).notNull(),
  fileName: varchar("fileName", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Seafarer Ship Types (many-to-many) ───────────────────────────────────────
export const seafarerShipTypes = mysqlTable("seafarer_ship_types", {
  id: int("id").autoincrement().primaryKey(),
  seafarerId: int("seafarerId").notNull(),
  shipTypeId: int("shipTypeId").notNull(),
});

// ─── Vessels ──────────────────────────────────────────────────────────────────
export const vessels = mysqlTable("vessels", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId"),
  nameEn: varchar("nameEn", { length: 256 }).notNull(),
  nameAr: varchar("nameAr", { length: 256 }),
  shipTypeId: int("shipTypeId"),
  flag: varchar("flag", { length: 128 }),
  imoNumber: varchar("imoNumber", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Job Listings ─────────────────────────────────────────────────────────────
export const jobListings = mysqlTable("job_listings", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId"),
  rankId: int("rankId"),
  shipTypeId: int("shipTypeId"),
  titleEn: varchar("titleEn", { length: 256 }),
  titleAr: varchar("titleAr", { length: 256 }),
  descriptionEn: text("descriptionEn"),
  descriptionAr: text("descriptionAr"),
  countryId: int("countryId"),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 8 }).default("USD"),
  contractDuration: varchar("contractDuration", { length: 128 }),
  isActive: boolean("isActive").default(true),
  publishedAt: timestamp("publishedAt").defaultNow(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Job Applications ─────────────────────────────────────────────────────────
export const jobApplications = mysqlTable("job_applications", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  seafarerId: int("seafarerId").notNull(),
  status: mysqlEnum("status", ["pending", "reviewed", "accepted", "rejected"]).default("pending"),
  coverLetter: text("coverLetter"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Verification Requests ────────────────────────────────────────────────────
export const verificationRequests = mysqlTable("verification_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  requestType: mysqlEnum("requestType", ["seafarer", "company"]).notNull(),
  documentUrl: varchar("documentUrl", { length: 1024 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
  adminNotes: text("adminNotes"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Blogs ────────────────────────────────────────────────────────────────────
export const blogs = mysqlTable("blogs", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId"),
  titleEn: varchar("titleEn", { length: 512 }).notNull(),
  titleAr: varchar("titleAr", { length: 512 }),
  contentEn: text("contentEn"),
  contentAr: text("contentAr"),
  excerptEn: text("excerptEn"),
  excerptAr: text("excerptAr"),
  imageUrl: varchar("imageUrl", { length: 1024 }),
  slug: varchar("slug", { length: 512 }).unique(),
  isPublished: boolean("isPublished").default(false),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Sliders ──────────────────────────────────────────────────────────────────
export const sliders = mysqlTable("sliders", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("titleEn", { length: 256 }),
  titleAr: varchar("titleAr", { length: 256 }),
  subtitleEn: varchar("subtitleEn", { length: 512 }),
  subtitleAr: varchar("subtitleAr", { length: 512 }),
  imageUrl: varchar("imageUrl", { length: 1024 }).notNull(),
  linkUrl: varchar("linkUrl", { length: 512 }),
  sortOrder: int("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── FAQs ─────────────────────────────────────────────────────────────────────
export const faqs = mysqlTable("faqs", {
  id: int("id").autoincrement().primaryKey(),
  questionEn: text("questionEn").notNull(),
  questionAr: text("questionAr"),
  answerEn: text("answerEn").notNull(),
  answerAr: text("answerAr"),
  sortOrder: int("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Pages ────────────────────────────────────────────────────────────────────
export const pages = mysqlTable("pages", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).unique().notNull(),
  titleEn: varchar("titleEn", { length: 256 }),
  titleAr: varchar("titleAr", { length: 256 }),
  contentEn: text("contentEn"),
  contentAr: text("contentAr"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  titleEn: varchar("titleEn", { length: 256 }),
  titleAr: varchar("titleAr", { length: 256 }),
  messageEn: text("messageEn"),
  messageAr: text("messageAr"),
  linkUrl: varchar("linkUrl", { length: 512 }),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Country = typeof countries.$inferSelect;
export type City = typeof cities.$inferSelect;
export type Rank = typeof ranks.$inferSelect;
export type ShipType = typeof shipTypes.$inferSelect;
export type EducationLevel = typeof educationLevels.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type Seafarer = typeof seafarers.$inferSelect;
export type JobListing = typeof jobListings.$inferSelect;
export type JobApplication = typeof jobApplications.$inferSelect;
export type VerificationRequest = typeof verificationRequests.$inferSelect;
export type Blog = typeof blogs.$inferSelect;
export type Slider = typeof sliders.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Vessel = typeof vessels.$inferSelect;
export type SeafarerDocument = typeof seafarerDocuments.$inferSelect;
