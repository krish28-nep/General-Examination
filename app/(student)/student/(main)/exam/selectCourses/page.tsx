"use client";
import { Button } from "@/components/general/Button";
import { Spinner } from "@/components/Spinner";
import { fetchSemester } from "@/lib/api/semester";
import { Semester } from "@/types/semester";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const SelectCoursesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("semester");
  const examType = searchParams.get("examType");
  const {
    data: semesterData,
    isLoading: semesterDataLoading,
    isError: semesterDataError,
  } = useQuery<Semester>({
    queryKey: ["semesters", Number(id)],
    queryFn: () => fetchSemester(Number(id)),
  });

  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);

  const toggleCourseSelection = (courseId: number) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  if (semesterDataLoading) {
    return <Spinner />;
  }

  if (semesterDataError) {
    return (
      <div className="p-4 text-red-500">
        Failed to load semester data
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="flex items-center gap-4 sub-heading-text">
        <Calendar size={26} /> Select Courses
      </h1>
      <div className="flex flex-col border p-4 gap-4 w-[1000px]">
        <div className="flex gap-4 items-center">
          <span className="flex-1 text-lg font-semibold">Semester</span>
          <span className="flex-1 text-base font-semibold">
            {semesterData?.name}
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex-1 text-lg font-semibold">Exam Type</span>
          <span className="flex-1 text-base font-semibold">{examType}</span>
        </div>
        <hr />
        <span className="text-base font-semibold">Courses</span>
        <div className="border-neutral w-full overflow-x-auto rounded-md border-x border-t text-base">
          <table className="min-w-full border-collapse">
            <thead className="text-left">
              <tr>
                <th className="border-neutral border-b px-2 py-1">S.N </th>
                <th className="border-neutral border-b px-2 py-1">Name</th>
                <th className="border-neutral border-b px-2 py-1">
                  Course code
                </th>
                <th className="border-neutral border-b px-2 py-1">Type</th>
                <th className="border-neutral border-b px-2 py-1">Credit</th>
                <th className="border-neutral border-b px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {semesterData &&
                semesterData.courses &&
                semesterData.courses.map((course, index) => (
                  <tr key={`course - ${index}`}>
                    <td className="border-neutral border-b px-2 py-1">
                      {index + 1}
                    </td>
                    <td className="border-neutral border-b px-2 py-1">
                      {course.name}
                    </td>
                    <td className="border-neutral border-b px-2 py-1">
                      {course.code}
                    </td>
                    <td className="border-neutral border-b px-2 py-1">
                      {course.type}
                    </td>
                    <td className="border-neutral border-b px-2 py-1">
                      {course.credit}
                    </td>
                    <td
                      onClick={() => toggleCourseSelection(course.id)}
                      className="border-neutral border-b px-2 py-1 cursor-pointer"
                    >
                      {selectedCourseIds.includes(course.id) ? "✔️" : ""}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-[1000px] flex justify-end">
        <Button
          disabled={selectedCourseIds.length === 0}
          onClick={() =>
            router.push(
              `/student/exam/makePayment?semester=${id}&examType=${examType}&courses=${selectedCourseIds.join(",")}`,
            )
          }
          text="Next"
        />
      </div>
    </div>
  );
};

export default SelectCoursesPage;
