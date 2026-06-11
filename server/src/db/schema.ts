import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/* =========================================================
   ENUMS
========================================================= */

export const userRoleEnum = pgEnum("user_role", [
  "NOT_ASSIGNED",
  "JOB_SEEKER",
  "EMPLOYER",
]);

export const jobStatusEnum = pgEnum("job_status", ["OPEN", "CLOSED"]);

export const applicationStatusEnum = pgEnum("application_status", [
  "PENDING",
  "REVIEWED",
  "SHORTLISTED",
  "OFFERED",
  "REJECTED",
]);

export const jobTypeEnum = pgEnum("job_type", [
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
  "CONTRACT",
]);

export const jobModeEnum = pgEnum("job_mode", ["ONSITE", "REMOTE", "HYBRID"]);

export const currencyEnum = pgEnum("currency", ["USD", "INR", "EUR"]);

export const salaryPeriodEnum = pgEnum("salary_period", ["YEARLY", "MONTHLY"]);

export const socialPlatformEnum = pgEnum("social_platform", [
  "GITHUB",
  "LINKEDIN",
  "PORTFOLIO",
  "X",
  "YOUTUBE",
  "OTHER",
]);

/* =========================================================
   TABLES
========================================================= */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: userRoleEnum("role").default("NOT_ASSIGNED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("account_userId_idx").on(table.userId),
    index("account_providerId_accountId_idx").on(
      table.providerId,
      table.accountId,
    ),
  ],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const skill = pgTable("skill", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export const jobSkill = pgTable(
  "job_skill",
  {
    jobId: uuid("job_id").notNull(),
    skillId: uuid("skill_id").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.jobId, table.skillId] }),
    index("job_skill_skillId_idx").on(table.skillId),
  ],
);

export const jobSeekerSkill = pgTable(
  "job_seeker_skill",
  {
    profileId: uuid("profile_id").notNull(),
    skillId: uuid("skill_id").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.profileId, table.skillId] }),
    index("job_seeker_skill_skillId_idx").on(table.skillId),
  ],
);

export const job = pgTable(
  "job",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employerId: text("employer_id").references(() => user.id, {
      onDelete: "set null",
    }),
    companyName: text("company_name").notNull(),
    companyLogo: text("company_logo"),
    role: text("role").notNull(),
    jobType: jobTypeEnum("job_type").default("FULL_TIME").notNull(),
    jobMode: jobModeEnum("job_mode").default("ONSITE").notNull(),
    city: text("city").notNull(),
    state: text("state").notNull(),
    country: text("country").notNull(),
    salaryMin: integer("salary_min").notNull(),
    salaryMax: integer("salary_max").notNull(),
    currency: currencyEnum("currency").default("INR").notNull(),
    salaryPeriod: salaryPeriodEnum("salary_period").default("YEARLY").notNull(),
    isSalaryVisible: boolean("is_salary_visible").default(true).notNull(),
    experienceMin: integer("experience_min").notNull(),
    experienceMax: integer("experience_max").notNull(),
    openings: integer("openings").default(1).notNull(),
    description: text("description").notNull(),
    jobStatus: jobStatusEnum("job_status").default("OPEN").notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("job_jobStatus_isDeleted_createdAt_idx").on(
      table.jobStatus,
      table.isDeleted,
      table.createdAt,
    ),
    index("job_employerId_idx").on(table.employerId),
    index("job_city_state_country_idx").on(
      table.city,
      table.state,
      table.country,
    ),
    index("job_jobType_idx").on(table.jobType),
    index("job_jobMode_idx").on(table.jobMode),
    index("job_createdAt_idx").on(table.createdAt),
  ],
);

export const bookmark = pgTable(
  "bookmark",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    jobId: uuid("job_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("bookmark_userId_idx").on(table.userId),
    index("bookmark_jobId_idx").on(table.jobId),
  ],
);

export const jobApplication = pgTable(
  "job_application",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    jobId: uuid("job_id").notNull(),
    applicationStatus: applicationStatusEnum("application_status")
      .default("PENDING")
      .notNull(),
    resumeUrl: text("resume_url"),
    coverLetter: text("cover_letter"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("job_application_userId_idx").on(table.userId),
    index("job_application_jobId_idx").on(table.jobId),
    index("job_application_applicationStatus_idx").on(table.applicationStatus),
  ],
);

