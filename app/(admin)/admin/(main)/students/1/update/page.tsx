"use client";
import { Button } from "@/components/general/Button";
import { ReusableDropdown } from "@/components/general/ResuableDropDown";
import { useToast } from "@/hooks/usetoast";
import { fetchUser, updateStudentProfile } from "@/lib/api/user";
import {
    UserUpdateInput,
    userUpdateSchema,
} from "@/schema/user.schema";
import { Gender, MaritalStatus } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { GraduationCap, School, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const EditStudentPage = () => {
    const router = useRouter();
    const userId = 1; // replace with useParams() if dynamic

    const toast = useToast();
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        setValue
    } = useForm<UserUpdateInput>({ resolver: zodResolver(userUpdateSchema) });

    const { data: user, isLoading } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => fetchUser(Number(userId)),
        enabled: !!userId,
    });

    useEffect(() => {
        if (user) {
            reset({
                ...user,
                studentProfile: {
                    ...user.studentProfile,
                },
            });
        }
    }, [user, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: UserUpdateInput) => updateStudentProfile(Number(userId), data),
        onSuccess: () => {
            toast("Student updated successfully", "success");
            router.push("/students");
        },
        onError: (err: unknown) => {
            if (err instanceof AxiosError) {
                toast(err.response?.data?.message ?? "Failed to update student", "error");
            } else {
                toast("Unexpected error", "error");
            }
        },
    });

    const onSubmit = (formData: UserUpdateInput) => {
        updateMutation.mutate(formData);
    };

    if (isLoading) return <div>Loading student data...</div>;

    return (
        <div className="w-[1280px] mx-auto space-y-6">
            <div className="flex justify-between">
                <h1 className="flex gap-2 items-center heading-text">
                    <GraduationCap size={36} /> Update Student
                </h1>
                <Button variant="outline" text="Back" onClick={() => router.back()} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Personal Information */}
                <div className="p-6 flex flex-col gap-4 border border-neutral-300 rounded-2xl shadow-md bg-neutral-100">
                    <h2 className="flex gap-2 items-center large-text">
                        <User size={20} /> Personal Information
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="label-input-group group">
                            <label htmlFor="firstName" className="label-text">First Name *</label>
                            <input {...register("firstName")} type="text" className="input-field" placeholder="Enter first name" />
                            {errors.firstName && <p className="error-text">{errors.firstName.message}</p>}
                        </div>
                        <div className="label-input-group group">
                            <label htmlFor="middleName" className="label-text">Middle Name</label>
                            <input {...register("middleName")} type="text" className="input-field" placeholder="Enter middle name" />
                            {errors.middleName && <p className="error-text">{errors.middleName.message}</p>}
                        </div>
                        <div className="label-input-group group">
                            <label htmlFor="lastName" className="label-text">Last Name *</label>
                            <input {...register("lastName")} type="text" className="input-field" placeholder="Enter last name" />
                            {errors.lastName && <p className="error-text">{errors.lastName.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="label-input-group group">
                            <label htmlFor="email" className="label-text">Email Address *</label>
                            <input {...register("email")} type="text" className="input-field" placeholder="Enter email" />
                            {errors.email && <p className="error-text">{errors.email.message}</p>}
                        </div>
                        <div className="label-input-group group">
                            <label htmlFor="phoneNumber" className="label-text">Phone Number *</label>
                            <input {...register("phoneNumber")} type="text" className="input-field" placeholder="Enter phone number" />
                            {errors.phoneNumber && <p className="error-text">{errors.phoneNumber.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Student Profile */}
                <div className="p-6 flex flex-col gap-4 border border-neutral-300 rounded-2xl shadow-md bg-neutral-100">
                    <h2 className="flex gap-2 items-center large-text">
                        <School size={20} /> Student Profile
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="label-input-group group">
                            <label className="label-text">Father&apos;s Name *</label>
                            <input {...register("studentProfile.fatherName")} type="text" className="input-field" placeholder="Enter father's name" />
                            {errors.studentProfile?.fatherName && <p className="error-text">{errors.studentProfile.fatherName.message}</p>}
                        </div>
                        <div className="label-input-group group">
                            <label className="label-text">Mother&apos;s Name *</label>
                            <input {...register("studentProfile.motherName")} type="text" className="input-field" placeholder="Enter mother's name" />
                            {errors.studentProfile?.motherName && <p className="error-text">{errors.studentProfile.motherName.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="label-input-group group">
                            <label className="label-text">Gender *</label>
                            <ReusableDropdown
                                items={Object.values(Gender)}
                                placeholder={user?.studentProfile?.gender || "Select Gender"}
                                onSelect={(item) => setValue("studentProfile.gender", item)}
                            />
                            {errors.studentProfile?.gender && <p className="error-text">{errors.studentProfile.gender.message}</p>}
                        </div>
                        <div className="label-input-group group">
                            <label className="label-text">Marital Status *</label>
                            <ReusableDropdown
                                items={Object.values(MaritalStatus)}
                                placeholder={user?.studentProfile?.maritalStatus || "Select Status"}
                                onSelect={(item) => setValue("studentProfile.maritalStatus", item)}
                            />
                            {errors.studentProfile?.maritalStatus && <p className="error-text">{errors.studentProfile.maritalStatus.message}</p>}
                        </div>
                        <div className="label-input-group group">
                            <label className="label-text">Date of Birth *</label>
                            <input {...register("studentProfile.dateOfBirth")} type="date" className="input-field" />
                            {errors.studentProfile?.dateOfBirth && <p className="error-text">{errors.studentProfile.dateOfBirth.message}</p>}
                        </div>
                    </div>
                    <div className="label-input-group group">
                        <label className="label-text">College Name *</label>
                        <input {...register("studentProfile.collegeName")} type="text" className="input-field" placeholder="Enter college name" />
                        {errors.studentProfile?.collegeName && <p className="error-text">{errors.studentProfile.collegeName.message}</p>}
                    </div>
                    <div className="label-input-group group">
                        <label className="label-text">College Address *</label>
                        <input {...register("studentProfile.collegeAddress")} type="text" className="input-field" placeholder="Enter college address" />
                        {errors.studentProfile?.collegeAddress && <p className="error-text">{errors.studentProfile.collegeAddress.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="label-input-group group">
                            <label className="label-text">Program *</label>
                            <ReusableDropdown
                                items={["BSc CSIT", "BBA", "BIM"]}
                                placeholder={user?.studentProfile?.programId ? String(user.studentProfile.programId) : "Select Program"}
                                onSelect={(item) => setValue("studentProfile.programId", Number(item))}
                            />
                            {errors.studentProfile?.programId && <p className="error-text">{errors.studentProfile.programId.message}</p>}
                        </div>
                        <div className="label-input-group group">
                            <label className="label-text">Semester *</label>
                            <ReusableDropdown
                                items={["1", "2", "3", "4", "5", "6", "7", "8"]}
                                placeholder={user?.studentProfile?.semesterId ? String(user.studentProfile.semesterId) : "Select Semester"}
                                onSelect={(item) => setValue("studentProfile.semesterId", Number(item))}
                            />
                            {errors.studentProfile?.semesterId && <p className="error-text">{errors.studentProfile.semesterId.message}</p>}
                        </div>
                    </div>
                </div>

                <Button type="submit" text="Update Student" disabled={updateMutation.isPending} />
            </form>
        </div>
    );
};

export default EditStudentPage;
