import { eq, desc, and, like, sql, count, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users, countries, cities, ranks, shipTypes, educationLevels,
  companies, seafarers, seafarerDocuments, seafarerShipTypes, vessels,
  jobListings, jobApplications, applicationNotes, verificationRequests, blogs, sliders,
  faqs, pages, notifications, contactTypes,
  posts, postLikes, postComments, crewAssignments
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      values[field] = value ?? null;
      updateSet[field] = value ?? null;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserByEmail(email: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
}

export async function getUserByPhone(phone: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  return result[0];
}

export async function getUserById(id: number) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function updateUserById(id: number, data: Partial<InsertUser>) {
  const db = await getDb(); if (!db) return;
  await db.update(users).set(data).where(eq(users.id, id));
}

export async function getAllUsers() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function countUsers() {
  const db = await getDb(); if (!db) return 0;
  const result = await db.select({ count: count() }).from(users);
  return result[0]?.count ?? 0;
}

// ─── Countries & Cities ──────────────────────────────────────────────────────
export async function getAllCountries() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(countries);
}

export async function getCitiesByCountry(countryId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(cities).where(eq(cities.countryId, countryId));
}

export async function upsertCountry(id: number | null, data: any) {
  const db = await getDb(); if (!db) return;
  if (id) await db.update(countries).set(data).where(eq(countries.id, id));
  else await db.insert(countries).values(data);
}

export async function upsertCity(id: number | null, data: any) {
  const db = await getDb(); if (!db) return;
  if (id) await db.update(cities).set(data).where(eq(cities.id, id));
  else await db.insert(cities).values(data);
}

// ─── Ranks ────────────────────────────────────────────────────────────────────
export async function getAllRanks() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(ranks).orderBy(ranks.sortOrder);
}

export async function upsertRank(id: number | null, data: any) {
  const db = await getDb(); if (!db) return;
  if (id) await db.update(ranks).set(data).where(eq(ranks.id, id));
  else await db.insert(ranks).values(data);
}

export async function deleteRank(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(ranks).where(eq(ranks.id, id));
}

// ─── Ship Types ───────────────────────────────────────────────────────────────
export async function getAllShipTypes() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(shipTypes);
}

export async function upsertShipType(id: number | null, data: any) {
  const db = await getDb(); if (!db) return;
  if (id) await db.update(shipTypes).set(data).where(eq(shipTypes.id, id));
  else await db.insert(shipTypes).values(data);
}

export async function deleteShipType(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(shipTypes).where(eq(shipTypes.id, id));
}

// ─── Education Levels ─────────────────────────────────────────────────────────
export async function getAllEducationLevels() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(educationLevels);
}

// ─── Companies ────────────────────────────────────────────────────────────────
export async function createCompany(data: any) {
  const db = await getDb(); if (!db) return;
  await db.insert(companies).values(data);
}

export async function getCompanies(opts?: { limit?: number; approved?: boolean }) {
  const db = await getDb(); if (!db) return [];
  let q = db.select().from(companies);
  if (opts?.approved !== undefined) q = q.where(eq(companies.isApproved, opts.approved)) as any;
  if (opts?.limit) q = q.limit(opts.limit) as any;
  return q.orderBy(desc(companies.createdAt));
}

export async function getCompanyById(id: number) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
  return result[0];
}

export async function getCompanyByUserId(userId: number) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(companies).where(eq(companies.userId, userId)).limit(1);
  return result[0];
}

export async function updateCompany(id: number, data: any) {
  const db = await getDb(); if (!db) return;
  await db.update(companies).set(data).where(eq(companies.id, id));
}

export async function countCompanies() {
  const db = await getDb(); if (!db) return 0;
  const result = await db.select({ count: count() }).from(companies);
  return result[0]?.count ?? 0;
}

// ─── Seafarers ────────────────────────────────────────────────────────────────
export async function createSeafarer(data: any) {
  const db = await getDb(); if (!db) return;
  await db.insert(seafarers).values(data);
}