export const resume = pgTable("resume", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(),
  publicId: text("public_id").notNull(),
  url: text("url").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const employerProfile = pgTable(
  "employer_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().unique(),
    companyName: text("company_name"),
    industry: text("industry"),
    website: text("website"),
    city: text("city"),
    state: text("state"),
    country: text("country"),
    about: text("about"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("employer_profile_companyName_idx").on(table.companyName)],
);

export const jobSeekerProfile = pgTable(
  "job_seeker_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().unique(),
    experience: integer("experience"),
    city: text("city"),
    state: text("state"),
    country: text("country"),
    about: text("about"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("job_seeker_profile_experience_idx").on(table.experience),
    index("job_seeker_profile_city_state_country_idx").on(
      table.city,
      table.state,
      table.country,
    ),
  ],
);

export const project = pgTable(
  "project",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    profileId: uuid("profile_id").notNull(),
    name: text("name").notNull(),
    link: text("link"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("project_profileId_idx").on(table.profileId)],
);

export const socialLink = pgTable(
  "social_link",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    profileId: uuid("profile_id").notNull(),
    platform: socialPlatformEnum("platform").notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("social_link_profileId_idx").on(table.profileId)],
);

/* =========================================================
   RELATIONS
========================================================= */

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  jobs: many(job),
  applications: many(jobApplication),
  bookmarks: many(bookmark),
  resume: one(resume),
  employerProfile: one(employerProfile),
  jobSeekerProfile: one(jobSeekerProfile),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const skillRelations = relations(skill, ({ many }) => ({
  jobSkills: many(jobSkill),
  seekerSkills: many(jobSeekerSkill),
}));

export const jobSkillRelations = relations(jobSkill, ({ one }) => ({
  job: one(job, {
    fields: [jobSkill.jobId],
    references: [job.id],
  }),
  skill: one(skill, {
    fields: [jobSkill.skillId],
    references: [skill.id],
  }),
}));

export const jobSeekerSkillRelations = relations(jobSeekerSkill, ({ one }) => ({
  profile: one(jobSeekerProfile, {
    fields: [jobSeekerSkill.profileId],
    references: [jobSeekerProfile.id],
  }),
  skill: one(skill, {
    fields: [jobSeekerSkill.skillId],
    references: [skill.id],
  }),
}));

export const jobRelations = relations(job, ({ one, many }) => ({
  employer: one(user, {
    fields: [job.employerId],
    references: [user.id],
  }),
  skills: many(jobSkill),
  bookmarks: many(bookmark),
  applications: many(jobApplication),
}));

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
  user: one(user, {
    fields: [bookmark.userId],
    references: [user.id],
  }),
  job: one(job, {
    fields: [bookmark.jobId],
    references: [job.id],
  }),
}));

export const jobApplicationRelations = relations(jobApplication, ({ one }) => ({
  user: one(user, {
    fields: [jobApplication.userId],
    references: [user.id],
  }),
  job: one(job, {
    fields: [jobApplication.jobId],
    references: [job.id],
  }),
}));

export const resumeRelations = relations(resume, ({ one }) => ({
  user: one(user, {
    fields: [resume.userId],
    references: [user.id],
  }),
}));

export const employerProfileRelations = relations(
  employerProfile,
  ({ one }) => ({
    user: one(user, {
      fields: [employerProfile.userId],
      references: [user.id],
    }),
  }),
);

export const jobSeekerProfileRelations = relations(
  jobSeekerProfile,
  ({ one, many }) => ({
    user: one(user, {
      fields: [jobSeekerProfile.userId],
      references: [user.id],
    }),
    skills: many(jobSeekerSkill),
    projects: many(project),
    socials: many(socialLink),
  }),
);

export const projectRelations = relations(project, ({ one }) => ({
  profile: one(jobSeekerProfile, {
    fields: [project.profileId],
    references: [jobSeekerProfile.id],
  }),
}));

export const socialLinkRelations = relations(socialLink, ({ one }) => ({
  profile: one(jobSeekerProfile, {
    fields: [socialLink.profileId],
    references: [jobSeekerProfile.id],
  }),
}));
