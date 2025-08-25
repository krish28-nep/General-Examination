import { Degree } from "@/types/program";
import { z } from "zod";

const degreeValues = Object.values(Degree) as [string, ...string[]];

export const programCreateSchema = z.object({
    name: z.string().min(1, "Program name is required"),
    degree: z.enum(degreeValues, { message: "Degree is required" }),
    fee: z.number().min(0, "Fee must be a non-negative number"),
});

export const programUpdateSchema = programCreateSchema.partial();

export type ProgramCreateInput = z.infer<typeof programCreateSchema>;
export type ProgramUpdateInput = z.infer<typeof programUpdateSchema>;
