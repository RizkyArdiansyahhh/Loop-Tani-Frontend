export interface WasteAnalysisResult {
  isAgriculturalWaste: boolean;
  isAnalyzable: boolean;

  wasteIdentification: {
    indonesianName: string;
    englishName: string;
    category: string;
    confidenceScore: number;
  };

  visualCondition: {
    color: string;
    state: string;
    environment: string;
  };

  processingPotential: string[];

  economicEstimation: {
    potentialValue: string;
    marketOpportunity: string;
    notes: string;
  };
}

export interface WasteAnalysisApiResponse {
  success: boolean;
  data: WasteAnalysisResult;
}
