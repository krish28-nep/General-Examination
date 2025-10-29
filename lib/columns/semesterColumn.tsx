"use client";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import Link from "next/link";
import { PenSquare, Trash } from "lucide-react";
import { useToast } from "@/hooks/usetoast";
import { ConfirmationModal } from "@/components/modals/ConfirmModal";
import type { Semester } from "@/types/semester";
import { deleteSemester } from "../api/semester";

export const semesterColumns: ColumnDef<Semester>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Semester Name",
  },
  {
    accessorKey: "fee",
    header: "Fee (₤)",
    cell: ({ row }) => {
      const fee = row.getValue("fee") as number;
      return `Rs. ${fee.toLocaleString()}`;
    },
  },
  {
    accessorKey: "Degree",
    header: "Degree",
    cell: ({ row }) => {
      const degree = row.original.program.degree ?? "—";
      return degree;
    },
  },
  {
    accessorKey: "program",
    header: "Program",
    cell: ({ row }) => {
      const programName = row.original.program.name ?? "—";
      return programName;
    },
  },
  {
    accessorKey: "courses",
    header: "Courses Count",
    cell: ({ row }) => {
      const courses = row.getValue("courses") as { name: string }[];
      return courses?.length ?? "—";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <SemesterActionCell row={row} />,
  },
];

// Inline ActionCell (no separate component)
const SemesterActionCell = ({ row }: { row: Row<Semester> }) => {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();

  const deleteMutation = useMutation({
    mutationFn: deleteSemester,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"], exact: false });
      toast("Semester deleted successfully.", "success");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const message =
          error.response?.statusText ||
          "An error occurred while processing your request.";
        toast(message, "error");
      } else {
        toast("An unexpected error occurred. Please try again later.", "error");
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
          href={`/admin/semesters/${row.original.id}/update`}
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
        title="Delete Semester"
        description="Are you sure you want to delete this semester?"
        confirmButtonVariant="danger"
      />
    </>
  );
};
