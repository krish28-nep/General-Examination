"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Application } from "@/types/application";
import Image from "next/image";
import { fetchApplication } from "@/lib/api/application";
import { Button } from "@/components/general/Button";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner";

const ApplicationDetailPage = () => {
    const { id } = useParams();
    const applicationId = Number(id);
    const router = useRouter()

    const {
        data: applicationData,
        isLoading,
        isError,
    } = useQuery<Application>({
        queryKey: ["applications", applicationId],
        queryFn: () => fetchApplication(applicationId),
        enabled: !!applicationId,
    });

    if (isLoading) return <Spinner />;
    if (isError) return <span>Failed to load application.</span>;
    if (!applicationData) return <span>No application found.</span>;

    const { user, program, semester, examType, status, createdAt } = applicationData;
    const studentProfile = user.studentProfile;

    return (
        <div className="content-wrapper py-8 space-y-10">
            <div className=" flex items-center justify-between">
                <h1 className="text-center text-2xl font-semibold mb-8">
                    Application Details
                </h1>
                <Button onClick={() => router.push('/admin/applications')} text="Back" />
            </div>

            {/* ====== Student Information ====== */}
            <section className="space-y-4 rounded-lg p-6 shadow-sm bg-white">
                <h2 className="text-lg font-semibold border-b pb-2">
                    Student Information
                </h2>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-32 h-32 relative rounded-md overflow-hidden border">
                        <Image
                            src={user.photoUrl || "/placeholder-avatar.png"}
                            alt="Student Photo"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                        <p><strong>Name:</strong> {`${user.firstName} ${user.middleName ?? ""} ${user.lastName}`}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phoneNumber}</p>
                        {studentProfile && (
                            <>
                                <p><strong>Father’s Name:</strong> {studentProfile.fatherName}</p>
                                <p><strong>Mother’s Name:</strong> {studentProfile.motherName}</p>
                                <p><strong>Gender:</strong> {studentProfile.gender}</p>
                                <p><strong>Marital Status:</strong> {studentProfile.maritalStatus}</p>
                                <p><strong>Date of Birth:</strong> {new Date(studentProfile.dateOfBirth).toLocaleDateString()}</p>
                                <p><strong>College:</strong> {studentProfile.collegeName}</p>
                                <p><strong>Address:</strong> {studentProfile.collegeAddress}</p>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ====== Application Details ====== */}
            <section className="space-y-4 rounded-lg p-6 shadow-sm bg-white">
                <h2 className="text-lg font-semibold border-b pb-2">
                    Application Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    <p><strong>Program:</strong> {program.name}</p>
                    <p><strong>Semester:</strong> {semester.name}</p>
                    <p><strong>Exam Type:</strong> {examType}</p>

                    <p><strong>Status:</strong>
                        <span className={`ml-2 font-semibold ${status === "Success"
                            ? "text-green-600"
                            : status === "Rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}>
                            {status}
                        </span>
                    </p>
                    <p><strong>Applied On:</strong> {new Date(createdAt).toLocaleDateString()}</p>
                </div>
            </section>

            {/* ====== Signature ====== */}
            {studentProfile?.signature && (
                <section className="rounded-lg p-6 shadow-sm bg-white">
                    <h2 className="text-lg font-semibold border-b pb-2 mb-4">Signature</h2>
                    <div className="relative w-40 h-20 border rounded-md overflow-hidden">
                        <Image
                            src={studentProfile.signature}
                            alt="Signature"
                            fill
                            className="object-contain bg-white"
                        />
                    </div>
                </section>
            )}
        </div>
    );
};

export default ApplicationDetailPage;
