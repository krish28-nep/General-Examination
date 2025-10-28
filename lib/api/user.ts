import { UserCreateInput, UserUpdateInput } from "@/schema/user.schema";
import axios from "../axios";
import { Role } from "@/types/user";

export const addUser = async (dataToSend: UserCreateInput) => {
  const { data } = await axios.post("/user", dataToSend);
  return data;
};

export const updateUser = async (id: number, dataToSend: UserUpdateInput) => {
  const { data } = await axios.patch(`/user/${id}`, dataToSend);
  return data;
};

export const fetchUsers = async () => {
  const { data } = await axios.get("/user");
  return data;
};

export const fetchUser = async (id: number) => {
  const { data } = await axios.get(`/user/${id}`);
  console.log(data)
  return data;
};

export const deleteUser = async (id: number) => {
  const { data } = await axios.delete(`/user/${id}`);
  return data;
};
type User = {
  id: number
  firstName: string
  middleName: string | null
  lastName: string
  role: Role
}

export const fetchMe = async (): Promise<User> => {
  const { data } = await axios.get('/auth/me')
  return data 
}