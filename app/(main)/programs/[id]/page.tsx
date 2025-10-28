"use client";
import { fetchProgram } from '@/lib/api/program';
import { Program } from '@/types/program';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

const DetailPage = () => {
    const { id } = useParams()
    const programId = Number(id);

    const {
        data: programData,
    } = useQuery<Program>({
        queryKey: ["programs", programId],
        queryFn: () => fetchProgram(programId),
        enabled: !!programId
    });

    if (!programData) {
        return <span>No program Loaded</span>;
    }

    return (
        <div className="content-wrapper py-8 space-y-10">
            <h1 className="text-center text-2xl font-semibold mb-8">Course Structure</h1>
            <h2 className="text-lg font-medium">{programData.name}</h2>

            {programData.semesters.map((sem, index) => {
                const totalCredits = sem.courses.reduce((sum, c) => sum + c.credit, 0);
                const totalFullMarks = sem.courses.length * 100;

                return (
                    <div key={sem.id} className="space-y-4 rounded-lg p-6 shadow-sm bg-white">
                        <h3 className="text-lg font-semibold">
                            Semester {index + 1} ({sem.name})
                        </h3>

                        <table className="w-full border-collapse text-base">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2 text-left">SN</th>
                                    <th className="py-2 text-left">Course Code</th>
                                    <th className="py-2 text-left">Course Title</th>
                                    <th className="py-2 text-center">Credit Hrs.</th>
                                    <th className="py-2 text-center">Full Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sem.courses.map((course, i) => (
                                    <tr key={course.id} className="border-b">
                                        <td className="py-2">{i + 1}</td>
                                        <td className="py-2">{course.code}</td>
                                        <td className="py-2">{course.name}</td>
                                        <td className="py-2 text-center">{course.credit}</td>
                                        <td className="py-2 text-center">100</td>
                                    </tr>
                                ))}
                                <tr className="font-semibold">
                                    <td className="py-2" colSpan={3}>Total</td>
                                    <td className="py-2 text-center">{totalCredits}</td>
                                    <td className="py-2 text-center">{totalFullMarks}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );
};

export default DetailPage;
