import { z } from "zod";

export const athleteRegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  school: z.string().min(1, "School is required"),
  graduationYear: z.coerce.number().int().min(2000).max(2100),
  sport: z.string().min(1, "Sport is required"),
  position: z.string().optional().or(z.literal("")),
});

export const parentRegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  athleteName: z.string().optional().or(z.literal("")),
  relationship: z.string().optional().or(z.literal("")),
});

export const agentRegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agency: z.string().optional().or(z.literal("")),
  title: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export const coachRegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  school: z.string().min(1, "School is required"),
  organization: z.string().optional().or(z.literal("")),
  title: z.string().optional().or(z.literal("")),
  sport: z.string().optional().or(z.literal("")),
});

export const athleteProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  photoUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  height: z.coerce.number().int().min(36).max(96).optional().or(z.literal("")),
  weight: z.coerce.number().int().min(50).max(500).optional().or(z.literal("")),
  gpa: z.coerce.number().min(0).max(5).optional().or(z.literal("")),
  satScore: z.coerce.number().int().min(400).max(1600).optional().or(z.literal("")),
  actScore: z.coerce.number().int().min(1).max(36).optional().or(z.literal("")),
  intendedMajor: z.string().optional().or(z.literal("")),
  sport: z.string().min(1),
  position: z.string().optional().or(z.literal("")),
  school: z.string().min(1),
  graduationYear: z.coerce.number().int().min(2000).max(2100),
  bio: z.string().max(2000).optional().or(z.literal("")),
  awards: z.string().max(2000).optional().or(z.literal("")),
  achievements: z.string().max(2000).optional().or(z.literal("")),
});

export const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Enter a valid video URL"),
  thumbnail: z.string().url().optional().or(z.literal("")),
});

export const statSchema = z.object({
  sport: z.string().min(1),
  season: z.string().optional().or(z.literal("")),
  statName: z.string().min(1, "Stat name is required"),
  value: z.string().min(1, "Value is required"),
});

export const documentSchema = z.object({
  type: z.enum(["RESUME", "TRANSCRIPT", "CERTIFICATE"]),
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Enter a valid URL"),
});

export const messageSchema = z.object({
  receiverId: z.string().min(1),
  body: z.string().min(1, "Message cannot be empty").max(4000),
});

export const noteSchema = z.object({
  studentId: z.string().min(1),
  body: z.string().min(1).max(4000),
});
