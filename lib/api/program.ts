import {
  ProgramCreateInput,
  ProgramUpdateInput,
} from "@/schema/program.schema";
import axios from "../axios";

export const addProgram = async (dataToSend: ProgramCreateInput) => {
  const { data } = await axios.post("/academicProgram", dataToSend);
  return data;
};

export const updateProgram = async (
  id: number,
  dataToSend: ProgramUpdateInput,
) => {
  const { data } = await axios.patch(`/academicProgram/${id}`, dataToSend);
  return data;
};

export const fetchProgram = async (id: number) => {
  const { data } = await axios.get(`/academicProgram/${id}`);
  return data;
};

export const fetchPrograms = async () => {
  const { data } = await axios.get("/academicProgram");
  console.log(data)
  return data;
};
