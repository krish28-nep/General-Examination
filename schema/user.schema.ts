import { Gender, MaritalStatus, Role } from "@/types/user";
import { z } from "zod";

const genderValues = Object.values(Gender) as [string, ...string[]];
const maritalValues = Object.values(MaritalStatus) as [string, ...string[]];

export const studentProfileCreateSchema = z.object({
  signature: z.string().min(1, "Signature is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  gender: z.enum(genderValues, { message: "Gender is required" }),
  maritalStatus: z.enum(maritalValues, { message: "Marital is required" }),
  dateOfBirth: z.date().min(1, "Date of birth is required"),
  collegeName: z.string().min(1, "College name is required"),
  collegeAddress: z.string().min(1, "College address is required"),
  programId: z.number().int("Program ID must be an integer"),

  semesterId: z.number().int("Semester ID must be an integer"),
});

export const userCreateSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(1, "Confirm password is required")
      .min(6, "Confirm password must be at least 6 characters"),

    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .trim()
      .regex(/^\+?[0-9]{10,15}$/, {
        message: "Invalid phone number",
      }),

    photoUrl: z.string().optional(),
    role: z.enum(Role).default(Role.Student).optional(),
    studentProfile: studentProfileCreateSchema.optional(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const userUpdateSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, {
      message: "Invalid phone number",
    })
    .optional(),
  photoUrl: z.string().optional(),
  role: z.enum(Role).optional(),
  studentProfile: studentProfileCreateSchema.partial().optional(),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type StudentProfileCreateInput = z.infer<
  typeof studentProfileCreateSchema
>;
