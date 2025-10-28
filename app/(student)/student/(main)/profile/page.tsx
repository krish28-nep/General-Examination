"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/lib/api/user";
import { User } from "@/types/user";
import Image from "next/image";
import photoofMan from "@/public/professional-product-manager.png";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/Spinner";

const ProfilePage = () => {
  const { user } = useAuth()
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery<User>({
    queryKey: ["users", Number(user?.id)],
    queryFn: () => fetchUser(Number(user?.id)),
    enabled: !!user?.id
  });

  if (isLoading) return <Spinner />
  if (isError || !userData)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load user data</p>
    );

  const profile = userData.studentProfile;

  return (
    <div className="max-w-5xl mx-auto my-10 bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Student Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo */}
        <div className="flex flex-col items-center">
          <Image
            src={photoofMan}
            alt="Student Photo"
            width={200}
            height={200}
            className="rounded-md object-cover"
          />
          <p className="text-sm text-gray-500 mt-2">Upload Student Photo</p>
        </div>

        {/* Signature */}
        <div className="flex flex-col items-center">
          {profile?.signature ? (
            <Image
              src={photoofMan}
              alt="Student Signature"
              width={200}
              height={100}
              className="object-contain"
            />
          ) : (
            <div className="w-48 h-24 bg-gray-200 flex items-center justify-center">
              No Signature
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">Upload Student Signature</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Name */}
        <div>
          <label className="block text-gray-600 font-semibold">
            First Name
          </label>
          <input
            value={userData.firstName}
            readOnly
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">
            Middle Name
          </label>
          <input
            value={userData.middleName ?? ""}
            readOnly
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">Last Name</label>
          <input
            value={userData.lastName}
            readOnly
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">Email</label>
          <input
            value={userData.email}
            readOnly
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">
            Phone Number
          </label>
          <input
            value={userData.phoneNumber}
            readOnly
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">
            Father&apos;s Name
          </label>
          <input
            value={profile?.fatherName ?? ""}
            readOnly
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">
            Mother&apos;s Name
          </label>
          <input
            value={profile?.motherName ?? ""}
            readOnly
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">Gender</label>
          <input
            value={profile?.gender ?? ""}
            readOnly
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">
            Marital Status
          </label>
          <input
            value={profile?.maritalStatus ?? ""}
            readOnly
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">
            Date of Birth
          </label>
          <input
            value={
              profile?.dateOfBirth
                ? new Date(profile.dateOfBirth).toLocaleDateString()
                : ""
            }
            readOnly
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">
            College Name
          </label>
          <input
            value={profile?.collegeName ?? ""}
            readOnly
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">
            College Address
          </label>
          <input
            value={profile?.collegeAddress ?? ""}
            readOnly
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">Program</label>
          <input
            value={profile?.program?.name ?? ""}
            readOnly
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">Semester</label>
          <input
            value={profile?.semester?.name ?? ""}
            readOnly
            className="input-field w-full"
          />
        </div>
      </div>

      <p className="mt-6 text-center text-green-500 font-semibold">
        You are not allowed to edit information after your application is
        approved
      </p>
    </div>
  );
};

export default ProfilePage;
