"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/usetoast";
import { Button } from "@/components/general/Button";
import { ReusableDropdown } from "@/components/general/ResuableDropDown";
import { Trash } from "lucide-react";
import { SemesterName, CourseType } from "@/types/semester";
import { fetchSemester, updateSemester } from "@/lib/api/semester";
import { addCourse, updateCourse, deleteCourse } from "@/lib/api/course";
import { SemesterCreateInput, CourseCreateInput, CourseUpdateInput, semesterCreateSchema, SemesterUpdateInput, semesterUpdateSchema } from "@/schema/semester.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const UpdateSemesterPage = () => {
    const { id: semesterId } = useParams();
    const router = useRouter();
    const toast = useToast();
    const queryClient = useQueryClient();

    const { data: semester } = useQuery({
        queryKey: ["semester", semesterId],
        queryFn: () => fetchSemester(Number(semesterId)),
    });

    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors }
    } = useForm<SemesterUpdateInput>({
        resolver: zodResolver(semesterUpdateSchema),
        defaultValues: {
            name: SemesterName.First,
            fee: 0,
            programId: 0,
            courses: [],
        },
    });

    const { fields, append } = useFieldArray({
        control,
        name: "courses",
    });

    useEffect(() => {
        if (semester) reset(semester);
    }, [semester, reset]);

    const detailsMutation = useMutation({
        mutationFn: (data: SemesterUpdateInput) =>
            updateSemester(Number(semesterId), data),
        onSuccess: () => {
            toast("Semester details updated", "success");
            queryClient.invalidateQueries({ queryKey: ["semester", Number(semesterId)] });
        },
        onError: () => toast("Failed to update semester", "error"),
    });

    const addCourseMutation = useMutation({
        mutationFn: (course: CourseCreateInput) =>
            addCourse(Number(semesterId), course),
        onSuccess: () => {
            toast("Course added", "success");
            queryClient.invalidateQueries({ queryKey: ["semester", Number(semesterId)] });
        },
    });

    const updateCourseMutation = useMutation({
        mutationFn: (course: CourseUpdateInput) =>
            updateCourse(course.id!, course),
        onSuccess: () => {
            toast("Course updated", "success");
            queryClient.invalidateQueries({ queryKey: ["semester", Number(semesterId)] });
        },
    });

    const deleteCourseMutation = useMutation({
        mutationFn: (courseId: number) => deleteCourse(courseId),
        onSuccess: () => {
            toast("Course deleted", "success");
            queryClient.invalidateQueries({ queryKey: ["semester", Number(semesterId)] });
        },
    });

    const onSubmitDetails = (data: SemesterUpdateInput) => {
        detailsMutation.mutate(data);
    };

    const onSubmitCourse = (index: number) => {
        const course = fields[index];
        if (!course.name || !course.code) {
            toast("Course name and code are required", "error");
            return;
        }

        if (course.id) {
            updateCourseMutation.mutate({
                id: Number(course.id),
                name: course.name,
                code: course.code,
                type: course.type,
                credit: course.credit,
            });
        } else {
            addCourseMutation.mutate(course as CourseCreateInput);
        }
    };

    return (
        <div className="w-[1280px] mx-auto space-y-6">
            <h1 className="heading-text">Update Semester</h1>

            <form onSubmit={handleSubmit(onSubmitDetails)} className="card space-y-4">
                <h2 className="large-text">Semester Details</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="label-input-group group">
                        <label className="label-text">Semester Name *</label>
                        <ReusableDropdown
                            items={Object.values(SemesterName)}
                            placeholder="Select Semester"
                            onSelect={(val) => setValue("name", val as SemesterName)}
                        />
                        {errors.name && <p className="error-text">{errors.name.message}</p>}
                    </div>

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

                    <div className="label-input-group group">
                        <label className="label-text">Program *</label>
                        <ReusableDropdown
                            items={["BSc CSIT", "BBA", "BIM"]}
                            placeholder="Select Program"
                            onSelect={(val) => setValue("programId", Number(val))}
                        />
                        {errors.programId && <p className="error-text">{errors.programId.message}</p>}
                    </div>
                </div>
                <Button text="Save Details" type="submit" disabled={detailsMutation.isPending} />
            </form>

            <div className="card space-y-4">
                <h2 className="large-text">Courses</h2>

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="mb-4 flex items-start gap-4 w-full border border-neutral-200 rounded-lg p-4 shadow-sm"
                    >
                        <div className="grid grid-cols-4 gap-4 flex-1">
                            <div className="label-input-group group">
                                <label className="label-text">Name</label>
                                <input
                                    {...register(`courses.${index}.name`)}
                                    className="input-field"
                                    placeholder="Course name"
                                />
                                {errors.courses?.[index]?.name && (
                                    <p className="error-text">{errors.courses[index]?.name?.message}</p>
                                )}
                            </div>

                            <div className="label-input-group group">
                                <label className="label-text">Code</label>
                                <input
                                    {...register(`courses.${index}.code`)}
                                    className="input-field"
                                    placeholder="Course code"
                                />
                                {errors.courses?.[index]?.code && (
                                    <p className="error-text">{errors.courses[index]?.code?.message}</p>
                                )}
                            </div>

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
                                    <p className="error-text">{errors.courses[index]?.type?.message}</p>
                                )}
                            </div>

                            <div className="label-input-group group">
                                <label className="label-text">Credit</label>
                                <input
                                    type="number"
                                    {...register(`courses.${index}.credit`, { valueAsNumber: true })}
                                    className="input-field"
                                    placeholder="Credit"
                                />
                                {errors.courses?.[index]?.credit && (
                                    <p className="error-text">{errors.courses[index]?.credit?.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 mt-1">
                            <Button
                                text="Save"
                                onClick={() => onSubmitCourse(index)}
                                variant="outline"
                            />
                            {field.id && (
                                <Trash
                                    className="cursor-pointer hover:text-danger"
                                    onClick={() => deleteCourseMutation.mutate(Number(field.id))}
                                />
                            )}
                        </div>
                    </div>
                ))}

                <Button
                    text="Add Course"
                    variant="outline"
                    onClick={() =>
                        append({
                            name: "",
                            code: "",
                            type: CourseType.Compulsory,
                            credit: 0,
                        })
                    }
                />
            </div>
        </div>
    );
};

export default UpdateSemesterPage;