export async function getSeafarers(opts?: { limit?: number; status?: string }) {
  const db = await getDb(); if (!db) return [];
  let q = db.select().from(seafarers);
  if (opts?.status) q = q.where(eq(seafarers.availabilityStatus, opts.status as any)) as any;
  if (opts?.limit) q = q.limit(opts.limit) as any;
  return q.orderBy(desc(seafarers.createdAt));
}

export async function getSeafarerById(id: number) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(seafarers).where(eq(seafarers.id, id)).limit(1);
  return result[0];
}

export async function getSeafarerByUserId(userId: number) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(seafarers).where(eq(seafarers.userId, userId)).limit(1);
  return result[0];
}

export async function updateSeafarer(id: number, data: any) {
  const db = await getDb(); if (!db) return;
  await db.update(seafarers).set(data).where(eq(seafarers.id, id));
}

export async function countSeafarers() {
  const db = await getDb(); if (!db) return 0;
  const result = await db.select({ count: count() }).from(seafarers);
  return result[0]?.count ?? 0;
}

export async function getSeafarerDocuments(seafarerId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(seafarerDocuments).where(eq(seafarerDocuments.seafarerId, seafarerId));
}

export async function addSeafarerDocument(data: any) {
  const db = await getDb(); if (!db) return;
  await db.insert(seafarerDocuments).values(data);
}

export async function deleteSeafarerDocument(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(seafarerDocuments).where(eq(seafarerDocuments.id, id));
}

export async function getSeafarerShipTypes(seafarerId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(seafarerShipTypes).where(eq(seafarerShipTypes.seafarerId, seafarerId));
}

// ─── Vessels ──────────────────────────────────────────────────────────────────
export async function getVesselsByCompany(companyId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(vessels).where(eq(vessels.companyId, companyId));
}

export async function createVessel(data: any) {
  const db = await getDb(); if (!db) return;
  await db.insert(vessels).values(data);
}

// ─── Job Listings ─────────────────────────────────────────────────────────────
export async function createJob(data: any) {
  const db = await getDb(); if (!db) return;
  await db.insert(jobListings).values(data);
}

export async function getJobs(opts?: { limit?: number; active?: boolean; companyId?: number }) {
  const db = await getDb(); if (!db) return [];
  const conditions = [];
  if (opts?.active !== undefined) conditions.push(eq(jobListings.isActive, opts.active));
  if (opts?.companyId) conditions.push(eq(jobListings.companyId, opts.companyId));
  let q = conditions.length > 0
    ? db.select().from(jobListings).where(and(...conditions))
    : db.select().from(jobListings);
  if (opts?.limit) q = q.limit(opts.limit) as any;
  return q.orderBy(desc(jobListings.createdAt));
}

export async function getJobById(id: number) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(jobListings).where(eq(jobListings.id, id)).limit(1);
  return result[0];
}

export async function updateJob(id: number, data: any) {
  const db = await getDb(); if (!db) return;
  await db.update(jobListings).set(data).where(eq(jobListings.id, id));
}

export async function deleteJob(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(jobListings).where(eq(jobListings.id, id));
}

export async function countJobs() {
  const db = await getDb(); if (!db) return 0;
  const result = await db.select({ count: count() }).from(jobListings).where(eq(jobListings.isActive, true));
  return result[0]?.count ?? 0;
}

// ─── Job Applications ─────────────────────────────────────────────────────────
export async function createJobApplication(data: any) {
  const db = await getDb(); if (!db) return;
  await db.insert(jobApplications).values(data);
}

export async function getJobApplications(jobId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(jobApplications).where(eq(jobApplications.jobId, jobId)).orderBy(desc(jobApplications.createdAt));
}

export async function getSeafarerApplications(seafarerId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(jobApplications).where(eq(jobApplications.seafarerId, seafarerId)).orderBy(desc(jobApplications.createdAt));
}

export async function updateJobApplication(id: number, data: any) {
  const db = await getDb(); if (!db) return;
  await db.update(jobApplications).set(data).where(eq(jobApplications.id, id));
}

