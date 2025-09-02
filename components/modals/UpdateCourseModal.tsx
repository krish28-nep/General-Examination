import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/general/Button";
import { Course, CourseType } from "@/types/semester";
import {
  CourseUpdateInput,
  courseUpdateSchema,
} from "@/schema/semester.schema";
import { useToast } from "@/hooks/usetoast";
import { updateCourse } from "@/lib/api/course";
import { Modal } from "./Modal";
import { ReusableDropdown } from "../general/ResuableDropDown";
import { Save } from "lucide-react";

type UpdateCourseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
};

const UpdateCourseModal: React.FC<UpdateCourseModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
  } = useForm<CourseUpdateInput>({ resolver: zodResolver(courseUpdateSchema) });

  useEffect(() => {
    reset(course);
  }, [course, reset]);

  const queryClient = useQueryClient();
  const toast = useToast();

  const updateCourseMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["semester", Number(course.semesterId)],
      });
      toast("Successfully updated Course.", "success");
      onClose();
    },
    onError: () => toast("Failed to update Course.", "error"),
  });

  const onSubmit = async (data: CourseUpdateInput) => {
    updateCourseMutation.mutate({ courseId: course?.id, courseData: data });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        className="flex min-w-xs flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-base font-semibold">Update Course</h2>
        <div className="grid grid-cols-2 items-center gap-4">
          <div className="flex flex-col gap-4">
            <div className="label-input-group group">
              <label className="label-text">Name</label>
              <input
                {...register(`name`)}
                className="input-field"
                placeholder="Course name"
              />
              {errors.name && (
                <p className="error-text">{errors.name.message}</p>
              )}
            </div>
            <div className="label-input-group group">
              <label className="label-text">Code</label>
              <input
                {...register(`code`)}
                className="input-field"
                placeholder="Course code"
              />
              {errors.code && (
                <p className="error-text">{errors.code?.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="label-input-group group">
              <label className="label-text">Type</label>
              <ReusableDropdown
                items={Object.values(CourseType)}
                placeholder="Select Type"
                value={getValues("type")}
                onSelect={(val) => setValue(`type`, val as CourseType)}
              />
              {errors.type && (
                <p className="error-text">{errors.type?.message}</p>
              )}
            </div>

            <div className="label-input-group group">
              <label className="label-text">Credit</label>
              <input
                type="number"
                {...register(`credit`, { valueAsNumber: true })}
                className="input-field"
                placeholder="Credit"
              />
              {errors.credit && (
                <p className="error-text">{errors.credit?.message}</p>
              )}
            </div>
          </div>
        </div>
        <Button
          type="submit"
          text="Save"
          icon={<Save size={16} />}
          isLoading={isSubmitting}
          disabled={isSubmitting}
          loadingText="Saving"
          className="self-end"
        />
      </form>
    </Modal>
  );
};

export { UpdateCourseModal };
