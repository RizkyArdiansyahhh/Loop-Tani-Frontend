import { useMutation } from "@tanstack/react-query";
import { analyzeWaste } from "../api/analyze-waste";

export function useAnalyzeWaste() {
  return useMutation({
    mutationFn: (variables: { file: File; locale?: string } | File) => {
      if (variables instanceof File) {
        return analyzeWaste(variables);
      }
      return analyzeWaste(variables.file, variables.locale);
    },
  });
}
