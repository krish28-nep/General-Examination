"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Users, Plus } from "lucide-react";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/general/Button";
import { Spinner } from "@/components/Spinner";
import { fetchUsers } from "@/lib/api/user";
import { studentColumns } from "@/lib/columns/studentColumn";
import { User } from "@/types/user";

const StudentPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const {
    data: usersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredStudents = usersData?.filter((student: User) => {
    const name =
      `${student.firstName} ${student.middleName ?? ""} ${student.lastName}`.toLowerCase();
    return (
      name.includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phoneNumber.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-8">
      <h1 className="flex items-center gap-4 heading-text">
        <Users size={26} /> Student Management
      </h1>

      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
        <Button
          onClick={() => router.push("/admin/students/add")}
          icon={<Plus size={16} />}
          text="Add Student"
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <p className="error-text">Failed to load students</p>
      ) : (
        <DataTable columns={studentColumns} data={filteredStudents ?? []} />
      )}
    </div>
  );
};

export default StudentPage;
