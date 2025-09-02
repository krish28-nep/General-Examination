import { UserCreateInput, UserUpdateInput } from "@/schema/user.schema";
import axios from "../axios";

export const addUser = async (dataToSend: UserCreateInput) => {
  const { data } = await axios.post("/users", dataToSend);
  return data;
};

export const updateStudentProfile = async (
  id: number,
  dataToSend: UserUpdateInput,
) => {
  const { data } = await axios.patch(`/users/${id}`, dataToSend);
  return data;
};

export const fetchUser = async (id: number) => {
  const { data } = await axios.get(`/users/${id}`);
  return data;
};
