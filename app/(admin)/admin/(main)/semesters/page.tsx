"use client";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/general/Button";
import { Spinner } from "@/components/Spinner";
import { fetchSemesters } from "@/lib/api/semester";
import { semesterColumns } from "@/lib/columns/semesterColumn";
import { Semester } from "@/types/semester";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SemesterPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const {
    data: semestersData,
    isLoading: semestersLoading,
    isError: semestersError,
  } = useQuery({
    queryKey: ["semesters"],
    queryFn: fetchSemesters,
  });

  const filteredData = semestersData?.filter((semester: Semester) =>
    semester.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <h1 className="flex items-center gap-4 heading-text">
        <Calendar size={26} /> Semester Management
      </h1>

      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />

        <Button
          onClick={() => router.push("/admin/semesters/add")}
          icon={<Plus size={16} />}
          text="Add Semester"
        />
      </div>

      {semestersLoading ? (
        <Spinner />
      ) : semestersError ? (
        <p className="error-text">Failed to load semesters</p>
      ) : (
        <DataTable columns={semesterColumns} data={filteredData || []} />
      )}
    </div>
  );
};

export default SemesterPage;
