"use client";
import { Button } from "@/components/general/Button";
import { ReusableDropdown } from "@/components/general/ResuableDropDown";
import { useToast } from "@/hooks/usetoast";
import { addUser } from "@/lib/api/user";
import {
  UserCreateInput,
  userCreateSchema,
} from "@/schema/user.schema";
import { Gender, MaritalStatus } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff, GraduationCap, School, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const AddStudentPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toast = useToast();
  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
    setValue
  } = useForm<UserCreateInput>({ resolver: zodResolver(userCreateSchema) });


  const addMutation = useMutation({
    mutationFn: (data: UserCreateInput) => addUser(data),
    onSuccess: () => {
      toast("Student created successfully", "success");
      reset();
      router.push("/students"); // redirect to student list
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast(err.response?.data?.message ?? "Failed to create student", "error");
      } else {
        toast("Unexpected error occurred", "error");
      }
    },
  });

  const onSubmit = (data: UserCreateInput) => {
    addMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-[1280px] mx-auto space-y-6">
      <div className="flex justify-between">
        <h1 className="flex gap-2 items-center heading-text">
          <GraduationCap size={36} /> Student Registration
        </h1>
        <Button type="button" variant="outline" text="Back" />
      </div>
      <div className="p-6 flex flex-col gap-4 border border-neutral-300 rounded-2xl shadow-md bg-neutral-100">
        <h2 className="flex gap-2 items-center large-text">
          <User size={20} /> Personal Information
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="label-input-group  group">
            <label htmlFor="firstName" className="label-text">
              First Name *
            </label>
            <input
              {...register("firstName")}
              type="text"
              className="input-field"
              placeholder="Enter the first name"
            />
            {errors.firstName && (
              <p className="error-text">{errors.firstName.message}</p>
            )}
          </div>
          <div className="label-input-group  group">
            <label className="label-text" htmlFor="middleName">
              Middle Name
            </label>
            <input
              {...register("middleName")}
              type="text"
              className="input-field"
              placeholder="Enter the middle name"
            />
            {errors.middleName && (
              <p className="error-text">{errors.middleName.message}</p>
            )}
          </div>
          <div className="label-input-group  group">
            <label className="label-text" htmlFor="lastName">
              Last Name *
            </label>
            <input
              {...register("lastName")}
              type="text"
              className="input-field"
              placeholder="Enter the last name"
            />
            {errors.lastName && (
              <p className="error-text">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="label-input-group  group">
            <label className="label-text" htmlFor="email">
              Email Address *
            </label>
            <input
              {...register("email")}
              type="text"
              className="input-field"
              placeholder="Enter the email"
            />
            {errors.email && (
              <p className="error-text">{errors.email.message}</p>
            )}
          </div>
          <div className="label-input-group  group">
            <label className="label-text" htmlFor="phoneNumber">
              Phone Number *
            </label>
            <input
              {...register("phoneNumber")}
              type="text"
              className="input-field"
              placeholder="Enter the phone number"
            />
            {errors.phoneNumber && (
              <p className="error-text">{errors.phoneNumber.message}</p>
            )}
          </div>
          <div className="label-input-group group relative">
            <label className="label-text" htmlFor="password">
              Password *
            </label>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="input-field pr-10"
              placeholder="Enter the password"
            />
            <div
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </div>

          <div className="label-input-group group relative">
            <label className="label-text" htmlFor="confirmPassword">
              Confirm Password *
            </label>
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              className="input-field pr-10"
              placeholder="Enter the confirm password"
            />
            <div
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
            {errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-4 border border-neutral-300 rounded-2xl shadow-md bg-neutral-100">
        <h2 className="flex gap-2 items-center large-text">
          <School size={20} /> Student Profile
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="label-input-group group">
            <label className="label-text" htmlFor="fatherName">
              Father&apos;s Name *
            </label>
            <input
              {...register("studentProfile.fatherName")}
              type="text"
              className="input-field"
              placeholder="Enter father's name"
            />
            {errors.studentProfile && errors.studentProfile.fatherName && (
              <p className="error-text">
                {errors.studentProfile.fatherName.message}
              </p>
            )}
          </div>
          <div className="label-input-group group">
            <label className="label-text" htmlFor="motherName">
              mother&apos;s Name *
            </label>
            <input
              {...register("studentProfile.motherName")}
              type="text"
              className="input-field"
              placeholder="Enter mother's name"
            />
            {errors.studentProfile && errors.studentProfile.motherName && (
              <p className="error-text">
                {errors.studentProfile.motherName.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="label-input-group group w-full">
            <label className="label-text" htmlFor="gender">
              Gender *
            </label>
            <ReusableDropdown items={Object.values(Gender)} placeholder="Select Gender" onSelect={(item) => setValue("studentProfile.gender", item)} />
            {errors.studentProfile && errors.studentProfile.gender && (
              <p className="error-text">
                {errors.studentProfile.gender.message}
              </p>
            )}
          </div>
          <div className="label-input-group group">
            <label className="label-text" htmlFor="maritalStatus">
              Marital Status *
            </label>
            <ReusableDropdown items={Object.values(MaritalStatus)} placeholder="Select Status" onSelect={(item) => setValue("studentProfile.maritalStatus", item)} />
            {errors.studentProfile && errors.studentProfile.maritalStatus && (
              <p className="error-text">
                {errors.studentProfile.maritalStatus.message}
              </p>
            )}
          </div>
          <div className="label-input-group group">
            <label className="label-text" htmlFor="dateOfBirth">
              Date of Birth *
            </label>
            <input
              {...register("studentProfile.dateOfBirth")}
              type="date"
              className="input-field"
            />
            {errors.studentProfile && errors.studentProfile.dateOfBirth && (
              <p className="error-text">
                {errors.studentProfile.dateOfBirth.message}
              </p>
            )}
          </div>
        </div>
        <div className="label-input-group group">
          <label className="label-text" htmlFor="collegeName">
            College Name *
          </label>
          <input
            {...register("studentProfile.collegeName")}
            type="text"
            className="input-field"
            placeholder="Enter college name"
          />
          {errors.studentProfile && errors.studentProfile.collegeName && (
            <p className="error-text">
              {errors.studentProfile.collegeName.message}
            </p>
          )}
        </div>
        <div className="label-input-group group">
          <label className="label-text" htmlFor="collegeAddress">
            College Address *
          </label>
          <input
            {...register("studentProfile.collegeAddress")}
            type="text"
            className="input-field"
            placeholder="Enter college address"
          />
          {errors.studentProfile && errors.studentProfile.collegeAddress && (
            <p className="error-text">
              {errors.studentProfile.collegeAddress.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="label-input-group group w-full">
            <label className="label-text" htmlFor="programId">
              Program *
            </label>
            <ReusableDropdown
              items={["BSc CSIT", "BBA", "BIM"]} // replace with real programs
              placeholder="Select Program"
              onSelect={(item) =>
                setValue("studentProfile.programId", Number(item))
              }
            />
            {errors.studentProfile?.programId && (
              <p className="error-text">
                {errors.studentProfile.programId.message}
              </p>
            )}
          </div>
          <div className="label-input-group group">
            <label className="label-text" htmlFor="semesterId">
              Semester *
            </label>
            <ReusableDropdown
              items={["1", "2", "3", "4", "5", "6", "7", "8"]}    // later replace
              placeholder="Select Semester"
              onSelect={(item) =>
                setValue("studentProfile.semesterId", Number(item))
              }
            />
            {errors.studentProfile?.semesterId && (
              <p className="error-text">
                {errors.studentProfile.semesterId.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <Button text="Save Student" />
    </form>
  );
};

export default AddStudentPage;
