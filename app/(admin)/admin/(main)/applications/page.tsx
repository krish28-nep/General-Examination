"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";

import { DataTable } from "@/components/DataTable";
import { Spinner } from "@/components/Spinner";
import { fetchApplications } from "@/lib/api/application";
import { applicationColumns } from "@/lib/columns/applicationColumn";

const ApplicationPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: applicationsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });

  // // Optional search filtering (client-side)
  // const filteredApplications = applicationsData?.filter((app: any) => {
  //     const fullName = `${app.user.firstName} ${app.user.middleName ?? ''} ${app.user.lastName}`.toLowerCase();
  //     return (
  //         fullName.includes(searchTerm.toLowerCase()) ||
  //         app.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         app.semester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         app.examType.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         app.status.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  // });

  return (
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
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <p className="error-text">Failed to load applications</p>
      ) : (
        <DataTable columns={applicationColumns} data={applicationsData ?? []} />
      )}
    </div>
  );
};

export default ApplicationPage;
