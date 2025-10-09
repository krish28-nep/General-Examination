import axios from "../axios";

export const deleteApplication = async (id: number) => {
    const { data } = await axios.delete(`/application/${id}`);
    return data
}

export const fetchApplications = async () => {
    const { data } = await axios.get("/application");
    return data
}