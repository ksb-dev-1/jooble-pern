import { Pool } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-serverless";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

import * as schema from "../db/schema.js";
import { placeholderJobs } from "./jobs.js";

dotenv.config();

const employerId = process.env.EMPLOYER_ID!;

async function insertJobs() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const db = drizzle(pool, { schema });

  try {
    for (const jobData of placeholderJobs) {
      const skills = jobData.skills.map((skill) => skill.toLowerCase());

      // Markdown → HTML → Safe HTML
      const rawHtml = await marked.parse(jobData.description);
      const safeHtml = sanitizeHtml(rawHtml);

      // Insert the job - let PostgreSQL generate the UUID
      const [insertedJob] = await db
        .insert(schema.job)
        .values({
          companyLogo: jobData.companyLogo,
          companyName: jobData.companyName,
          role: jobData.role,
          jobType: jobData.jobType,
          jobMode: jobData.jobMode,
          city: jobData.city,
          state: jobData.state,
          country: jobData.country,
          salaryMin: jobData.salaryMin,
          salaryMax: jobData.salaryMax,
          salaryPeriod: jobData.salaryPeriod,
          currency: jobData.currency,
          isSalaryVisible: jobData.isSalaryVisible,
          experienceMin: jobData.experienceMin,
          experienceMax: jobData.experienceMax,
          openings: jobData.openings,
          description: safeHtml,
          jobStatus: jobData.jobStatus,
          isFeatured: jobData.isFeatured,
          employerId: employerId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Check if job was inserted successfully
      if (!insertedJob) {
        throw new Error("Failed to insert job");
      }

      // Handle skills
      for (const skillName of skills) {
        // Try to get existing skill or create new one
        let existingSkill = await db.query.skill.findFirst({
          where: (skills, { eq }) => eq(skills.name, skillName),
        });

        if (!existingSkill) {
          const [newSkill] = await db
            .insert(schema.skill)
            .values({
              name: skillName,
            })
            .returning();

          if (!newSkill) {
            throw new Error(`Failed to create skill: ${skillName}`);
          }
          existingSkill = newSkill;
        }

        // Create job-skill relationship
        await db.insert(schema.jobSkill).values({
          jobId: insertedJob.id,
          skillId: existingSkill.id,
        });
      }
    }

    console.log("✅ Jobs inserted successfully");
  } catch (error) {
    console.error("❌ Error inserting jobs:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

insertJobs();
