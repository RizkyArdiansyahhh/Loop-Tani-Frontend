import type { WasteAnalysisResult } from "../../../../shared/types/waste-analysis";

export type { WasteAnalysisResult };

export interface WasteAnalysisApiResponse {
  success: boolean;
  data: WasteAnalysisResult;
}