// ─── Verification Requests ────────────────────────────────────────────────────
export async function createVerificationRequest(data: any) {
  const db = await getDb(); if (!db) return;
  await db.insert(verificationRequests).values(data);
}

export async function getVerificationRequests(opts?: { status?: string }) {
  const db = await getDb(); if (!db) return [];
  if (opts?.status) return db.select().from(verificationRequests).where(eq(verificationRequests.status, opts.status as any)).orderBy(desc(verificationRequests.createdAt));
  return db.select().from(verificationRequests).orderBy(desc(verificationRequests.createdAt));
}

export async function getVerificationByUserId(userId: number) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(verificationRequests).where(eq(verificationRequests.userId, userId)).orderBy(desc(verificationRequests.createdAt)).limit(1);
  return result[0];
}

export async function updateVerificationRequest(id: number, data: any) {
  const db = await getDb(); if (!db) return;
  await db.update(verificationRequests).set(data).where(eq(verificationRequests.id, id));
}

// ─── Blogs ────────────────────────────────────────────────────────────────────
export async function createBlog(data: any) {
  const db = await getDb(); if (!db) return;
  await db.insert(blogs).values(data);
}

export async function getBlogs(opts?: { limit?: number; published?: boolean }) {
  const db = await getDb(); if (!db) return [];
  let q = opts?.published !== undefined
    ? db.select().from(blogs).where(eq(blogs.isPublished, opts.published))
    : db.select().from(blogs);
  if (opts?.limit) q = q.limit(opts.limit) as any;
  return q.orderBy(desc(blogs.createdAt));
}

export async function getBlogById(id: number) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  return result[0];
}

export async function getBlogBySlug(slug: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1);
  return result[0];
}

export async function updateBlog(id: number, data: any) {
  const db = await getDb(); if (!db) return;
  await db.update(blogs).set(data).where(eq(blogs.id, id));
}

export async function deleteBlog(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(blogs).where(eq(blogs.id, id));
}

// ─── Sliders ──────────────────────────────────────────────────────────────────
export async function getActiveSliders() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(sliders).where(eq(sliders.isActive, true)).orderBy(sliders.sortOrder);
}

export async function getAllSliders() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(sliders).orderBy(sliders.sortOrder);
}

export async function upsertSlider(id: number | null, data: any) {
  const db = await getDb(); if (!db) return;
  if (id) await db.update(sliders).set(data).where(eq(sliders.id, id));
  else await db.insert(sliders).values(data);
}

export async function deleteSlider(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(sliders).where(eq(sliders.id, id));
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────
export async function getActiveFaqs() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(faqs).where(eq(faqs.isActive, true)).orderBy(faqs.sortOrder);
}

export async function getAllFaqs() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(faqs).orderBy(faqs.sortOrder);
}

export async function upsertFaq(id: number | null, data: any) {
  const db = await getDb(); if (!db) return;
  if (id) await db.update(faqs).set(data).where(eq(faqs.id, id));
  else await db.insert(faqs).values(data);
}

export async function deleteFaq(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(faqs).where(eq(faqs.id, id));
}

// ─── Pages ────────────────────────────────────────────────────────────────────
export async function getPageBySlug(slug: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return result[0];
}

export async function updatePage(slug: string, data: any) {
  const db = await getDb(); if (!db) return;
  await db.update(pages).set(data).where(eq(pages.slug, slug));
}

// ─── Notifications ────────────────────────────────────────────────────────────
export async function getUserNotifications(userId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(30);
}

export async function createNotification(data: any) {
  const db = await getDb(); if (!db) return;
  await db.insert(notifications).values(data);
}

export async function markNotificationRead(id: number) {
  const db = await getDb(); if (!db) return;
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}

export async function markAllNotificationsRead(userId: number) {
  const db = await getDb(); if (!db) return;
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
}

export async function countUnreadNotifications(userId: number) {
  const db = await getDb(); if (!db) return 0;
  const result = await db.select({ count: count() }).from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return result[0]?.count ?? 0;
}

