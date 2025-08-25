import { SemesterCreateInput, SemesterUpdateInput } from "@/schema/semester.schema";
import axios from "../axios";

export const addSemester = async (dataToSend: SemesterCreateInput) => {
    const { data } = await axios.post("/semesters", dataToSend);
    return data;
};

export const updateSemester = async (id: number, dataToSend: SemesterUpdateInput) => {
    const { data } = await axios.patch(`/semesters/${id}`, dataToSend);
    return data;
};

export const fetchSemester = async (id: number) => {
    const { data } = await axios.get(`/semesters/${id}`);
    return data;
};

export const fetchSemesters = async () => {
    const { data } = await axios.get("/semesters");
    return data;
};
