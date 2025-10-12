import { z } from "zod";
import { ExamType } from "@/types/application";

export const applicationCreateSchema = z.object({
    userId: z.number().min(1, "UserId is required"),
    semesterId: z.number().min(1, "SemesterId is required"),
    examType: z.nativeEnum(ExamType),
    courseIds: z.array(z.number().min(1)).nonempty("At least one course must be selected"),
});

export type ApplicationCreateInput = z.infer<typeof applicationCreateSchema>;
