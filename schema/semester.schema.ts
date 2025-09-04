import { CourseType, SemesterName } from "@/types/semester";
import { z } from "zod";

const courseTypeValues = Object.values(CourseType) as [string, ...string[]];
const semesterNameValues = Object.values(SemesterName) as [string, ...string[]];

export const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  code: z.string().min(1, "Course code is required"),
  type: z.enum(courseTypeValues, { message: "Course Type is Required" }),
  credit: z.number().min(0, "Credit must be at least 0"),
  semesterId: z.number().min(0, "semesterId is Required"),
});

export const semesterCreateSchema = z.object({
  name: z.enum(semesterNameValues, { message: "Semester Name is Required" }),
  fee: z.number().min(0, "Fee is required"),
  programId: z.number(),
  courses: z.array(courseSchema),
});

export type SemesterCreateInput = z.infer<typeof semesterCreateSchema>;

export const semesterUpdateSchema = semesterCreateSchema.partial();
export type SemesterUpdateInput = z.infer<typeof semesterUpdateSchema>;

export type CourseCreateInput = z.infer<typeof courseSchema>;

export const courseUpdateSchema = courseSchema.partial().extend({
  id: z.number().optional(),
});
export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>;
