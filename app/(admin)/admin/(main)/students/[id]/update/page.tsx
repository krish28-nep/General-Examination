"use client";
import { Button } from "@/components/general/Button";
import { ReusableDropdown } from "@/components/general/ResuableDropDown";
import { Spinner } from "@/components/Spinner";
import { useToast } from "@/hooks/usetoast";
import { fetchPrograms } from "@/lib/api/program";
import { uploadImage } from "@/lib/api/upload";
import { fetchUser, updateUser } from "@/lib/api/user";
import { UserUpdateInput, userUpdateSchema } from "@/schema/user.schema";
import { Program } from "@/types/program";
import { Gender, MaritalStatus, User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  GraduationCap,
  School,
  SquarePen,
  Upload,
  UserPen,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const UpdateStudentPage = () => {
  const router = useRouter();
  const { id: userId } = useParams();

  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [previewSignatureImage, setPreviewSignatureImage] = useState("");
  const [SignatureFile, setSignatureFile] = useState<File | null>(null);
  const toast = useToast();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
  } = useForm<UserUpdateInput>({ resolver: zodResolver(userUpdateSchema) });

  const {
    data: userData,
    isLoading: userDataLoading,
    isError: userDataError,
  } = useQuery<User>({
    queryKey: ["users", Number(userId)],
    queryFn: () => fetchUser(Number(userId)),
  });

  const {
    data: programsData,
    isLoading: programsDataLoading,
    isError: programsDataError,
  } = useQuery<Program[]>({
    queryKey: ["programs"],
    queryFn: fetchPrograms,
  });

  // Populate form when userData is loaded
  useEffect(() => {
    if (userData) {
      reset(userData);
      if (userData.photoUrl) setPreviewImage(userData.photoUrl);
      if (userData.studentProfile?.signature)
        setPreviewSignatureImage(userData.studentProfile.signature);
      if (userData.studentProfile?.programId) {
        const program = programsData?.find(
          (p) => p.id === userData.studentProfile?.programId,
        );
        if (program) setSelectedProgram(program);
      }
    }
  }, [userData, reset, programsData]);

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

  useEffect(() => {
    if (SignatureFile) {
      const objectUrl = URL.createObjectURL(SignatureFile);
      setPreviewSignatureImage(objectUrl);
      setValue("studentProfile.signature", SignatureFile.name);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewSignatureImage("");
      setValue("studentProfile.signature", "");
    }
  }, [SignatureFile, setValue]);

  const handleRemoveFile = () => {
    setImageFile(null);
  };
  const handleRemoveSignatureFile = () => {
    setSignatureFile(null);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] || null;
    setImageFile(newFile);
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] || null;
    setSignatureFile(newFile);
  };

  const updateMutation = useMutation({
    mutationFn: (data: UserUpdateInput) => updateUser(Number(userId), data),
    onSuccess: () => {
      toast("Student Updated successfully", "success");
      reset();
      setImageFile(null);
      setSignatureFile(null);
      router.push("/admin/students"); // redirect to student list
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast(
          err.response?.data?.message ?? "Failed to update student",
          "error",
        );
      } else {
        toast("Unexpected error occurred", "error");
      }
    },
  });

  const onSubmit = async (data: UserUpdateInput) => {
    let uploadedPhotoPath: string | undefined;
    let uploadedSignaturePath: string | undefined;

    if (imageFile) {
      uploadedPhotoPath = await uploadImage(imageFile);
      setValue("photoUrl", uploadedPhotoPath, { shouldValidate: true });
    }

    if (SignatureFile) {
      uploadedSignaturePath = await uploadImage(SignatureFile);
      setValue("studentProfile.signature", uploadedSignaturePath, {
        shouldValidate: true,
      });
    }

    const payload: UserUpdateInput = {
      ...data,
      photoUrl: uploadedPhotoPath || data.photoUrl || "",
      studentProfile: {
        ...data.studentProfile!,
        signature:
          uploadedSignaturePath || data.studentProfile?.signature || "",
      },
    };

    updateMutation.mutate(payload);
  };

  if (programsDataLoading || userDataLoading) return <Spinner />;

  if (programsDataError || userDataError) return <p>Failed to load data</p>;

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
          <UserPen size={20} /> Personal Information
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
        <div className="flex flex-col gap-4">
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
                  if (selected) {
                    setValue("studentProfile.programId", selected.id);
                    setSelectedProgram(selected);
                  }
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
                items={selectedProgram?.semesters?.map((s) => s.name) || []}
                placeholder="Select Semester"
                onSelect={(item) => {
                  const selectedSemester = selectedProgram?.semesters?.find(
                    (s) => s.name === item,
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
          <div className="label-input-group">
            <label htmlFor="signature-image" className="label-text">
              Signature Image
            </label>
            {previewSignatureImage ? (
              <div className="flex flex-wrap gap-4">
                <div className="relative size-28 overflow-clip rounded-sm">
                  <Image
                    src={previewSignatureImage}
                    alt="signatureImage"
                    width={100}
                    height={100}
                    className="size-full object-cover"
                  />
                  <button
                    onClick={handleRemoveSignatureFile}
                    type="button"
                    className="absolute top-1 right-1 flex cursor-pointer items-center justify-center rounded-full bg-red-500 p-0.5 transition-colors duration-300 hover:bg-red-800"
                  >
                    <X size={16} className="text-neutral-100" />
                  </button>
                </div>
                <label
                  htmlFor="signature-image"
                  className="flex size-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-neutral-400 p-4 transition-colors duration-300 hover:bg-neutral-400/10"
                >
                  <SquarePen size={32} />
                  <span className="text-center text-neutral-800 capitalize">
                    Change Image
                  </span>
                </label>
                <input
                  onChange={handleSignatureChange}
                  id="signature-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              <>
                <label
                  htmlFor="signature-image"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-neutral-400 p-4 transition-colors duration-300 hover:bg-neutral-400/10"
                >
                  <Upload size={32} />
                  <span className="text-neutral-800 capitalize">
                    Click to browse
                  </span>
                  <span className="">Supports: JPG, PNG</span>
                </label>
                <input
                  onChange={handleSignatureChange}
                  id="signature-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </>
            )}
            {errors.studentProfile?.signature && (
              <span className="error-text">
                {errors.studentProfile.signature.message}
              </span>
            )}
            <input type="hidden" {...register("studentProfile.signature")} />
          </div>
        </div>
      </div>
      <Button type="submit" text="Update Student" />
    </form>
  );
};

export default UpdateStudentPage;
