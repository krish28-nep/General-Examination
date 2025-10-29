"use client";
import Barchart from "@/components/charts/Barchart";
import Piechart from "@/components/charts/Piechart";
import { DataTable } from "@/components/DataTable";
import { fetchApplications } from "@/lib/api/application";
import { fetchTotalCourses, fetchTotalPrograms, fetchTotalUsers } from "@/lib/api/dashboard";
import { applicationColumns } from "@/lib/columns/applicationColumn";
import { Application, } from "@/types/application";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  Users,
} from "lucide-react";
import React, { useState } from "react";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: totalUsers, isLoading: totalUserLoading } = useQuery({
    queryFn: fetchTotalUsers,
    queryKey: ["totalUsers"]
  })
  const { data: totalCourses, isLoading: totalCoursesLoading } = useQuery({
    queryFn: fetchTotalCourses,
    queryKey: ["totalCourses"]
  })
  const { data: totalPrograms, isLoading: totalProgramsLoading } = useQuery({
    queryFn: fetchTotalPrograms,
    queryKey: ["totalPrograms"]
  })

  const {
    data: applicationsData = [],
    isLoading,
    isError,
  } = useQuery<Application[]>({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });
  const stats = [
    {
      title: "Total Users",
      value: totalUserLoading ? "..." : totalUsers ?? 0,
      icon: Users,
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Total Applications",
      value: applicationsData.length, // Replace later with real API
      icon: FileText,
      change: "+8.2%",
      changeType: "positive" as const,
    },
    {
      title: "Active Courses",
      value: totalCoursesLoading ? "..." : totalCourses ?? 0,
      icon: BookOpen,
      change: "+3",
      changeType: "positive" as const,
    },
    {
      title: "Programs",
      value: totalProgramsLoading ? "..." : totalPrograms ?? 0,
      icon: GraduationCap,
      change: "Stable",
      changeType: "neutral" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-row items-center justify-between pb-2">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  {stat.title}
                </span>
                <Icon className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stat.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <Barchart />

        {/* Doughnut Chart */}
        <Piechart />
      </div>

      <div className="space-y-8">
        {/* Header */}
        <h1 className="flex items-center gap-4 heading-text">
          <ClipboardList size={26} />
          Application Management
        </h1>

        {/* Search + Action Row */}
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Search ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Data Table Section */}
        <DataTable
          columns={applicationColumns}
          data={applicationsData ?? []}
        />
      </div>
    </div>
  );
};

export default Dashboard;