// ─── Posts (Social Feed) ──────────────────────────────────────────────────────
export async function createPost(data: { userId: number; content?: string; imageUrl?: string }) {
  const db = await getDb(); if (!db) return null;
  const result = await db.insert(posts).values(data);
  return result;
}

export async function getPosts(opts?: { limit?: number; userId?: number }) {
  const db = await getDb(); if (!db) return [];
  let query = db.select({
    post: posts,
    user: { id: users.id, name: users.name, avatarUrl: users.avatarUrl, accountType: users.accountType, isVerified: users.isVerified },
  }).from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.isDeleted, false))
    .orderBy(desc(posts.createdAt))
    .limit(opts?.limit ?? 20);
  return query;
}

export async function getPostById(id: number) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(posts).where(and(eq(posts.id, id), eq(posts.isDeleted, false))).limit(1);
  return result[0];
}

export async function deletePost(id: number, userId: number) {
  const db = await getDb(); if (!db) return;
  await db.update(posts).set({ isDeleted: true }).where(and(eq(posts.id, id), eq(posts.userId, userId)));
}

export async function togglePostLike(postId: number, userId: number): Promise<{ liked: boolean }> {
  const db = await getDb(); if (!db) return { liked: false };
  const existing = await db.select().from(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId))).limit(1);
  if (existing.length > 0) {
    await db.delete(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    await db.update(posts).set({ likesCount: sql`GREATEST(likesCount - 1, 0)` }).where(eq(posts.id, postId));
    return { liked: false };
  } else {
    await db.insert(postLikes).values({ postId, userId });
    await db.update(posts).set({ likesCount: sql`likesCount + 1` }).where(eq(posts.id, postId));
    return { liked: true };
  }
}

export async function getPostLikedByUser(postId: number, userId: number): Promise<boolean> {
  const db = await getDb(); if (!db) return false;
  const result = await db.select().from(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId))).limit(1);
  return result.length > 0;
}

export async function addPostComment(data: { postId: number; userId: number; content: string }) {
  const db = await getDb(); if (!db) return null;
  await db.insert(postComments).values(data);
  await db.update(posts).set({ commentsCount: sql`commentsCount + 1` }).where(eq(posts.id, data.postId));
}

export async function getPostComments(postId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select({
    comment: postComments,
    user: { id: users.id, name: users.name, avatarUrl: users.avatarUrl },
  }).from(postComments)
    .leftJoin(users, eq(postComments.userId, users.id))
    .where(and(eq(postComments.postId, postId), eq(postComments.isDeleted, false)))
    .orderBy(postComments.createdAt);
}

export async function deletePostComment(id: number, userId: number) {
  const db = await getDb(); if (!db) return;
  const comment = await db.select().from(postComments).where(eq(postComments.id, id)).limit(1);
  if (comment[0]) {
    await db.update(postComments).set({ isDeleted: true }).where(and(eq(postComments.id, id), eq(postComments.userId, userId)));
    await db.update(posts).set({ commentsCount: sql`GREATEST(commentsCount - 1, 0)` }).where(eq(posts.id, comment[0].postId));
  }
}

// ─── Crew Assignments ─────────────────────────────────────────────────────────
export async function createCrewAssignment(data: any) {
  const db = await getDb(); if (!db) return null;
  await db.insert(crewAssignments).values(data);
}

export async function getCrewByVessel(vesselId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select({
    assignment: crewAssignments,
    seafarer: { id: seafarers.id, firstNameEn: seafarers.firstNameEn, lastNameEn: seafarers.lastNameEn, firstNameAr: seafarers.firstNameAr, lastNameAr: seafarers.lastNameAr, profileImageUrl: seafarers.profileImageUrl, isVerified: seafarers.isVerified },
    rank: { id: ranks.id, nameEn: ranks.nameEn, nameAr: ranks.nameAr },
  }).from(crewAssignments)
    .leftJoin(seafarers, eq(crewAssignments.seafarerId, seafarers.id))
    .leftJoin(ranks, eq(crewAssignments.rankId, ranks.id))
    .where(eq(crewAssignments.vesselId, vesselId))
    .orderBy(desc(crewAssignments.createdAt));
}

