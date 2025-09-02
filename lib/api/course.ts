import { CourseCreateInput, CourseUpdateInput } from "@/schema/semester.schema";
import axios from "../axios";

export const addCourse = async (courseData: CourseCreateInput) => {
  const { data } = await axios.post(`/course`, courseData);
  return data;
};

export const updateCourse = async ({
  courseId,
  courseData,
}: {
  courseId: number;
  courseData: CourseUpdateInput;
}) => {
  const { data } = await axios.patch(`/course/${courseId}`, courseData);
  return data;
};

export const deleteCourse = async (courseId: number) => {
  const { data } = await axios.delete(`/course/${courseId}`);
  return data;
};
