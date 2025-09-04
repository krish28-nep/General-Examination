"use client"
import { Spinner } from '@/components/Spinner'
import { fetchPrograms } from '@/lib/api/program'
import { useQuery } from '@tanstack/react-query'
import { BookOpen } from 'lucide-react'
import React from 'react'

const ProgramPage = () => {
    const { data: programsData, isLoading: programsDataLoading, isError: programsDataError } = useQuery({
        queryKey: ["programs"],
        queryFn: fetchPrograms
    })
    if (programsDataLoading) return <Spinner />;

    if (programsDataError) return <p>Failed to load programs</p>;

    return (
        <div className='wrapper space-y-10'>
            <h1 className='flex items-center gap-4 heading-text'><BookOpen size={26} />Program</h1>
        </div>
    )
}

export default ProgramPage