export async function getCrewByCompany(companyId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select({
    assignment: crewAssignments,
    seafarer: { id: seafarers.id, firstNameEn: seafarers.firstNameEn, lastNameEn: seafarers.lastNameEn, firstNameAr: seafarers.firstNameAr, lastNameAr: seafarers.lastNameAr, profileImageUrl: seafarers.profileImageUrl, isVerified: seafarers.isVerified },
    vessel: { id: vessels.id, nameEn: vessels.nameEn, nameAr: vessels.nameAr },
    rank: { id: ranks.id, nameEn: ranks.nameEn, nameAr: ranks.nameAr },
  }).from(crewAssignments)
    .leftJoin(seafarers, eq(crewAssignments.seafarerId, seafarers.id))
    .leftJoin(vessels, eq(crewAssignments.vesselId, vessels.id))
    .leftJoin(ranks, eq(crewAssignments.rankId, ranks.id))
    .where(eq(crewAssignments.companyId, companyId))
    .orderBy(desc(crewAssignments.createdAt));
}

export async function updateCrewAssignment(id: number, data: any) {
  const db = await getDb(); if (!db) return;
  await db.update(crewAssignments).set(data).where(eq(crewAssignments.id, id));
}

export async function deleteCrewAssignment(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(crewAssignments).where(eq(crewAssignments.id, id));
}

// ─── Application Notes (ATS) ─────────────────────────────────────────────────
export async function addApplicationNote(data: { applicationId: number; authorId: number; note: string }) {
  const db = await getDb(); if (!db) return;
  await db.insert(applicationNotes).values(data);
}

export async function getApplicationNotes(applicationId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select({
    note: applicationNotes,
    author: { id: users.id, name: users.name, avatarUrl: users.avatarUrl },
  }).from(applicationNotes)
    .leftJoin(users, eq(applicationNotes.authorId, users.id))
    .where(eq(applicationNotes.applicationId, applicationId))
    .orderBy(applicationNotes.createdAt);
}

export async function getJobApplicationsForCompany(companyId: number, opts?: { status?: string; jobId?: number }) {
  const db = await getDb(); if (!db) return [];
  const conditions = [eq(jobListings.companyId, companyId)];
  if (opts?.status) conditions.push(eq(jobApplications.status, opts.status as any));
  if (opts?.jobId) conditions.push(eq(jobApplications.jobId, opts.jobId));
  return db.select({
    application: jobApplications,
    seafarer: { id: seafarers.id, firstNameEn: seafarers.firstNameEn, lastNameEn: seafarers.lastNameEn, firstNameAr: seafarers.firstNameAr, lastNameAr: seafarers.lastNameAr, profileImageUrl: seafarers.profileImageUrl, isVerified: seafarers.isVerified, experienceMonths: seafarers.experienceMonths },
    job: { id: jobListings.id, titleEn: jobListings.titleEn, titleAr: jobListings.titleAr },
  }).from(jobApplications)
    .leftJoin(seafarers, eq(jobApplications.seafarerId, seafarers.id))
    .leftJoin(jobListings, eq(jobApplications.jobId, jobListings.id))
    .where(and(...conditions))
    .orderBy(desc(jobApplications.createdAt));
}

