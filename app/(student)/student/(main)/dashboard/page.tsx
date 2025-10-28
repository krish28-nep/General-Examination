"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ClipboardList,
  GraduationCap,
  CalendarDays,
  FileText,
} from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { applicationColumns } from "@/lib/columns/applicationColumn";
import { Application } from "@/types/application";
import { User } from "@/types/user";
import photoUrl from "@/public/professional-product-manager.png";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/lib/api/user";
import { Spinner } from "@/components/Spinner";
import { fetchApplicationsByUser } from "@/lib/api/application";

const StudentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth()
  const { data: userData, isLoading, isError } = useQuery<User>({
    queryFn: () => fetchUser(Number(user?.id)),
    queryKey: ["users", Number(user?.id)],
    enabled: !!user?.id
  })

  const { data: applicationsData = [], isLoading: applicationsDataLoading } = useQuery<Application[]>({
    queryFn: () => fetchApplicationsByUser(Number(user?.id)),
    queryKey: ["applications", "user", Number(user?.id)],
    enabled: !!user?.id
  })

  if (!userData || isLoading || applicationsDataLoading) {
    return <Spinner />
  }

  const applications = applicationsData ?? [];

  return (
    <div className="space-y-8">
      {/* Student Profile Overview */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-36 h-36 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700">
            <Image
              src={userData.photoUrl || photoUrl}
              alt="Student Photo"
              width={144}
              height={144}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between flex-1 space-y-3">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              {userData.firstName} {userData.middleName ?? ""} {userData.lastName}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              {userData.studentProfile?.program.name} —{" "}
              {userData.studentProfile?.semester.name} Semester
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Phone:</strong> {userData.phoneNumber}
            </p>
            <p>
              <strong>College:</strong> {userData.studentProfile?.collegeName}
            </p>
            <p>
              <strong>Address:</strong> {userData.studentProfile?.collegeAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Academic Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Current Semester",
            value: userData.studentProfile?.semester.name,
            icon: GraduationCap,
          },
          {
            title: "Program",
            value: userData.studentProfile?.program.name,
            icon: FileText,
          },
          {
            title: "Exam Applications",
            value: userData.applications ? userData.applications.length.toString() : 0,
            icon: ClipboardList,
          },
          {
            title: "Next Exam Cycle",
            value: "December 2025",
            icon: CalendarDays,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex flex-row items-center justify-between pb-2">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  {stat.title}
                </span>
                <Icon className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {stat.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Application History */}
      <div className="space-y-6">
        <h1 className="flex items-center gap-3 text-xl font-semibold">
          <ClipboardList size={22} />
          Exam Applications
        </h1>

        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>

        <DataTable
          columns={applicationColumns}
          data={
            applications?.filter((app) =>
              app.semester?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            ) ?? []
          }
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
