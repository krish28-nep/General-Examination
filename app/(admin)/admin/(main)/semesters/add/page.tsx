"use client";

import { Button } from "@/components/general/Button";
import { ReusableDropdown } from "@/components/general/ResuableDropDown";
import { useToast } from "@/hooks/usetoast";
import { addSemester } from "@/lib/api/semester";
import {
    semesterCreateSchema,
    SemesterCreateInput,
} from "@/schema/semester.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { CourseType, SemesterName } from "@/types/semester";
import { Trash } from "lucide-react";
import { fetchPrograms } from "@/lib/api/program";
import { Spinner } from "@/components/Spinner";
import { Program } from "@/types/program";

const AddSemesterPage = () => {
    const router = useRouter();
    const toast = useToast();
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<SemesterCreateInput>({
        resolver: zodResolver(semesterCreateSchema),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "courses",
    });

    const {
        data: programsData,
        isLoading: programsDataLoading,
        isError: programsDataError,
    } = useQuery<Program[]>({
        queryKey: ["programs"],
        queryFn: fetchPrograms,
    });

    const mutation = useMutation({
        mutationFn: addSemester,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["programs"] })
            queryClient.invalidateQueries({ queryKey: ["semesters"] })
            queryClient.invalidateQueries({ queryKey: ["courses"] })
            toast("Semester created successfully", "success");
            router.push("/admin/semesters")
        },
        onError: (error: unknown) => {
            if (error instanceof AxiosError) {
                // check server-provided error message
                const serverMessage =
                    error.response?.data?.message ??
                    error.response?.data?.title ??
                    "Failed to create semester";

                toast(serverMessage, "error");
            } else {
                toast("Unexpected error occurred", "error");
            }
        },
    });


    const onSubmit = (data: SemesterCreateInput) => mutation.mutate(data);

    if (programsDataLoading) return <Spinner />;

    if (programsDataError) return <p>Failed to load programs</p>;

    if (!programsData || programsData.length === 0) {
        return <p>No Program Found</p>;
    }
    return (
        <div className="w-[1280px] mx-auto space-y-6">
            <div className="flex justify-between">
                <h1 className="heading-text">Add New Semester</h1>
                <Button variant="outline" text="Back" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Semester Details */}
                <div className="border border-neutral-300 rounded-2xl shadow-md bg-neutral-100 p-6">
                    <h2 className="large-text">Semester Details</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Semester Name */}
                        <div className="label-input-group group">
                            <label className="label-text">Semester Name *</label>
                            <ReusableDropdown
                                items={Object.values(SemesterName)}
                                placeholder="Select Semester"
                                onSelect={(val) => setValue("name", val as SemesterName)}
                            />
                            {errors.name && (
                                <p className="error-text">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Fee */}
                        <div className="label-input-group group">
                            <label className="label-text">Fee *</label>
                            <input
                                type="number"
                                {...register("fee", { valueAsNumber: true })}
                                className="input-field"
                                placeholder="Enter fee"
                            />
                            {errors.fee && <p className="error-text">{errors.fee.message}</p>}
                        </div>

                        {/* Program */}
                        <div className="label-input-group group">
                            <label className="label-text">Program *</label>
                            <ReusableDropdown
                                items={programsData.map((program) => program.name)}
                                placeholder="Select Program"
                                onSelect={(selectedName) => {
                                    const selected = programsData.find(
                                        (p) => p.name === selectedName,
                                    );
                                    if (selected) setValue("programId", selected.id);
                                }}
                            />
                            {errors.programId && (
                                <p className="error-text">{errors.programId.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Course List */}
                <div className="border border-neutral-300 rounded-2xl shadow-md bg-neutral-100 p-6">
                    <h2 className="large-text">Courses</h2>

                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="mb-4 flex items-start gap-4 w-full border border-neutral-200 rounded-lg p-4 shadow-sm"
                        >
                            <div className="grid grid-cols-4 gap-4 flex-1">
                                {/* Course Name */}
                                <div className="label-input-group group">
                                    <label className="label-text">Name</label>
                                    <input
                                        {...register(`courses.${index}.name`)}
                                        className="input-field"
                                        placeholder="Course name"
                                    />
                                    {errors.courses?.[index]?.name && (
                                        <p className="error-text">
                                            {errors.courses[index]?.name?.message}
                                        </p>
                                    )}
                                </div>

                                {/* Course Code */}
                                <div className="label-input-group group">
                                    <label className="label-text">Code</label>
                                    <input
                                        {...register(`courses.${index}.code`)}
                                        className="input-field"
                                        placeholder="Course code"
                                    />
                                    {errors.courses?.[index]?.code && (
                                        <p className="error-text">
                                            {errors.courses[index]?.code?.message}
                                        </p>
                                    )}
                                </div>

                                {/* Type */}
                                <div className="label-input-group group">
                                    <label className="label-text">Type</label>
                                    <ReusableDropdown
                                        items={Object.values(CourseType)}
                                        placeholder="Select Type"
                                        onSelect={(val) =>
                                            setValue(`courses.${index}.type`, val as CourseType)
                                        }
                                    />
                                    {errors.courses?.[index]?.type && (
                                        <p className="error-text">
                                            {errors.courses[index]?.type?.message}
                                        </p>
                                    )}
                                </div>

                                {/* Credit */}
                                <div className="label-input-group group">
                                    <label className="label-text">Credit</label>
                                    <input
                                        type="number"
                                        {...register(`courses.${index}.credit`, {
                                            valueAsNumber: true,
                                        })}
                                        className="input-field"
                                        placeholder="Credit"
                                    />
                                    {errors.courses?.[index]?.credit && (
                                        <p className="error-text">
                                            {errors.courses[index]?.credit?.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Remove Button */}
                            <div
                                className="hover:bg-danger/10 hover:text-danger rounded-full p-2 transition-colors duration-300 mt-1"
                                onClick={() => remove(index)}
                            >
                                <Trash className="cursor-pointer" size={16} />
                            </div>
                        </div>
                    ))}

                    {/* Add Course Button */}
                    <div className="mt-2">
                        <Button
                            text="Add Course"
                            variant="outline"
                            onClick={() =>
                                append({
                                    name: "",
                                    code: "",
                                    type: CourseType.Compulsory,
                                    credit: 0,
                                    semesterId: 0
                                })
                            }
                        />
                    </div>
                </div>

                {/* Save Button */}
                <Button
                    text="Save Semester"
                    type="submit"
                    disabled={mutation.isPending}
                />
            </form>
        </div>
    );
};

export default AddSemesterPage;
