import axios from "../axios";

export const fetchTotalUsers = async () => {
    const { data } = await axios.get("/Dashboard/total-users");
    return data.totalUsers;
};

export const fetchTotalCourses = async () => {
    const { data } = await axios.get("/Dashboard/total-courses");
    return data.totalCourses;
};

export const fetchTotalPrograms = async () => {
    const { data } = await axios.get("/Dashboard/total-programs");
    return data.totalPrograms;
};

export const fetchStudentsByProgram = async () => {
    const { data } = await axios.get("/Dashboard/students-by-program");
    return data;
};

export const fetchApplicationByStatus = async () => {
    const { data } = await axios.get("/Dashboard/application-status");
    return data;
};