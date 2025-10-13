"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Eye, Trash } from "lucide-react";

import { useToast } from "@/hooks/usetoast";
import { ConfirmationModal } from "@/components/modals/ConfirmModal";
import type { User } from "@/types/user";
import type { Row } from "@tanstack/react-table";
import { deleteUser } from "../api/user";

export const StudentActionCell = ({ row }: { row: Row<User> }) => {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
      toast("Student deleted successfully.", "success");
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
          href={`/admin/students/${row.original.id}`}
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
        title="Delete Student"
        description="Are you sure you want to delete this student?"
        confirmButtonVariant="danger"
      />
    </>
  );
};

export const studentColumns: ColumnDef<User>[] = [
  {
    accessorKey: "photoUrl",
    header: "Photo",
    cell: ({ row }) => {
      const photo = row.original.photoUrl;
      return photo ? (
        <Image
          src={photo}
          alt="Student Photo"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
          N/A
        </div>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: "Student Name",
    cell: ({ row }) => {
      const student = row.original;
      return `${student.firstName} ${student.middleName ?? ""} ${student.lastName}`.trim();
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "studentProfile.gender",
    header: "Gender",
    cell: ({ row }) => {
      const profile = row.original.studentProfile;
      return profile?.gender ?? "—";
    },
  },
  {
    accessorKey: "studentProfile.collegeName",
    header: "College Name",
    cell: ({ row }) => {
      const profile = row.original.studentProfile;
      return profile?.collegeName ?? "—";
    },
  },
  {
    accessorKey: "studentProfile.program",
    header: "Program ID",
    cell: ({ row }) => {
      const profile = row.original.studentProfile;
      return profile?.program.name ?? "—";
    },
  },
  {
    accessorKey: "studentProfile.semester",
    header: "Semester",
    cell: ({ row }) => {
      const profile = row.original.studentProfile;
      return profile?.semester.name ?? "—";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <StudentActionCell row={row} />,
  },
];
