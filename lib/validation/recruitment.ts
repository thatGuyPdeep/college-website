import { z } from "zod";

export const facultyApplicantSchema = z.object({
  full_name:    z.string().min(2, "Full name required"),
  email:        z.email("Valid email required"),
  phone:        z.string().min(10, "Valid phone required"),
  address:      z.string().min(5, "Address required"),
  current_org:  z.string().optional(),
  current_role: z.string().optional(),
  total_exp_years: z.number().min(0),
  teaching_exp_years: z.number().min(0),
  qualifications: z.string().min(2, "Qualifications required"),
  specialization: z.string().min(2, "Specialization required"),
  experience: z.array(z.object({
    organization: z.string(),
    designation:  z.string(),
    from_year:    z.string(),
    to_year:      z.string(),
    type:         z.enum(["teaching", "industry", "research"]),
  })).default([]),
});

export type FacultyApplicant = z.infer<typeof facultyApplicantSchema>;
