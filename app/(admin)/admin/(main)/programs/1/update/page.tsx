"use client";
import { Button } from "@/components/general/Button";
import { ReusableDropdown } from "@/components/general/ResuableDropDown";
import { useToast } from "@/hooks/usetoast";
import { fetchProgram, updateProgram } from "@/lib/api/program";
import {
    ProgramUpdateInput,
    programUpdateSchema,
} from "@/schema/program.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Book, GraduationCap, DollarSign } from "lucide-react";
import { Degree } from "@/types/program";

const EditProgramPage = () => {
    const programId = 1; // Replace with useParams if dynamic routing is needed
    const router = useRouter();
    const toast = useToast();

    const { register, formState: { errors }, reset, handleSubmit, setValue } = useForm<ProgramUpdateInput>({
        resolver: zodResolver(programUpdateSchema),
    });

    const { data: program, isLoading: programLoading } = useQuery({
        queryKey: ["program", programId],
        queryFn: () => fetchProgram(Number(programId)),
    });

    useEffect(() => {
        if (program) {
            reset(program);
        }
    }, [program, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: ProgramUpdateInput) => updateProgram(Number(programId), data),
        onSuccess: () => {
            toast("Program updated successfully", "success");
            router.push("/programs");
        },
        onError: (err: unknown) => {
            if (err instanceof AxiosError) {
                toast(err.response?.data?.message ?? "Failed to update program", "error");
            } else {
                toast("Unexpected error occurred", "error");
            }
        },
    });

    const onSubmit = (data: ProgramUpdateInput) => {
        updateMutation.mutate(data);
    };

    if (programLoading) return <div>Loading program...</div>;

    return (
        <div className="w-[1280px] mx-auto space-y-6">
            <div className="flex justify-between">
                <h1 className="flex gap-2 items-center heading-text">
                    <GraduationCap size={36} /> Update Program
                </h1>
                <Button variant="outline" text="Back" onClick={() => router.back()} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6 flex flex-col gap-4 border border-neutral-300 rounded-2xl shadow-md bg-neutral-100 mb-4">
                    <div className="label-input-group group">
                        <label htmlFor="name" className="label-text flex items-center gap-2">
                            <Book size={18} /> Program Name *
                        </label>
                        <input
                            {...register("name")}
                            type="text"
                            className="input-field"
                            placeholder="Enter program name"
                        />
                        {errors.name && <p className="error-text">{errors.name.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="label-input-group group">
                            <label htmlFor="degree" className="label-text flex items-center gap-2">
                                <GraduationCap size={18} /> Degree *
                            </label>
                            <ReusableDropdown
                                items={Object.values(Degree)}
                                placeholder={program?.degree || "Select Degree"}
                                onSelect={(item) => setValue("degree", item)}
                            />
                            {errors.degree && <p className="error-text">{errors.degree.message}</p>}
                        </div>
                        <div className="label-input-group group">
                            <label htmlFor="fee" className="label-text flex items-center gap-2">
                                <DollarSign size={18} /> Fee *
                            </label>
                            <input
                                {...register("fee", { valueAsNumber: true })}
                                type="number"
                                className="input-field"
                                placeholder="Enter fee amount"
                            />
                            {errors.fee && <p className="error-text">{errors.fee.message}</p>}
                        </div>
                    </div>
                </div>
                <Button type="submit" text="Update Program" disabled={updateMutation.isPending} />
            </form>
        </div>
    );
};

export default EditProgramPage;
