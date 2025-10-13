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
import { Application, ApplicationStatus, ExamType } from "@/types/application";
import { SemesterName } from "@/types/semester";
import { Gender, MaritalStatus, Role, User } from "@/types/user";
import photoUrl from "@/public/professional-product-manager.png";

const StudentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mocked student data (replace with API later)
  const student: User = {
    id: 1,
    firstName: "Sandeep",
    middleName: "K.",
    lastName: "Thapa",
    role: Role.Student,
    email: "sandeep.thapa@example.com",
    phoneNumber: "+977 9812345678",
    photoUrl: "/images/student-avatar.jpg",
    studentProfile: {
      id: 1,
      signature: "/images/signature.png",
      fatherName: "Ram Bahadur Thapa",
      motherName: "Sita Thapa",
      gender: Gender.Male,
      maritalStatus: MaritalStatus.Unmarried,
      dateOfBirth: new Date("2002-08-14"),
      collegeName: "ABC College",
      collegeAddress: "Kathmandu, Nepal",
      programId: 1,
      program: { name: "BSc. CSIT" },
      semesterId: 2,
      semester: { name: SemesterName.Second },
    },
  };

  // Dummy application data
  const studentApplications: Application[] = [
    {
      id: 1,
      user: {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      },
      semester: { name: SemesterName.First },
      examType: ExamType.Regular,
      status: ApplicationStatus.Success,
      createdAt: new Date("2025-03-15T09:24:00"),
    },
    {
      id: 2,
      user: {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      },
      semester: { name: SemesterName.Second },
      examType: ExamType.Back,
      status: ApplicationStatus.Pending,
      createdAt: new Date("2025-09-10T09:24:00"),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Student Profile Overview */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-36 h-36 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700">
            <Image
              src={photoUrl}
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
              {student.firstName} {student.middleName ?? ""} {student.lastName}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              {student.studentProfile?.program.name} —{" "}
              {student.studentProfile?.semester.name} Semester
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>Phone:</strong> {student.phoneNumber}
            </p>
            <p>
              <strong>College:</strong> {student.studentProfile?.collegeName}
            </p>
            <p>
              <strong>Address:</strong> {student.studentProfile?.collegeAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Academic Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Current Semester",
            value: student.studentProfile?.semester.name,
            icon: GraduationCap,
          },
          {
            title: "Program",
            value: student.studentProfile?.program.name,
            icon: FileText,
          },
          {
            title: "Exam Applications",
            value: studentApplications.length.toString(),
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
            studentApplications.filter((app) =>
              app.semester.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
            ) ?? []
          }
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
