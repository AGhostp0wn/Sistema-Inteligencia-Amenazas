import api from "./axios";

export const createPdf = (data: any) =>
  api.post("/api/report/report/pdf", data, {
    responseType: "blob",
  });

export const createJson = (data: any) =>
  api.post("/api/report/report/json", data);