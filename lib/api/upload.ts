import axios, { baseURL } from "../axios";

export const uploadImage = async (image: File) => {
  const formData = new FormData();
  formData.append("file", image);

  const { data } = await axios.post(`${baseURL}/upload/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  return data.url;
};
