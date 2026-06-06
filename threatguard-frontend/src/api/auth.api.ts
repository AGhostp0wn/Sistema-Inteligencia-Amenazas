import api from "./axios";

export const registerUser =
(data:any)=>
  api.post(
    "/api/auth/register",
    data
  );

export const loginUser =
(data:any)=>
  api.post(
    "/api/auth/login",
    data
  );

export const getProfile = ()=>
  api.get(
    "/api/auth/profile"
  );