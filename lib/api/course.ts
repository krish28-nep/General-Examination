import { CourseCreateInput, CourseUpdateInput } from "@/schema/semester.schema";
import axios from "../axios";

export const addCourse = async (semesterId: number, course: CourseCreateInput) => {
    const { data } = await axios.post(`/semesters/${semesterId}/courses`, course);
    return data;
};

export const updateCourse = async (courseId: number, course: CourseUpdateInput) => {
    const { data } = await axios.patch(`/courses/${courseId}`, course);
    return data;
};

export const deleteCourse = async (courseId: number) => {
    const { data } = await axios.delete(`/courses/${courseId}`);
    return data;
};