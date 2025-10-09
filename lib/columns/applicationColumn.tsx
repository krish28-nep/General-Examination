'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Eye, Trash } from 'lucide-react';

import { useToast } from '@/hooks/usetoast';
import { ConfirmationModal } from '@/components/modals/ConfirmModal';
import type { Application } from '@/types/application';
import type { Row } from '@tanstack/react-table';
import { deleteApplication } from '../api/application';

export const ApplicationActionCell = ({ row }: { row: Row<Application> }) => {
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const queryClient = useQueryClient();
    const toast = useToast();

    const deleteMutation = useMutation({
        mutationFn: deleteApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'], exact: false });
            toast('Application deleted successfully.', 'success');
        },
        onError: error => {
            if (isAxiosError(error)) {
                const message =
                    error.response?.statusText || 'An error occurred while processing your request.';
                toast(message, 'error');
            } else {
                toast('An unexpected error occurred. Please try again later.', 'error');
            }
        },
    });

    const handleDeleteConfirmation = () => {
        deleteMutation.mutate(row.original.id);
        setShowConfirmDeleteModal(false);
    };

    return (
        <>
            <div className="flex gap-4 ease-in-out">
                <Link
                    href={`/admin/applications/${row.original.id}`}
                    className="hover:bg-primary/10 hover:text-primary rounded-full p-2 transition-colors duration-300"
                >
                    <Eye className="cursor-pointer" size={16} />
                </Link>

                <div
                    onClick={() => setShowConfirmDeleteModal(true)}
                    className="hover:bg-danger/10 hover:text-danger rounded-full p-2 transition-colors duration-300"
                >
                    <Trash className="cursor-pointer" size={16} />
                </div>
            </div>

            <ConfirmationModal
                isOpen={showConfirmDeleteModal}
                onClose={() => setShowConfirmDeleteModal(false)}
                onConfirm={handleDeleteConfirmation}
                title="Delete Application"
                description="Are you sure you want to delete this application?"
                confirmButtonVariant="danger"
            />
        </>
    );
};


export const applicationColumns: ColumnDef<Application>[] = [
    {
        accessorKey: 'user',
        header: 'Student Name',
        cell: ({ row }) => {
            const user = row.getValue('user') as Application['user'];
            return `${user.firstName} ${user.middleName ?? ''} ${user.lastName}`.trim();
        },
    },
    {
        id: 'email',
        header: 'Email',
        cell: ({ row }) => {
            const user = row.getValue('user') as Application['user'];
            return user.email;
        },
    },
    {
        accessorKey: 'semester',
        header: 'Semester',
        cell: ({ row }) => {
            const semester = row.getValue('semester') as Application['semester'];
            return semester?.name ?? '—';
        },
    },
    {
        accessorKey: 'examType',
        header: 'Exam Type',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const color =
                status === 'Pending'
                    ? 'text-warning'
                    : status === 'Rejected'
                        ? 'text-danger'
                        : 'text-success';
            return <span className={color}>{status}</span>;
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Applied On',
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt') as string);
            return date.toLocaleDateString();
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ApplicationActionCell row={row} />,
    },
];
