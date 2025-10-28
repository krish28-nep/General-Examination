"use client";
import { Button } from "@/components/general/Button";
import { ReusableDropdown } from "@/components/general/ResuableDropDown";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { fetchProgram } from "@/lib/api/program";
import { fetchUser } from "@/lib/api/user";
import { ExamType } from "@/types/application";
import { Program } from "@/types/program";
import { Semester } from "@/types/semester";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Exam = () => {
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

  const programId = userData?.studentProfile?.programId
  const {
    data: programData,
    isLoading: programDataLoading,
    isError: programDataError,
  } = useQuery<Program>({
    queryKey: ["programs", programId],
    queryFn: () => fetchProgram(programId!),
    enabled: !!programId,
  });
  const [selectedExamType, setSelectedExamType] = useState<ExamType | null>(
    null,
  );
  const router = useRouter();
  const [semester, setSemester] = useState<Semester | null>(null);

  if (programDataLoading || isLoading) {
    return <Spinner />;
  }

  if (programDataError || isError) {
    return <div className="p-4 text-red-500">Failed to load program data</div>;
  }

  const programName =
    userData?.studentProfile?.program?.name ?? programData?.name ?? "—";

  return (
    <div className="space-y-8">
      <h1 className="flex items-center gap-4 sub-heading-text">
        <Calendar size={26} /> Select Semester and Exam Type
      </h1>
      <div className="flex flex-col border p-4 gap-4 w-[1000px]">
        <div className="flex gap-4 items-center">
          <span className="text-lg font-medium text-gray-700">
            Program Name:
          </span>
          <span className="text-lg font-semibold">
            {programName}
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex-1 text-lg font-semibold">Semester</span>
          <div className="flex-1">
            <ReusableDropdown
              items={programData?.semesters.map((sem) => sem.name) ?? []}
              value={semester?.name}
              onSelect={(item) => {
                const selected = programData?.semesters.find(
                  (s) => s.name === item,
                );
                setSemester(selected!);
              }}
              placeholder="Select Semester"
            />
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex-1 text-lg font-semibold">Exam Type</span>
          <div className="flex-1 ">
            <ReusableDropdown
              items={Object.values(ExamType)}
              value={selectedExamType}
              onSelect={(item) => setSelectedExamType(item)}
              placeholder="Select Exam Type"
            />
          </div>
        </div>
      </div>
      <div className="w-[1000px] flex justify-end">
        <Button
          disabled={!semester || !selectedExamType}
          onClick={() => {
            if (semester && selectedExamType) {
              router.push(
                `/student/exam/selectCourses?semester=${semester.id}&examType=${selectedExamType}`,
              );
            }
          }}
          text="Next"
        />
      </div>
    </div>
  );
};

export default Exam;
