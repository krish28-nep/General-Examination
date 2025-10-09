"use client"
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/general/Button'
import { Spinner } from '@/components/Spinner'
import { fetchPrograms } from '@/lib/api/program'
import { programColumns } from '@/lib/columns/programColumn'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const ProgramPage = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()
    const { data: programsData, isLoading: programsDataLoading, isError: programsDataError } = useQuery({
        queryKey: ["programs"],
        queryFn: fetchPrograms
    })

    return (
        <div className='space-y-8'>
            <h1 className='flex items-center gap-4 heading-text'><BookOpen size={26} />Program Management</h1>
            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    placeholder="Search ..."
                    value={searchTerm}
                    onChange={e => {
                        setSearchTerm(e.target.value);
                    }}
                    className="input-field"
                />
                <Button onClick={() => router.push("/admin/programs/add")}
                    icon={<Plus size={16} />}
                    text='Add Program' />
            </div>
            {programsDataLoading ? <Spinner /> : programsDataError ? <p className='error-text'>Failed to load programs</p> : <DataTable columns={programColumns} data={programsData} />}
        </div>
    )
}

export default ProgramPage
