import { useMutation } from "@tanstack/react-query";
import { analyzeWaste } from "../api/analyze-waste";

export function useAnalyzeWaste() {
  return useMutation({
    mutationFn: analyzeWaste,
  });
}
