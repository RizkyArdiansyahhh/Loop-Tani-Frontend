export interface FarmFormData {
  cropType: string;
  landSize: string;
  unit: "m²" | "Hektar";
  soilType: string;
  growthStage: string;
}

export interface NutrientResult {
  name: string;
  amount: number;
  unit: string;
  percentage: number;
}

export interface FertilizerResult {
  name: string;
  amount: number;
  unit: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  slug: string;
  image?: string;
  storeName?: string;
}

export interface RecommendationSource {
  dosage: string;
  soilAdjustment: string;
  fertilizerSelection: string;
}

export interface CalculationResult {
  nutrients: NutrientResult[];
  fertilizers: FertilizerResult[];
  estimatedCost: number;
  confidence: number;
  insights: string[];
  recommendationSource: RecommendationSource;
  stepByStep: string[];
  marketplaceProducts?: MarketplaceProduct[];
}

export const cropOptions = [
  { value: "rice", labelKey: "crops.rice" },
  { value: "corn", labelKey: "crops.corn" },
  { value: "chili", labelKey: "crops.chili" },
  { value: "soybean", labelKey: "crops.soybean" },
  { value: "palmOil", labelKey: "crops.palmOil" },
  { value: "tomato", labelKey: "crops.tomato" },
];

export const soilOptions = [
  { value: "clay", labelKey: "soils.clay" },
  { value: "loam", labelKey: "soils.loam" },
  { value: "sandy", labelKey: "soils.sandy" },
  { value: "peat", labelKey: "soils.peat" },
];

export const stageOptions = [
  { value: "seedling", labelKey: "stages.seedling" },
  { value: "vegetative", labelKey: "stages.vegetative" },
  { value: "flowering", labelKey: "stages.flowering" },
  { value: "harvest", labelKey: "stages.harvest" },
];

export const dummyResult: CalculationResult = {
  nutrients: [
    { name: "nitrogen", amount: 120, unit: "kg", percentage: 75 },
    { name: "phosphorus", amount: 60, unit: "kg", percentage: 50 },
    { name: "potassium", amount: 50, unit: "kg", percentage: 42 },
  ],
  fertilizers: [
    { name: "Urea", amount: 260, unit: "kg" },
    { name: "SP-36", amount: 130, unit: "kg" },
    { name: "KCl", amount: 85, unit: "kg" },
  ],
  estimatedCost: 1250000,
  confidence: 96,
  insights: ["tip1", "tip2", "tip3", "tip4"],
  recommendationSource: {
    dosage: "Peraturan Menteri Pertanian (Permentan) Nomor 13 Tahun 2022",
    soilAdjustment: "Heuristic: Tanah Berpasir (+20% N, K)",
    fertilizerSelection: "Loop Tani Optimization Engine"
  },
  stepByStep: [
    "Dosis dasar diambil dari rekomendasi resmi.",
    "Faktor tanah diterapkan berdasarkan heuristik.",
    "Pembagian fase pertumbuhan dihitung.",
    "Luas lahan dikonversi.",
    "Optimasi rekomendasi produk pupuk dijalankan."
  ],
};

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
