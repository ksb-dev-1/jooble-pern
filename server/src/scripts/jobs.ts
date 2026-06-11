import {
  currencyEnum,
  jobModeEnum,
  jobStatusEnum,
  jobTypeEnum,
  salaryPeriodEnum,
} from "../db/schema.js";

type PlaceholderJob = {
  companyLogo: string;
  companyName: string;
  role: string;
  experienceMin: number;
  experienceMax: number;
  jobType: (typeof jobTypeEnum.enumValues)[number];
  jobMode: (typeof jobModeEnum.enumValues)[number];
  city: string;
  state: string;
  country: string;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: (typeof salaryPeriodEnum.enumValues)[number];
  currency: (typeof currencyEnum.enumValues)[number];
  isSalaryVisible: boolean;
  jobStatus: (typeof jobStatusEnum.enumValues)[number];
  openings: number;
  isFeatured: boolean;
  skills: string[];
  description: string;
};

export const placeholderJobs: PlaceholderJob[] = [
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Adobe",
    companyName: "Adobe",
    role: "UI/UX Designer",
    experienceMin: 2,
    experienceMax: 4,
    jobType: "FULL_TIME",
    jobMode: "REMOTE",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    salaryMin: 1000000,
    salaryMax: 1400000,
    salaryPeriod: "YEARLY",
    currency: "INR",
    isSalaryVisible: true,
    jobStatus: "OPEN",
    openings: 1,
    isFeatured: false,
    skills: ["figma", "ux design", "wireframing", "prototyping"],
    description: `
As a UI/UX Designer at Adobe, you will shape intuitive and visually engaging user experiences for creative products used by millions of designers, photographers, and creators worldwide. You will work closely with product managers and engineers to translate complex ideas into elegant, user-friendly interfaces. Your work will help define how users interact with Adobe's tools, ensuring seamless workflows, accessibility, and delightful visual design. This role is ideal for someone passionate about solving real user problems through thoughtful design and innovation.

#### Responsibilities
- Design user interfaces and user flows
- Create wireframes, prototypes, and design systems
- Conduct usability testing and iterate on feedback
- Collaborate closely with product and engineering teams

#### Requirements
- 2–4 years of UI/UX design experience
- Strong proficiency with Figma
- Solid understanding of user-centered design principles
- A strong design portfolio

#### Why Join Us
- Design products used by global creators
- Collaborative and design-driven culture
- Strong focus on innovation and creativity
`,
  },
  {
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Neilsen",
    companyName: "Nielsen",
    role: "User Research Analyst",
    experienceMin: 1,
    experienceMax: 2,
    jobType: "FULL_TIME",
    jobMode: "ONSITE",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    salaryMin: 800000,
    salaryMax: 1000000,
    salaryPeriod: "YEARLY",
    currency: "INR",
    isSalaryVisible: true,
    jobStatus: "OPEN",
    openings: 2,
    isFeatured: false,
    skills: ["user research", "interviews", "survey design", "analysis"],
    description: `
As a User Research Analyst at Nielsen, you will conduct qualitative and quantitative research to uncover user behaviors, motivations, and pain points, turning insights into clear recommendations that guide product teams in creating more effective and user-friendly experiences across digital platforms and data-driven services.

#### Responsibilities
- Conduct user interviews and surveys
- Analyze behavioral data and research findings
- Translate insights into clear recommendations
- Work with UX and product teams

#### Requirements
- 1–3 years of research or analytics experience
- Strong analytical and communication skills
- Experience with research methodologies

#### Why Join Us
- Work with data-driven decision making
- Influence product and user experience strategy
`,
  },
];
