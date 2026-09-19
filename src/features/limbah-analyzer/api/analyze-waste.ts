import { axiosInstance } from "@/lib/axios";
import type { WasteAnalysisApiResponse } from "../types";
import { compressImageToWebP } from "../lib/compress-image";

export async function analyzeWaste(rawFile: File, locale: string = "id"): Promise<WasteAnalysisApiResponse> {
  // Compress & convert to WebP for fast upload and fast AI vision processing
  const file = await compressImageToWebP(rawFile);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("locale", locale);

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
