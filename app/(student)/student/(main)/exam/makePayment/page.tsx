"use client";
import { useToast } from "@/hooks/usetoast";
import { initiateKhalti } from "@/lib/api/khalti";
import { fetchSemester } from "@/lib/api/semester";
import { fetchUser } from "@/lib/api/user";
import {
    BuildKhaltiExamPayload,
    KhaltiExamPaymentPayload,
} from "@/lib/helper/khalti";
import { ExamType } from "@/types/application";
import { Semester } from "@/types/semester";
import { User } from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";
import khaltiLogo from "@/public/khalti.png";
import Image from "next/image";
import { Spinner } from "@/components/Spinner";

const MakePaymentPage = () => {
    const toast = useToast();
    const searchParams = useSearchParams();
    const id = Number(searchParams.get("semester"));
    const userId = 1;
    const examType = searchParams.get("examType") as ExamType;
    const selectedCoursesIds =
        searchParams.get("courses")?.split(",").map(Number) ?? [];
    const {
        data: semesterData,
        isLoading: semesterDataLoading,
        isError: semesterDataError,
    } = useQuery<Semester>({
        queryKey: ["semesters", id],
        queryFn: () => fetchSemester(id),
    });

    const {
        data: userData,
        isLoading: userDataLoading,
        isError: userDataError,
    } = useQuery<User>({
        queryKey: ["users", userId],
        queryFn: () => fetchUser(userId),
    });

    const courses =
        semesterData?.courses.filter((course) =>
            selectedCoursesIds.includes(course.id),
        ) ?? [];

    const khaltiMutation = useMutation({
        mutationFn: async (payload: KhaltiExamPaymentPayload) =>
            await initiateKhalti(payload),
        onSuccess: (data) => {
            window.location.href = data.payment_url;
        },
        onError: () => toast("Failed to initiate Khalti payment", "error"),
    });

    const handlePayment = () => {
        if (!semesterData || !userData) {
            toast("Required data missing", "error");
            return;
        }

        const payload = BuildKhaltiExamPayload(
            examType,
            semesterData,
            courses,
            userData,
        );
        localStorage.setItem(
            "applicationData",
            JSON.stringify({
                userId: userData.id,
                semesterId: semesterData.id,
                examType,
                courseIds: courses.map((c) => c.id),
            }),
        );

        khaltiMutation.mutate(payload);
    };

    if (semesterDataLoading || userDataLoading) {
        return <Spinner />;
    }

    if (semesterDataError || userDataError) {
        return (
            <div className="p-4 text-red-500">
                Failed to load data
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="flex items-center gap-4 sub-heading-text">
                <Calendar size={26} /> Select Payment
            </h1>
            <div className="flex flex-col border p-4 gap-4 w-[1000px]">
                <div className="flex gap-4 items-center">
                    <span className="flex-1 text-lg font-semibold">Program</span>
                    <span className="flex-1 text-base font-semibold">
                        {semesterData?.program.name}
                    </span>
                </div>
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
                <div className="flex gap-4 items-center">
                    <span className="flex-1 text-lg font-semibold">Amount</span>
                    <span className="flex-1 text-base font-semibold">
                        {semesterData?.fee}
                    </span>
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
                                        <td className="border-neutral border-b px-2 py-1 text-center">
                                            {selectedCoursesIds.includes(course.id) ? "✔️" : ""}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="w-[1000px] flex items-center justify-end gap-4">
                <span className="text-lg font-semibold">Select payment</span>
                <button
                    onClick={handlePayment}
                    disabled={khaltiMutation.isPending}
                    className="relative flex items-center gap-2 cursor-pointer"
                >
                    {khaltiMutation.isPending && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    <Image
                        alt="khalti"
                        width={64}
                        height={64}
                        src={khaltiLogo}
                        className="h-4/5 object-contain"
                    />
                </button>
            </div>
        </div>
    );
};

export default MakePaymentPage;
