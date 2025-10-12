import axiosInstance from "../axios";
import { KhaltiExamPaymentPayload } from "../helper/khalti";

export const initiateKhalti = async (dataToSend: KhaltiExamPaymentPayload) => {
  const { data } = await axiosInstance.post('/khalti/initiate', dataToSend);
  return data;
};