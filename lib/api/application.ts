import { ApplicationCreateInput } from "@/schema/application.schema";
import axios from "../axios";

export const deleteApplication = async (id: number) => {
    const { data } = await axios.delete(`/application/${id}`);
    return data
}

export const fetchApplications = async () => {
    const { data } = await axios.get("/application");
    return data
}

export const addApplication = async (dataToSend: ApplicationCreateInput) => {
    const { data } = await axios.post("/application", dataToSend);
    return data
}