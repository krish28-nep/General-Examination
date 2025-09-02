import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/general/Button";
import { Course, CourseType } from "@/types/semester";
import {
  CourseCreateInput,
  courseSchema,
  CourseUpdateInput,
  courseUpdateSchema,
} from "@/schema/semester.schema";
import { useToast } from "@/hooks/usetoast";
import { addCourse, updateCourse } from "@/lib/api/course";
import { Modal } from "./Modal";
import { ReusableDropdown } from "../general/ResuableDropDown";
import { Save } from "lucide-react";

type CreateCourseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  semesterId: number;
};

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  semesterId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
  } = useForm<CourseCreateInput>({ resolver: zodResolver(courseSchema) });

  const queryClient = useQueryClient();
  const toast = useToast();

  const createCourseMutation = useMutation({
    mutationFn: addCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["semester", Number(semesterId)],
      });
      toast("Successfully created Course.", "success");
      onClose();
    },
    onError: () => toast("Failed to create Course.", "error"),
  });

  useEffect(() => {
    setValue("semesterId", Number(semesterId));
  }, [semesterId, setValue]);

  const onSubmit = async (data: CourseCreateInput) => {
    console.log(errors);
    createCourseMutation.mutate({
      ...data,
      semesterId: Number(semesterId),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        className="flex min-w-xs flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-base font-semibold">Create Course</h2>
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

export { CreateCourseModal };
