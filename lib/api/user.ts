import { UserCreateInput, UserUpdateInput } from "@/schema/user.schema";
import axios from "../axios";

export const addUser = async (dataToSend: UserCreateInput) => {
  const { data } = await axios.post("/user", dataToSend);
  return data;
};

export const updateUser = async (
  id: number,
  dataToSend: UserUpdateInput,
) => {
  const { data } = await axios.patch(`/user/${id}`, dataToSend);
  return data;
};

export const fetchUser = async (id: number) => {
  const { data } = await axios.get(`/user/${id}`);
  return data;
};

