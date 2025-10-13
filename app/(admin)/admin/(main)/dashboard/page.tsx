"use client";
import Barchart from "@/components/charts/Barchart";
import Piechart from "@/components/charts/Piechart";
import { DataTable } from "@/components/DataTable";
import { applicationColumns } from "@/lib/columns/applicationColumn";
import { Application, ApplicationStatus, ExamType } from "@/types/application";
import { SemesterName } from "@/types/semester";
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
  const stats = [
    {
      title: "Total Students",
      value: "1,284",
      icon: Users,
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Total Applications",
      value: "298",
      icon: FileText,
      change: "+8.2%",
      changeType: "positive" as const,
    },
    {
      title: "Active Courses",
      value: "47",
      icon: BookOpen,
      change: "+3",
      changeType: "positive" as const,
    },
    {
      title: "Programs",
      value: "8",
      icon: GraduationCap,
      change: "Stable",
      changeType: "neutral" as const,
    },
  ];

  const dummyApplications: Application[] = [
    {
      id: 1,
      user: {
        firstName: "Sandeep",
        lastName: "Thapa",
        email: "sandeep.thapa@example.com",
      },
      semester: { name: SemesterName.First },
      examType: ExamType.Regular,
      status: ApplicationStatus.Pending,
      createdAt: new Date("2025-03-12T09:24:00"),
    },
    {
      id: 2,
      user: {
        firstName: "Anjali",
        middleName: "K.",
        lastName: "Rai",
        email: "anjali.rai@example.com",
      },
      semester: { name: SemesterName.Second },
      examType: ExamType.Back,
      status: ApplicationStatus.Success,
      createdAt: new Date("2025-03-14T11:10:00"),
    },
    {
      id: 3,
      user: {
        firstName: "Bibek",
        lastName: "Shrestha",
        email: "bibek.shrestha@example.com",
      },
      semester: { name: SemesterName.Third },
      examType: ExamType.Regular,
      status: ApplicationStatus.Rejected,
      createdAt: new Date("2025-03-20T14:42:00"),
    },
    {
      id: 4,
      user: {
        firstName: "Nisha",
        lastName: "Gurung",
        email: "nisha.gurung@example.com",
      },
      semester: { name: SemesterName.Fourth },
      examType: ExamType.Regular,
      status: ApplicationStatus.Success,
      createdAt: new Date("2025-04-02T10:15:00"),
    },
    {
      id: 5,
      user: {
        firstName: "Rabin",
        lastName: "KC",
        email: "rabin.kc@example.com",
      },
      semester: { name: SemesterName.Fifth },
      examType: ExamType.Back,
      status: ApplicationStatus.Pending,
      createdAt: new Date("2025-04-10T08:55:00"),
    },
    {
      id: 6,
      user: {
        firstName: "Sujata",
        middleName: "M.",
        lastName: "Bista",
        email: "sujata.bista@example.com",
      },
      semester: { name: SemesterName.Sixth },
      examType: ExamType.Regular,
      status: ApplicationStatus.Success,
      createdAt: new Date("2025-04-15T09:45:00"),
    },
    {
      id: 7,
      user: {
        firstName: "Roshan",
        lastName: "Lama",
        email: "roshan.lama@example.com",
      },
      semester: { name: SemesterName.Seventh },
      examType: ExamType.Regular,
      status: ApplicationStatus.Pending,
      createdAt: new Date("2025-05-01T13:00:00"),
    },
    {
      id: 8,
      user: {
        firstName: "Pooja",
        lastName: "Sharma",
        email: "pooja.sharma@example.com",
      },
      semester: { name: SemesterName.Eighth },
      examType: ExamType.Back,
      status: ApplicationStatus.Rejected,
      createdAt: new Date("2025-05-12T15:20:00"),
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
          data={dummyApplications ?? []}
        />
      </div>
    </div>
  );
};

export default Dashboard;
