"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/usetoast";
import { Button } from "@/components/general/Button";
import { ReusableDropdown } from "@/components/general/ResuableDropDown";
import { SquarePen, Trash } from "lucide-react";
import { SemesterName, Semester, Course } from "@/types/semester";
import { fetchSemester, updateSemester } from "@/lib/api/semester";
import { deleteCourse } from "@/lib/api/course";
import {
  SemesterUpdateInput,
  semesterUpdateSchema,
} from "@/schema/semester.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchPrograms } from "@/lib/api/program";
import { Spinner } from "@/components/Spinner";
import { Program } from "@/types/program";
import { ConfirmationModal } from "@/components/modals/ConfirmModal";
import { CreateCourseModal } from "@/components/modals/CreateCourseModal";
import { UpdateCourseModal } from "@/components/modals/UpdateCourseModal";

const UpdateSemesterPage = () => {
  const { id: semesterId } = useParams();
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [createCourseModalOpen, setCreateCourseModalOpen] = useState(false);

  const { data: semester, isLoading: semesterLoading } = useQuery<Semester>({
    queryKey: ["semesters", Number(semesterId)],
    queryFn: () => fetchSemester(Number(semesterId)),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<SemesterUpdateInput>({
    resolver: zodResolver(semesterUpdateSchema),
    defaultValues: {
      name: SemesterName.First,
      fee: 0,
      programId: 0,
      courses: [],
    },
  });

  const {
    data: programsData,
    isLoading: programsDataLoading,
    isError: programsDataError,
  } = useQuery<Program[]>({
    queryKey: ["programs"],
    queryFn: fetchPrograms,
  });

  useEffect(() => {
    if (semester) {
      reset(semester);
      setValue("name", semester.name as SemesterName);
      if (programsData) {
        setValue("programId", semester.programId);
      }
    }
  }, [semester, reset, setValue, programsData]);

  const detailsMutation = useMutation({
    mutationFn: (data: SemesterUpdateInput) =>
      updateSemester(Number(semesterId), data),
    onSuccess: () => {
      toast("Semester details updated", "success");
      queryClient.invalidateQueries({
        queryKey: ["semesters", Number(semesterId)],
      });
      queryClient.invalidateQueries({
        queryKey: ["semesters"],
      });
      router.push("/admin/semesters")
    },
    onError: () => toast("Failed to update semester", "error"),
  });

  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast("Course deleted", "success");
      queryClient.invalidateQueries({
        queryKey: ["semesters", Number(semesterId)],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses"], exact: false
      });
    },
  });

  const handleDeleteConfirm = () => {
    if (courseToDelete) {
      deleteCourseMutation.mutate(courseToDelete);
      setCourseToDelete(null);
    }
  };

  const handleDeleteClick = (id: number) => {
    if (id) {
      setCourseToDelete(id);
    }
  };

  const onSubmitDetails = (data: SemesterUpdateInput) => {
    detailsMutation.mutate(data);
  };

  if (programsDataLoading && semesterLoading) return <Spinner />;

  if (programsDataError) return <p>Failed to load programs</p>;

  if (!programsData || programsData.length === 0) {
    return <p>No Program Found</p>;
  }

  if (!semester) {
    return <p>No Semester Found</p>;
  }

  return (
    <div className="w-[1280px] mx-auto space-y-6">
      <h1 className="heading-text">Update Semester</h1>

      <form onSubmit={handleSubmit(onSubmitDetails)} className="card space-y-4">
        <h2 className="large-text">Semester Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="label-input-group group">
            <label className="label-text">Semester Name *</label>
            <ReusableDropdown
              items={Object.values(SemesterName)}
              value={getValues("name")}
              placeholder="Select Semester"
              onSelect={(val) => setValue("name", val as SemesterName)}
            />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>

          <div className="label-input-group group">
            <label className="label-text">Fee *</label>
            <input
              type="number"
              {...register("fee", { valueAsNumber: true })}
              className="input-field"
              placeholder="Enter fee"
            />
            {errors.fee && <p className="error-text">{errors.fee.message}</p>}
          </div>

          <div className="label-input-group group">
            <label className="label-text">Program *</label>
            <ReusableDropdown
              items={programsData.map((program) => program.name)}
              value={
                programsData.find((p) => p.id === getValues("programId"))
                  ?.name || ""
              }
              placeholder="Select Program"
              onSelect={(selectedName) => {
                const selected = programsData.find(
                  (p) => p.name === selectedName,
                );
                if (selected) setValue("programId", selected.id);
              }}
            />
            {errors.programId && (
              <p className="error-text">{errors.programId.message}</p>
            )}
          </div>
        </div>
        <Button
          text="Save Details"
          type="submit"
          disabled={detailsMutation.isPending}
        />
      </form>

      <div className="card space-y-4">
        <div className="flex justify-between">
          <h2 className="large-text">Courses</h2>
          <Button
            onClick={() => setCreateCourseModalOpen(true)}
            text="Add Course"
          />
        </div>

        <div className="border-neutral w-full overflow-x-auto rounded-md border-x border-t">
          <table className="min-w-full border-collapse">
            <thead className="text-left">
              <tr>
                <th className="border-neutral border-b px-2 py-1">S.N </th>
                <th className="border-neutral border-b px-2 py-1">Name</th>
                <th className="border-neutral border-b px-2 py-1">
                  Course code
                </th>
                <th className="border-neutral border-b px-2 py-1">Type</th>
                <th className="border-neutral border-b px-2 py-1">Credit</th>
                <th className="border-neutral border-b px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {semester.courses &&
                semester.courses.map((course, index) => (
                  <tr key={`course - ${index}`}>
                    <td className="border-neutral border-b px-2 py-1">
                      {index + 1}
                    </td>
                    <td className="border-neutral border-b px-2 py-1">
                      {course.name}
                    </td>
                    <td className="border-neutral border-b px-2 py-1">
                      {course.code}
                    </td>
                    <td className="border-neutral border-b px-2 py-1">
                      {course.type}
                    </td>
                    <td className="border-neutral border-b px-2 py-1">
                      {course.credit}
                    </td>
                    <td className="border-neutral flex items-center gap-4 border-b px-2 py-1">
                      <button
                        type="button"
                        className="hover:bg-warning/10 hover:text-warning cursor-pointer rounded-full p-2 transition-colors duration-300"
                        onClick={() => setCourseToEdit(course)}
                      >
                        <SquarePen size={16} />
                      </button>
                      <button
                        type="button"
                        className="hover:bg-danger/10 hover:text-danger cursor-pointer rounded-full p-2 transition-colors duration-300"
                        onClick={() => handleDeleteClick(course.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreateCourseModal
        isOpen={createCourseModalOpen}
        onClose={() => setCreateCourseModalOpen(false)}
        semesterId={Number(semesterId)}
      />
      <UpdateCourseModal
        isOpen={!!courseToEdit}
        onClose={() => setCourseToEdit(null)}
        course={courseToEdit!}
      />

      <ConfirmationModal
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        title="Delete Course?"
        description="Are you sure you wan't to delete Course? This action can't be undone."
        onConfirm={handleDeleteConfirm}
        confirmButtonVariant="danger"
      />
    </div>
  );
};

export default UpdateSemesterPage;
