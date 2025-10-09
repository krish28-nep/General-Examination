import {
  SemesterCreateInput,
  SemesterUpdateInput,
} from "@/schema/semester.schema";
import axios from "../axios";

export const addSemester = async (dataToSend: SemesterCreateInput) => {
  const { data } = await axios.post("/semester", dataToSend);
  return data;
};

export const updateSemester = async (
  id: number,
  dataToSend: SemesterUpdateInput,
) => {
  const { data } = await axios.patch(`/semester/${id}`, dataToSend);
  return data;
};

export const fetchSemester = async (id: number) => {
  const { data } = await axios.get(`/semester/${id}`);
  return data;
};

export const fetchSemesters = async () => {
  const { data } = await axios.get("/semester");
  return data;
};

export const deleteSemester = async (id: number) => {
  const { data } = await axios.delete(`/semester/${id}`);
  return data;
};