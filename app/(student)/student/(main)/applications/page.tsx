"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/general/Button";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { fetchApplications, fetchApplicationsByUser } from "@/lib/api/application";
import { applicationColumns } from "@/lib/columns/applicationColumn";
import { Application } from "@/types/application";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ApplicationPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { user } = useAuth()

  const { data: applicationsData = [], isLoading: applicationsDataLoading, isError: applicationsDataError } = useQuery<Application[]>({
    queryFn: () => fetchApplicationsByUser(Number(user?.id)),
    queryKey: ["applications", "user", Number(user?.id)],
    enabled: !!user?.id
  })

  return (
    <div className="space-y-8">
      <h1 className="flex items-center gap-4 heading-text">
        <BookOpen size={26} /> Application
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
          onClick={() => router.push("/student/exam")}
          icon={<Plus size={16} />}
          text="Add Application"
        />
      </div>

      {applicationsDataLoading ? (
        <Spinner />
      ) : applicationsDataError ? (
        <p className="error-text">Failed to load applications</p>
      ) : (
        <DataTable columns={applicationColumns} data={applicationsData ?? []} />
      )}
    </div>
  );
};

export default ApplicationPage;
