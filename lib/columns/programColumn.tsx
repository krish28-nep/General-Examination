'use client';
import type { ColumnDef } from '@tanstack/react-table';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import Link from 'next/link';
import { PenSquare, Trash } from 'lucide-react';
import type { Row } from '@tanstack/react-table';
import type { Program } from '@/types/program';
import { useToast } from '@/hooks/usetoast';
import { deleteProgram } from '../api/program';
import { ConfirmationModal } from '@/components/modals/ConfirmModal';

export const ProgramActionCell = ({ row }: { row: Row<Program> }) => {
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const queryClient = useQueryClient();
    const toast = useToast()

    const deleteMutation = useMutation({
        mutationFn: deleteProgram,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'], exact: false });
            toast('Program deleted successfully.', 'success');
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
                    href={`/admin/programs/${row.original.id}/update`}
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
                title="Delete Program"
                description="Are you sure you want to delete this program?"
                confirmButtonVariant="danger"
            />
        </>
    );
};


export const programColumns: ColumnDef<Program>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'Program Name',
    },
    {
        accessorKey: 'degree',
        header: 'Degree',
    },
    {
        accessorKey: 'fee',
        header: 'Fee',
        cell: ({ row }) => {
            const fee = row.getValue('fee') as number;
            return `₤${fee.toLocaleString()}`;
        },
    },
    {
        accessorKey: 'semesters',
        header: 'Semesters',
        cell: ({ row }) => {
            const semesters = row.getValue('semesters') as { name: string }[];
            return semesters?.length ?? '—';
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ProgramActionCell row={row} />,
    },
];
