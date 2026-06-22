import { z } from "zod";

export const personalDetailsSchema = z.object({
  full_name:   z.string().min(2, "Full name is required"),
  email:       z.email("Valid email required"),
  phone:       z.string().min(10, "Valid phone number required"),
  dob:         z.string().min(1, "Date of birth required"),
  gender:      z.enum(["male", "female", "other"]),
  address:     z.string().min(5, "Address required"),
  city:        z.string().min(1, "City required"),
  state:       z.string().min(1, "State required"),
  pincode:     z.string().length(6, "6-digit pincode required"),
  nationality: z.string().optional(),
  category:    z.enum(["general", "obc", "sc", "st", "ews", "other"]),
});

export const academicHistorySchema = z.object({
  tenth_board:      z.string().min(1, "10th Board required"),
  tenth_school:     z.string().min(1, "School name required"),
  tenth_year:       z.string().min(4, "Year required"),
  tenth_percentage: z.number().min(0).max(100),
  twelfth_board:    z.string().optional(),
  twelfth_school:   z.string().optional(),
  twelfth_year:     z.string().optional(),
  twelfth_percentage: z.number().min(0).max(100).optional(),
  entrance_exam:    z.string().optional(),
  entrance_score:   z.string().optional(),
});

export const programChoiceSchema = z.object({
  program_id:   z.string().uuid("Select a program"),
  preference_1: z.string().optional(),
  preference_2: z.string().optional(),
});

export const applicationStepSchema = z.object({
  application_id: z.string().uuid(),
  step:           z.number().min(1).max(6),
  form_data:      z.record(z.string(), z.unknown()),
});

export const applicationSubmitSchema = z.object({
  application_id: z.string().uuid(),
});

export type PersonalDetails   = z.infer<typeof personalDetailsSchema>;
export type AcademicHistory   = z.infer<typeof academicHistorySchema>;
export type ProgramChoice     = z.infer<typeof programChoiceSchema>;
