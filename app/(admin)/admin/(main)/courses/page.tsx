"use client";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/general/Button";
import { Spinner } from "@/components/Spinner";
import { fetchCourses } from "@/lib/api/course";
import { courseColumns } from "@/lib/columns/courseColumn";
import { Course } from "@/types/semester";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CoursePage = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const {
        data: coursesData,
        isLoading: coursesLoading,
        isError: coursesError,
    } = useQuery({
        queryKey: ["courses"],
        queryFn: fetchCourses,
    });

    const filteredData = coursesData?.filter((course: Course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <h1 className="flex items-center gap-4 heading-text">
                <BookOpen size={26} /> Course Management
            </h1>

            <div className="flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field"
                />
            </div>

            {coursesLoading ? (
                <Spinner />
            ) : coursesError ? (
                <p className="error-text">Failed to load courses</p>
            ) : (
                <DataTable columns={courseColumns} data={filteredData || []} />
            )}
        </div>
    );
};

export default CoursePage;