// ─── Advanced Search ──────────────────────────────────────────────────────────
export async function searchJobs(opts: {
  query?: string;
  rankId?: number;
  shipTypeId?: number;
  countryId?: number;
  minSalary?: number;
  maxSalary?: number;
  limit?: number;
}) {
  const db = await getDb(); if (!db) return [];
  const conditions: any[] = [eq(jobListings.isActive, true)];
  if (opts.rankId) conditions.push(eq(jobListings.rankId, opts.rankId));
  if (opts.shipTypeId) conditions.push(eq(jobListings.shipTypeId, opts.shipTypeId));
  if (opts.countryId) conditions.push(eq(jobListings.countryId, opts.countryId));
  if (opts.query) {
    conditions.push(or(
      like(jobListings.titleEn, `%${opts.query}%`),
      like(jobListings.titleAr, `%${opts.query}%`),
      like(jobListings.descriptionEn, `%${opts.query}%`)
    ));
  }
  return db.select({
    job: jobListings,
    company: { id: companies.id, nameEn: companies.nameEn, nameAr: companies.nameAr, logoUrl: companies.logoUrl, isApproved: companies.isApproved },
    rank: { id: ranks.id, nameEn: ranks.nameEn, nameAr: ranks.nameAr },
    shipType: { id: shipTypes.id, nameEn: shipTypes.nameEn, nameAr: shipTypes.nameAr },
  }).from(jobListings)
    .leftJoin(companies, eq(jobListings.companyId, companies.id))
    .leftJoin(ranks, eq(jobListings.rankId, ranks.id))
    .leftJoin(shipTypes, eq(jobListings.shipTypeId, shipTypes.id))
    .where(and(...conditions))
    .orderBy(desc(jobListings.publishedAt))
    .limit(opts.limit ?? 50);
}

export async function searchSeafarers(opts: {
  query?: string;
  rankId?: number;
  shipTypeId?: number;
  countryId?: number;
  availabilityStatus?: string;
  minExperienceMonths?: number;
  limit?: number;
}) {
  const db = await getDb(); if (!db) return [];
  const conditions: any[] = [eq(seafarers.isBlocked, false)];
  if (opts.rankId) conditions.push(eq(seafarers.rankId, opts.rankId));
  if (opts.countryId) conditions.push(eq(seafarers.countryId, opts.countryId));
  if (opts.availabilityStatus) conditions.push(eq(seafarers.availabilityStatus, opts.availabilityStatus as any));
  if (opts.minExperienceMonths) conditions.push(sql`${seafarers.experienceMonths} >= ${opts.minExperienceMonths}`);
  if (opts.query) {
    conditions.push(or(
      like(seafarers.firstNameEn, `%${opts.query}%`),
      like(seafarers.lastNameEn, `%${opts.query}%`),
      like(seafarers.firstNameAr, `%${opts.query}%`),
      like(seafarers.lastNameAr, `%${opts.query}%`),
      like(seafarers.bio, `%${opts.query}%`)
    ));
  }
  return db.select({
    seafarer: seafarers,
    rank: { id: ranks.id, nameEn: ranks.nameEn, nameAr: ranks.nameAr },
    country: { id: countries.id, nameEn: countries.nameEn, nameAr: countries.nameAr },
  }).from(seafarers)
    .leftJoin(ranks, eq(seafarers.rankId, ranks.id))
    .leftJoin(countries, eq(seafarers.countryId, countries.id))
    .where(and(...conditions))
    .orderBy(desc(seafarers.createdAt))
    .limit(opts.limit ?? 50);
}

// ─── Document Expiry ──────────────────────────────────────────────────────────
export async function getExpiringDocuments(daysAhead: number) {
  const db = await getDb(); if (!db) return [];
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  return db.select({
    doc: seafarerDocuments,
    seafarer: { id: seafarers.id, firstNameEn: seafarers.firstNameEn, lastNameEn: seafarers.lastNameEn, email: seafarers.email },
    user: { id: users.id, email: users.email, name: users.name },
  }).from(seafarerDocuments)
    .leftJoin(seafarers, eq(seafarerDocuments.seafarerId, seafarers.id))
    .leftJoin(users, eq(seafarers.userId, users.id))
    .where(and(
      sql`${seafarerDocuments.expiryDate} IS NOT NULL`,
      sql`${seafarerDocuments.expiryDate} <= ${futureDate}`,
      sql`${seafarerDocuments.expiryDate} >= NOW()`
    ));
}

export async function updateDocumentExpiry(id: number, expiryDate: Date) {
  const db = await getDb(); if (!db) return;
  await db.update(seafarerDocuments).set({ expiryDate }).where(eq(seafarerDocuments.id, id));
}
