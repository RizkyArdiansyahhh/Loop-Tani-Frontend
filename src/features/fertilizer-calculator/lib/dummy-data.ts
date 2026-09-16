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
  inputData?: FarmFormData;
}

export interface CropOption {
  value: string;
  labelKey: string;
  name: string;
  category: string;
}

export const cropOptions: CropOption[] = [
  { value: "rice", labelKey: "crops.rice", name: "Padi Sawah", category: "Pangan" },
  { value: "corn", labelKey: "crops.corn", name: "Jagung", category: "Palawija" },
  { value: "chili", labelKey: "crops.chili", name: "Cabai", category: "Hortikultura" },
  { value: "palmOil", labelKey: "crops.palmOil", name: "Kelapa Sawit", category: "Perkebunan" },
  { value: "soybean", labelKey: "crops.soybean", name: "Kedelai", category: "Palawija" },
  { value: "tomato", labelKey: "crops.tomato", name: "Tomat", category: "Hortikultura" },
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

export interface FarmPreset {
  id: string;
  name: string;
  cropType: string;
  cropLabel: string;
  landSize: string;
  unit: "m²" | "Hektar";
  soilType: string;
  soilLabel: string;
  growthStage: string;
  stageLabel: string;
  badge: string;
}

export const PRESET_SCENARIOS: FarmPreset[] = [
  {
    id: "padi-sawah",
    name: "Padi Sawah 1 Ha",
    cropType: "rice",
    cropLabel: "Padi Sawah",
    landSize: "1",
    unit: "Hektar",
    soilType: "clay",
    soilLabel: "Tanah Liat",
    growthStage: "vegetative",
    stageLabel: "Vegetatif",
    badge: "Pangan",
  },
  {
    id: "jagung-hibrida",
    name: "Jagung Pipil 0.5 Ha",
    cropType: "corn",
    cropLabel: "Jagung",
    landSize: "5000",
    unit: "m²",
    soilType: "loam",
    soilLabel: "Tanah Lempung",
    growthStage: "flowering",
    stageLabel: "Berbunga",
    badge: "Palawija",
  },
  {
    id: "cabai-merah",
    name: "Cabai Rawit 2.000 m²",
    cropType: "chili",
    cropLabel: "Cabai",
    landSize: "2000",
    unit: "m²",
    soilType: "sandy",
    soilLabel: "Tanah Pasir",
    growthStage: "flowering",
    stageLabel: "Berbunga",
    badge: "Hortikultura",
  },
  {
    id: "kelapa-sawit",
    name: "Kelapa Sawit 2 Ha",
    cropType: "palmOil",
    cropLabel: "Kelapa Sawit",
    landSize: "2",
    unit: "Hektar",
    soilType: "peat",
    soilLabel: "Tanah Gambut",
    growthStage: "vegetative",
    stageLabel: "Vegetatif",
    badge: "Perkebunan",
  },
];

export interface SoilInfo {
  value: string;
  labelKey: string;
  title: string;
  shortDesc: string;
  agronomyTip: string;
}

export const soilDetails: Record<string, SoilInfo> = {
  clay: {
    value: "clay",
    labelKey: "soils.clay",
    title: "Tanah Liat",
    shortDesc: "Daya ikat hara & air tinggi",
    agronomyTip: "Daya serap hara sangat baik. Pupuk lebih tahan pencucian, namun perhatikan drainase agar akar tidak tergenang.",
  },
  loam: {
    value: "loam",
    labelKey: "soils.loam",
    title: "Tanah Lempung",
    shortDesc: "Subur & seimbang untuk perakaran",
    agronomyTip: "Kondisi tanah ideal dengan aerasi dan retensi air seimbang. Pupuk terserap secara optimal oleh tanaman.",
  },
  sandy: {
    value: "sandy",
    labelKey: "soils.sandy",
    title: "Tanah Pasir",
    shortDesc: "Porous, hara mudah tercuci",
    agronomyTip: "Drainase sangat cepat sehingga pupuk mudah larut. Sangat disarankan membagi aplikasi pupuk menjadi 3-4 kali aplikasi.",
  },
  peat: {
    value: "peat",
    labelKey: "soils.peat",
    title: "Tanah Gambut",
    shortDesc: "Organik tinggi, masam, defisiensi K",
    agronomyTip: "pH cenderung masam. Sebaiknya imbangi dengan pemberian kapur dolomit dan utamakan pupuk Kalium (KCl).",
  },
};

export interface StageInfo {
  value: string;
  labelKey: string;
  title: string;
  timeline: string;
  nutrientFocus: string;
  focusNutrientName: "Nitrogen" | "Fosfor" | "Kalium";
}

export const stageDetails: Record<string, StageInfo> = {
  seedling: {
    value: "seedling",
    labelKey: "stages.seedling",
    title: "Pembibitan",
    timeline: "0 - 14 HST",
    nutrientFocus: "Fokus Fosfor (P) untuk merangsang perakaran kuat dan adaptasi pindah tanam.",
    focusNutrientName: "Fosfor",
  },
  vegetative: {
    value: "vegetative",
    labelKey: "stages.vegetative",
    title: "Vegetatif Aktif",
    timeline: "15 - 40 HST",
    nutrientFocus: "Fokus Nitrogen (N) tinggi untuk pembentukan anakan, batang kokoh, & daun hijau segar.",
    focusNutrientName: "Nitrogen",
  },
  flowering: {
    value: "flowering",
    labelKey: "stages.flowering",
    title: "Pembungaan",
    timeline: "40 - 65 HST",
    nutrientFocus: "Fokus Fosfor (P) & Kalium (K) untuk merangsang bunga serempak dan mencegah kerontokan.",
    focusNutrientName: "Fosfor",
  },
  harvest: {
    value: "harvest",
    labelKey: "stages.harvest",
    title: "Pematangan Buah",
    timeline: "65+ HST",
    nutrientFocus: "Fokus Kalium (K) untuk translokasi karbohidrat, pengisian bulir padi, & bobot buah maksimal.",
    focusNutrientName: "Kalium",
  },
};

export const cropNames: Record<string, string> = {
  rice: "Padi Sawah",
  corn: "Jagung",
  chili: "Cabai",
  soybean: "Kedelai",
  palmOil: "Kelapa Sawit",
  tomato: "Tomat",
};

export function getSackEstimate(amountKg: number, sackSizeKg: number = 50): string {
  if (amountKg <= 0) return "0 kg";
  const sacks = amountKg / sackSizeKg;
  if (sacks < 0.3) return `${amountKg} kg (eceran)`;
  if (sacks < 1) return `~${amountKg} kg (±1 sak kecil)`;
  const rounded = Math.ceil(sacks);
  return `~${rounded} sak (@${sackSizeKg}kg)`;
}

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
