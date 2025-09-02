"use client";
import { Button } from "@/components/general/Button";
import { ReusableDropdown } from "@/components/general/ResuableDropDown";
import { Spinner } from "@/components/Spinner";
import { useToast } from "@/hooks/usetoast";
import { fetchPrograms } from "@/lib/api/program";
import { uploadImage } from "@/lib/api/upload";
import { addUser } from "@/lib/api/user";
import { UserCreateInput, userCreateSchema } from "@/schema/user.schema";
import { Program } from "@/types/program";
import { Gender, MaritalStatus } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  Eye,
  EyeOff,
  GraduationCap,
  School,
  SquarePen,
  Upload,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const AddStudentPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)

  const toast = useToast();
  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
    setValue,
  } = useForm<UserCreateInput>({ resolver: zodResolver(userCreateSchema) });


  const {
    data: programsData,
    isLoading: programsDataLoading,
    isError: programsDataError,
  } = useQuery<Program[]>({
    queryKey: ["programs"],
    queryFn: fetchPrograms,
  });

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewImage(objectUrl);
      setValue("photoUrl", imageFile.name);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewImage("");
      setValue("photoUrl", "");
    }
  }, [imageFile, setValue]);

  const handleRemoveFile = () => {
    setImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] || null;
    setImageFile(newFile);
  };

  const addMutation = useMutation({
    mutationFn: (data: UserCreateInput) => addUser(data),
    onSuccess: () => {
      toast("Student created successfully", "success");
      reset();
      // router.push("/students"); // redirect to student list
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast(
          err.response?.data?.message ?? "Failed to create student",
          "error",
        );
      } else {
        toast("Unexpected error occurred", "error");
      }
    },
  });

  const onSubmit = async (data: UserCreateInput) => {
    let uploadedPath;
    if (imageFile) {
      uploadedPath = await uploadImage(imageFile);
      setValue("photoUrl", uploadedPath || "", { shouldValidate: true });
    }
    const payload = {
      ...data,
      photoUrl: uploadedPath || "",
    };
    addMutation.mutate(payload);
  };

  if (programsDataLoading) return <Spinner />;

  if (programsDataError) return <p>Failed to load programs</p>;

  if (!programsData || programsData.length === 0) {
    return <p>No Program Found</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[1280px] mx-auto space-y-6"
    >
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
        <div className="flex flex-col gap-4">
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
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="input-field pr-10 w-full"
                  placeholder="Enter the password"
                />
                <div
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>

            <div className="label-input-group group relative">
              <label className="label-text" htmlFor="confirmPassword">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="input-field pr-10 w-full"
                  placeholder="Enter the confirm password"
                />
                <div
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="label-input-group">
          <label htmlFor="photo-image" className="label-text">
            Photo Image
          </label>
          {previewImage ? (
            <div className="flex flex-wrap gap-4">
              <div className="relative size-28 overflow-clip rounded-sm">
                <Image
                  src={previewImage}
                  alt="photoImage"
                  width={100}
                  height={100}
                  className="size-full object-cover"
                />
                <button
                  onClick={handleRemoveFile}
                  type="button"
                  className="absolute top-1 right-1 flex cursor-pointer items-center justify-center rounded-full bg-red-500 p-0.5 transition-colors duration-300 hover:bg-red-800"
                >
                  <X size={16} className="text-neutral-100" />
                </button>
              </div>
              <label
                htmlFor="photo-image"
                className="flex size-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-neutral-400 p-4 transition-colors duration-300 hover:bg-neutral-400/10"
              >
                <SquarePen size={32} />
                <span className="text-center text-neutral-800 capitalize">
                  Change Image
                </span>
              </label>
              <input
                onChange={handleFileChange}
                id="photo-image"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>
          ) : (
            <>
              <label
                htmlFor="photo-image"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-neutral-400 p-4 transition-colors duration-300 hover:bg-neutral-400/10"
              >
                <Upload size={32} />
                <span className="text-neutral-800 capitalize">
                  Click to browse
                </span>
                <span className="">Supports: JPG, PNG</span>
              </label>
              <input
                onChange={handleFileChange}
                id="photo-image"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </>
          )}
          {errors.photoUrl && (
            <span className="error-text">{errors.photoUrl.message}</span>
          )}
          <input type="hidden" {...register("photoUrl")} />
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
            <ReusableDropdown
              items={Object.values(Gender)}
              placeholder="Select Gender"
              onSelect={(item) => setValue("studentProfile.gender", item)}
            />
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
            <ReusableDropdown
              items={Object.values(MaritalStatus)}
              placeholder="Select Status"
              onSelect={(item) =>
                setValue("studentProfile.maritalStatus", item)
              }
            />
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
              items={programsData.map((program) => program.name)}
              placeholder="Select Program"
              onSelect={(selectedName) => {
                const selected = programsData.find(
                  (p) => p.name === selectedName,
                );
                if (selected) setValue("studentProfile.programId", selected.id);
              }}
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
              disabled={!selectedProgram}
              items={selectedProgram?.semesters?.map(s => s.name) || []} 
              placeholder="Select Semester"
              onSelect={(item) => {
                const selectedSemester = selectedProgram?.semesters?.find(
                  s => s.name === item
                );
                if (selectedSemester) {
                  setValue("studentProfile.semesterId", selectedSemester.id);
                }
              }}
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
