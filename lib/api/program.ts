import { ProgramCreateInput, ProgramUpdateInput } from "@/schema/program.schema";
import axios from "../axios";

export const addProgram = async (dataToSend: ProgramCreateInput) => {
    const { data } = await axios.post('/programs', dataToSend);
    return data;
}

export const updateProgram = async (id: number, dataToSend: ProgramUpdateInput) => {
    const { data } = await axios.patch(`/programs/${id}`, dataToSend);
    return data;
}

export const fetchProgram = async (id: number) => {
    const { data } = await axios.get(`/programs/${id}`);
    return data;
}
