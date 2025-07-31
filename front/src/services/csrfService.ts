import {axiosInstance} from "../utils/axios";

export const getCsrfToken = async () => {
    const { data } = await axiosInstance.get('/api/csrf-token');
    return data.csrfToken; 
  };