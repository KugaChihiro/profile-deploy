import axios from 'axios';

export const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL,
  baseURL: "https://ca-profile-01.graydune-73910fd2.japaneast.azurecontainerapps.io"
});


export default api;
