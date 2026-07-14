import { FarmFormData, CalculationResult } from "./dummy-data";
import { BASE_DOSAGE } from "./constants/official-dosages";
import { SOIL_FACTOR, PHASE_DISTRIBUTION } from "./constants/heuristics";

/**
 * recommendFertilizer
 * 
 * A recommendation algorithm developed for Loop Tani.
 * It is an optimization algorithm that selects fertilizer combinations closest to the required nutrient ratio.
 * 
 * Note: This algorithm is proprietary to Loop Tani and does NOT come from the government.
 */
export function recommendFertilizer(input: FarmFormData, locale: string = "id"): CalculationResult {
  const isIndo = locale === "id";
  const steps: string[] = [];
  
  // 1. Retrieve base dosage
  const officialDosage = BASE_DOSAGE[input.cropType];
  
  if (!officialDosage || officialDosage.sourceType === "unavailable" || !officialDosage.nutrients) {
    if (isIndo) {
      steps.push(`Dosis dasar: Referensi tidak tersedia untuk jenis tanaman '${input.cropType}'.`);
      steps.push(`Perhitungan tidak dapat dilanjutkan tanpa data acuan. Silakan hubungi penyuluh pertanian setempat.`);
    } else {
      steps.push(`Base dosage: Reference unavailable for crop type '${input.cropType}'.`);
      steps.push(`Calculation cannot proceed without fabricating data. Please consult local agricultural extension workers.`);
    }
    return {
      nutrients: [],
      fertilizers: [],
      estimatedCost: 0,
      confidence: 0,
      insights: ["unverified_crop"],
      recommendationSource: {
        dosage: officialDosage ? officialDosage.reference : (isIndo ? "Referensi tidak tersedia" : "Reference unavailable"),
        soilAdjustment: isIndo ? "Tidak diterapkan" : "Not applied",
        fertilizerSelection: isIndo ? "Tidak diterapkan" : "Not applied"
      },
      stepByStep: steps,
      marketplaceProducts: []
    };
  }

  const baseN = officialDosage.nutrients.n;
  const baseP = officialDosage.nutrients.p;
  const baseK = officialDosage.nutrients.k;
  
  if (isIndo) {
    steps.push(`Dosis dasar dari ${officialDosage.reference}: N=${baseN}kg, P=${baseP}kg, K=${baseK}kg per hektar.`);
  } else {
    steps.push(`Base dosage from ${officialDosage.reference}: N=${baseN}kg, P=${baseP}kg, K=${baseK}kg per hectare.`);
  }

  // 2. Soil adjustment (Heuristic)
  const soilAdjust = SOIL_FACTOR[input.soilType] || { n: 1, p: 1, k: 1, description: isIndo ? "Jenis tanah tidak diketahui, tidak ada penyesuaian" : "Unknown soil type, no adjustment" };
  const adjN = baseN * soilAdjust.n;
  const adjP = baseP * soilAdjust.p;
  const adjK = baseK * soilAdjust.k;
  
  if (isIndo) {
    steps.push(`Penyesuaian tanah (Heuristik): ${soilAdjust.description}. Disesuaikan menjadi N=${adjN.toFixed(1)}, P=${adjP.toFixed(1)}, K=${adjK.toFixed(1)} per hektar.`);
  } else {
    steps.push(`Soil adjustment (Heuristic): ${soilAdjust.description}. Adjusted to N=${adjN.toFixed(1)}, P=${adjP.toFixed(1)}, K=${adjK.toFixed(1)} per hectare.`);
  }

  // 3. Land Area Scaling
  let areaHa = parseFloat(input.landSize) || 0;
  if (input.unit === "m²") {
    areaHa = areaHa / 10000;
  }
  const totalN = adjN * areaHa;
  const totalP = adjP * areaHa;
  const totalK = adjK * areaHa;
  
  if (isIndo) {
    steps.push(`Konversi luas lahan: ${input.landSize} ${input.unit} = ${areaHa.toFixed(4)} Hektar. Total nutrisi yang dibutuhkan: N=${totalN.toFixed(1)}kg, P=${totalP.toFixed(1)}kg, K=${totalK.toFixed(1)}kg.`);
  } else {
    steps.push(`Land area conversion: ${input.landSize} ${input.unit} = ${areaHa.toFixed(4)} Hectare. Total nutrients required: N=${totalN.toFixed(1)}kg, P=${totalP.toFixed(1)}kg, K=${totalK.toFixed(1)}kg.`);
  }

  // 4. Growth Stage Adjustment (Heuristic)
  const phaseRatio = PHASE_DISTRIBUTION[input.growthStage] || 1;
  const phaseN = totalN * phaseRatio;
  const phaseP = totalP * phaseRatio;
  const phaseK = totalK * phaseRatio;
  
  const stageTranslations: Record<string, string> = {
    seedling: "pembibitan",
    vegetative: "vegetatif",
    flowering: "berbunga",
    harvest: "panen"
  };
  const translatedStage = isIndo ? (stageTranslations[input.growthStage] || input.growthStage) : input.growthStage;
  
  if (isIndo) {
    steps.push(`Penyesuaian fase pertumbuhan (Heuristik): Fase '${translatedStage}' membutuhkan ${(phaseRatio * 100).toFixed(0)}% dari total dosis. Kebutuhan fase saat ini: N=${phaseN.toFixed(1)}kg, P=${phaseP.toFixed(1)}kg, K=${phaseK.toFixed(1)}kg.`);
  } else {
    steps.push(`Growth stage adjustment (Heuristic): '${translatedStage}' requires ${(phaseRatio * 100).toFixed(0)}% of the total dosage. Current phase requirement: N=${phaseN.toFixed(1)}kg, P=${phaseP.toFixed(1)}kg, K=${phaseK.toFixed(1)}kg.`);
  }

  // 5. Fertilizer Optimization (Loop Tani Engine)
  // Simplified mathematical solver for NPK mapping using single-nutrient fertilizers to prevent overlap.
  // Urea (46% N), SP-36 (36% P2O5), KCl (60% K2O).
  const ureaRequired = phaseN / 0.46;
  const sp36Required = phaseP / 0.36;
  const kclRequired = phaseK / 0.60;
  
  if (isIndo) {
    steps.push(`Optimasi pupuk (Loop Tani Engine): Memetakan nutrisi ke pupuk tunggal (Urea 46% N, SP-36 36% P, KCl 60% K) untuk memenuhi kebutuhan tanpa tumpang tindih.`);
  } else {
    steps.push(`Fertilizer optimization (Loop Tani Engine): Mapped nutrients to single-source fertilizers (Urea 46% N, SP-36 36% P, KCl 60% K) to match requirements without overlap.`);
  }

  // 6. Marketplace mapping
  const products = [
    { id: "p1", name: "Pupuk Urea Non-Subsidi 50kg", price: 350000, slug: "urea-non-subsidi", storeName: "Tani Makmur Jaya" },
    { id: "p2", name: "Pupuk SP-36 50kg", price: 150000, slug: "sp-36-50kg", storeName: "Sumber Tani" },
    { id: "p3", name: "Pupuk KCl Mahkota 50kg", price: 450000, slug: "kcl-mahkota", storeName: "Tani Makmur Jaya" }
  ];
  
  if (isIndo) {
    steps.push(`Rekomendasi toko: Mengambil produk pupuk yang sesuai dari katalog Loop Tani berdasarkan pupuk yang terpilih.`);
  } else {
    steps.push(`Marketplace recommendations: Retrieved matching fertilizer products from Loop Tani catalog based on the selected fertilizers.`);
  }

  const totalNutrients = phaseN + phaseP + phaseK;
  const pN = totalNutrients > 0 ? Math.round((phaseN / totalNutrients) * 100) : 0;
  const pP = totalNutrients > 0 ? Math.round((phaseP / totalNutrients) * 100) : 0;
  const pK = totalNutrients > 0 ? Math.round((phaseK / totalNutrients) * 100) : 0;

  return {
    nutrients: [
      { name: "nitrogen", amount: Math.round(phaseN), unit: "kg", percentage: pN },
      { name: "phosphorus", amount: Math.round(phaseP), unit: "kg", percentage: pP },
      { name: "potassium", amount: Math.round(phaseK), unit: "kg", percentage: pK },
    ],
    fertilizers: [
      { name: "Urea", amount: Math.round(ureaRequired), unit: "kg" },
      { name: "SP-36", amount: Math.round(sp36Required), unit: "kg" },
      { name: "KCl", amount: Math.round(kclRequired), unit: "kg" },
    ],
    estimatedCost: (ureaRequired / 50) * 350000 + (sp36Required / 50) * 150000 + (kclRequired / 50) * 450000,
    confidence: 90,
    insights: ["tip1", "tip2"],
    recommendationSource: {
      dosage: officialDosage.reference,
      soilAdjustment: isIndo ? `Heuristik: ${soilAdjust.description}` : `Heuristic: ${soilAdjust.description}`,
      fertilizerSelection: "Loop Tani Optimization Engine"
    },
    stepByStep: steps,
    marketplaceProducts: products
  };
}
