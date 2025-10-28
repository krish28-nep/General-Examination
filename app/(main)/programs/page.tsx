"use client"
import { Button } from '@/components/general/Button';
import { fetchPrograms } from '@/lib/api/program';
import { Program } from '@/types/program';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react'

const ProgramPage = () => {
    const router = useRouter()

    const {
        data: programsData = [],
    } = useQuery<Program[]>({
        queryKey: ["programs"],
        queryFn: fetchPrograms,
    });

    if (!programsData) {
        return <span>No program Loaded</span>;
    }
    return (
        <div className="flex flex-col gap-10 content-wrapper">
            {/* Section Header */}
            <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                    Academic Programs
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    Explore our diverse range of undergraduate and postgraduate programs
                    designed to shape future-ready professionals.
                </p>
            </div>

            {/* Program Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                {programsData.map((program) => (
                    <div
                        key={program.id}
                        className="border rounded-xl bg-card p-6 hover:shadow-lg transition-shadow flex flex-col justify-between"
                    >
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {program.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{program.degree}</p>
                                </div>

                                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                                    {program.semesters.length ?? 0} Semesters
                                </span>
                            </div>
                        </div>

                        <div className="pt-5 mt-5 border-t border-border flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Program Fee</p>
                                <p className="text-lg font-bold text-foreground">
                                    Rs. {program.fee.toLocaleString()}
                                </p>
                            </div>

                            <Button
                                onClick={() => router.push(`/programs/${program.id}`)}
                                variant="outline"
                                text="Learn more"
                                className="shrink-0"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProgramPage
