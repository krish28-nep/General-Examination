'use client';

import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/general/Button';
import { Spinner } from '@/components/Spinner';
import { fetchApplications } from '@/lib/api/application';
import { applicationColumns } from '@/lib/columns/applicationColumn';
import { Application } from '@/types/application';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ApplicationPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const {
        data: applicationsData,
        isLoading: applicationsLoading,
        isError: applicationsError,
    } = useQuery<Application[]>({
        queryKey: ['applications'],
        queryFn: fetchApplications,
    });

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
                    onClick={() => router.push('/student/exam')}
                    icon={<Plus size={16} />}
                    text="Add Application"
                />
            </div>

            {applicationsLoading ? (
                <Spinner />
            ) : applicationsError ? (
                <p className="error-text">Failed to load applications</p>
            ) : (
                <DataTable columns={applicationColumns} data={applicationsData ?? []} />
            )}
        </div>
    );
};

export default ApplicationPage;
