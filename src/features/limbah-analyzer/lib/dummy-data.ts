export interface AnalysisResult {
  wasteType: string;
  confidence: number;
  condition: string;
  estimatedQuantity: string;
  estimatedValue: number;
  recommendations: string[];
}

export const wasteTypes = [
  "Rice Straw",
  "Rice Husk",
  "Corn Stalk",
  "Palm Frond",
  "Coconut Husk",
  "Pineapple Leaves",
  "Sugarcane Bagasse",
  "Others",
];

const dummyResults: AnalysisResult[] = [
  {
    wasteType: "Rice Straw",
    confidence: 95,
    condition: "Good",
    estimatedQuantity: "Medium",
    estimatedValue: 250000,
    recommendations: ["Organic Compost", "Livestock Feed", "Biomass Fuel"],
  },
  {
    wasteType: "Rice Husk",
    confidence: 92,
    condition: "Dry",
    estimatedQuantity: "Medium",
    estimatedValue: 180000,
    recommendations: ["Biomass Fuel", "Silica Extraction", "Composting"],
  },
  {
    wasteType: "Corn Stalk",
    confidence: 88,
    condition: "Good",
    estimatedQuantity: "High",
    estimatedValue: 320000,
    recommendations: ["Livestock Feed", "Organic Compost", "Biogas"],
  },
  {
    wasteType: "Palm Frond",
    confidence: 90,
    condition: "Fresh",
    estimatedQuantity: "High",
    estimatedValue: 150000,
    recommendations: ["Mulch", "Organic Compost", "Biomass Fuel"],
  },
  {
    wasteType: "Coconut Husk",
    confidence: 97,
    condition: "Dry",
    estimatedQuantity: "Medium",
    estimatedValue: 200000,
    recommendations: ["Coco Peat", "Rope Making", "Organic Compost"],
  },
];

export function getRandomAnalysisResult(): AnalysisResult {
  const randomIndex = Math.floor(Math.random() * dummyResults.length);
  return { ...dummyResults[randomIndex] };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
