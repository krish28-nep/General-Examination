"use client"
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import Link from 'next/link';
import { PenSquare, Trash } from 'lucide-react';
import type { Row } from '@tanstack/react-table';
import { useToast } from '@/hooks/usetoast';
import { deleteCourse } from '../api/course';
import { ConfirmationModal } from '@/components/modals/ConfirmModal';
import { Course } from '@/types/semester';

const CourseActionCell = ({ row }: { row: Row<Course> }) => {
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const queryClient = useQueryClient();
    const toast = useToast();

    const deleteMutation = useMutation({
        mutationFn: deleteCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'], exact: false });
            toast('Course deleted successfully.', 'success');
        },
        onError: error => {
            if (isAxiosError(error)) {
                const message =
                    error.response?.statusText ||
                    'An error occurred while processing your request.';
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
                    href={`/admin/courses/${row.original.id}/update`}
                    className="hover:bg-warning/10 hover:text-warning rounded-full p-2 transition-colors duration-300"
                >
                    <PenSquare className="cursor-pointer" size={16} />
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
                title="Delete Course"
                description="Are you sure you want to delete this course?"
                confirmButtonVariant="danger"
            />
        </>
    );
};


export const courseColumns: ColumnDef<Course>[] = [
    {
        accessorKey: 'name',
        header: 'Course Name',
    },
    {
        accessorKey: 'code',
        header: 'Code',
    },
    {
        accessorKey: 'type',
        header: 'Type',
    },
    {
        accessorKey: 'credit',
        header: 'Credit',
        cell: ({ row }) => {
            const credit = row.getValue('credit') as number;
            return credit ?? '—';
        },
    },
    {
        accessorKey: 'semester',
        header: 'Semester',
        cell: ({ row }) => {
            const semester = row.getValue('semester') as { name: string } | null;
            return semester?.name ?? '—';
        },
    },
    {
        id: 'Degree',
        header: 'Degree',
        cell: ({ row }) => {
            const degree = row.original.semester.program.degree
            return degree ?? '—';
        },
    },
    {
        id: 'program',
        header: 'Program',
        cell: ({ row }) => {
            const programName = row.original.semester.program.name
            return programName ?? '—';
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <CourseActionCell row={row} />,
    },
];
