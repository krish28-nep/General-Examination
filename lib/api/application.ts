import { ApplicationCreateInput } from "@/schema/application.schema";
import axios from "../axios";
import { ApplicationStatus } from "@/types/application";

export const deleteApplication = async (id: number) => {
  const { data } = await axios.delete(`/application/${id}`);
  return data;
};

export const fetchApplication = async (id: number) => {
  const { data } = await axios.get(`/application/${id}`);
  return data;
};

export const fetchApplications = async () => {
  const { data } = await axios.get("/application");
  return data;
};

export const addApplication = async (dataToSend: ApplicationCreateInput) => {
  const { data } = await axios.post("/application", dataToSend);
  return data;
};

export const fetchApplicationsByUser = async (userId: number) => {
  const { data } = await axios.get(`/application/user/${userId}`);
  return data;
};

export const updateApplicationStatus = async ({ id, status }: { id: number; status: ApplicationStatus }) => {
  const { data } = await axios.patch(`/application/${id}`, { status });
  return data;
}