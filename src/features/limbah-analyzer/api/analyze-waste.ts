import { axiosInstance } from "@/lib/axios";
import type { WasteAnalysisApiResponse } from "../types";

export async function analyzeWaste(file: File): Promise<WasteAnalysisApiResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosInstance.post<WasteAnalysisApiResponse>(
    "/waste-analyzer/analyze",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}
