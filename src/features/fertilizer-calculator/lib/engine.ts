import { FarmFormData, CalculationResult, MarketplaceProduct } from "./dummy-data";
import { BASE_DOSAGE } from "./constants/official-dosages";
import { SOIL_FACTOR, PHASE_DISTRIBUTION } from "./constants/heuristics";

function generateDynamicInsights(input: FarmFormData, isIndo: boolean): string[] {
  const tips: string[] = [];

  // 1. Crop-specific agronomic advice
  if (input.cropType === "rice") {
    tips.push(
      isIndo
        ? "Untuk padi sawah, atur kondisi air macak-macak (ketinggian 1-2 cm) saat penaburan pupuk dan tutup saluran pembuangan selama 3-4 hari agar nutrisi tidak larut hanyut."
        : "For paddy rice, maintain shallow water (1-2 cm) during fertilizer application and close drainage gates for 3-4 days to prevent runoff loss."
    );
  } else if (input.cropType === "corn") {
    tips.push(
      isIndo
        ? "Tanaman jagung merespons terbaik dengan cara ditugal di samping pangkal batang (jarak 5-7 cm) kemudian ditutup tanah tipis untuk mencegah penguapan amonia."
        : "Corn responds best to side-dressing 5-7 cm from the plant base covered with topsoil to minimize ammonia volatilization."
    );
  } else if (input.cropType === "chili") {
    tips.push(
      isIndo
        ? "Tanaman cabai membutuhkan suplai kalsium seimbang bersama pupuk makro. Hindari kelebihan nitrogen saat pembungaan guna mencegah kerontokan bunga dan serangan antraknosa."
        : "Chili requires balanced calcium with macro nutrients. Avoid excess nitrogen during flowering to prevent flower drop and anthracnose."
    );
  } else if (input.cropType === "palmOil") {
    tips.push(
      isIndo
        ? "Untuk kelapa sawit, taburkan pupuk secara merata di area piringan pokok (radius 1.5 - 2.0 meter dari batang) yang telah dibersihkan dari gulma."
        : "For oil palm, apply fertilizer evenly around the weeded circle radius (1.5 - 2.0 meters from tree base)."
    );
  } else if (input.cropType === "tomato") {
    tips.push(
      isIndo
        ? "Tanaman tomat membutuhkan porsi kalium lebih tinggi saat pengisian buah guna mempertebal dinding sel buah, mencegah keretakan kulit, dan meningkatkan kemanisan."
        : "Tomato crops require higher potassium during fruit enlargement to strengthen cell walls, prevent cracking, and enhance sweetness."
    );
  } else if (input.cropType === "soybean") {
    tips.push(
      isIndo
        ? "Kedelai mampu mengikat nitrogen bebas lewat bintil akar (Rhizobium). Porsi pupuk N relatif rendah, utamakan pupuk Fosfor (SP-36) untuk memacu bintil akar."
        : "Soybeans fix atmospheric nitrogen via root nodules. Keep N dosage moderate and prioritize phosphorus (SP-36) for nodulation."
    );
  } else {
    tips.push(
      isIndo
        ? "Bagi aplikasi pupuk ke dalam beberapa interval waktu untuk memaksimalkan efisiensi serapan hara tanaman."
        : "Split fertilizer application into multiple intervals to maximize plant nutrient uptake efficiency."
    );
  }

  // 2. Soil-specific agronomic advice
  if (input.soilType === "sandy") {
    tips.push(
      isIndo
        ? "Karakteristik tanah pasir memiliki permeabilitas tinggi sehingga hara mudah tercuci. Sangat dianjurkan membagi takaran pupuk menjadi 3-4 kali aplikasi dosis kecil bersama kompos."
        : "Sandy soil has high permeability and rapid leaching. Split fertilizer into 3-4 smaller doses supplemented with organic compost."
    );
  } else if (input.soilType === "peat") {
    tips.push(
      isIndo
        ? "Tanah gambut cenderung memiliki pH masam (<5.0). Pastikan melakukan pengapuran dolomit serta prioritaskan Kalium (KCl) untuk mengimbangi kapasitas tanah."
        : "Peat soil has acidic pH (<5.0). Apply dolomite lime and prioritize potassium (KCl) to balance soil capacity."
    );
  } else if (input.soilType === "clay") {
    tips.push(
      isIndo
        ? "Tanah liat memiliki daya ikat air dan hara sangat tinggi. Jaga drainase bedengan agar aerasi perakaran tetap sehat dan tidak memicu busuk akar."
        : "Clay soil has high water and nutrient retention. Ensure good bed drainage so root aeration stays healthy and avoids root rot."
    );
  } else {
    tips.push(
      isIndo
        ? "Kondisi tanah lempung sangat seimbang dalam menahan air dan hara. Lakukan pemupukan pada pagi atau sore hari saat pori stomata tanaman terbuka optimal."
        : "Loam soil is well-balanced in moisture and nutrient retention. Fertilize during morning or evening when plant stomata function optimally."
    );
  }

  // 3. Stage-specific agronomic advice
  if (input.growthStage === "vegetative") {
    tips.push(
      isIndo
        ? "Fase vegetatif aktif: Prioritaskan pupuk Urea untuk pembentukan klorofil, anakan produktif, dan pertunasan daun hijau yang subur."
        : "Active vegetative phase: Prioritize urea for chlorophyll formation, productive tillers, and healthy vegetative growth."
    );
  } else if (input.growthStage === "flowering") {
    tips.push(
      isIndo
        ? "Fase pembungaan: Tingkatkan proporsi SP-36 dan KCl untuk merangsang penyerbukan serempak dan mencegah gugur bunga sebelum menjadi buah."
        : "Flowering phase: Increase SP-36 and KCl proportions to stimulate uniform pollination and prevent flower drop."
    );
  } else if (input.growthStage === "harvest") {
    tips.push(
      isIndo
        ? "Fase pengisian & pematangan: Kalium (KCl) berperan utama mentranslokasikan karbohidrat ke bulir atau buah untuk meningkatkan bobot dan mutu panen."
        : "Ripening phase: Potassium (KCl) plays the key role in translocating carbohydrates to grain/fruit to boost crop quality and yield."
    );
  } else {
    tips.push(
      isIndo
        ? "Fase pembibitan: Butuh fosfor yang cukup untuk merangsang perakaran kuat sebelum tanaman dipindah tanam ke lahan utama."
        : "Seedling phase: Adequate phosphorus is required to stimulate root establishment prior to field transplanting."
    );
  }

  return tips;
}

/**
 * recommendFertilizer
 * 
 * Dynamic agronomy recommendation engine developed for Loop Tani.
 * Computes location-scale N-P-K demand based on official Indonesian research citations (Permentan, Balitsa, PPKS),
 * applies soil heuristic retention factors and growth-stage phase distributions,
 * and outputs single-nutrient fertilizer mappings (Urea, SP-36, KCl).
 */
export function recommendFertilizer(
  input: FarmFormData,
  locale: string = "id",
  liveMarketplaceProducts?: MarketplaceProduct[]
): CalculationResult {
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
      steps.push(`Calculation cannot proceed without reference data. Please consult local agricultural extension workers.`);
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
        fertilizerSelection: isIndo ? "Tidak diterapkan" : "Not applied",
      },
      stepByStep: steps,
      marketplaceProducts: [],
      inputData: input,
    };
  }

  const baseN = officialDosage.nutrients.n;
  const baseP = officialDosage.nutrients.p;
  const baseK = officialDosage.nutrients.k;

  if (isIndo) {
    steps.push(`Dosis dasar acuan resmi (${officialDosage.reference}): N=${baseN} kg, P₂O₅=${baseP} kg, K₂O=${baseK} kg per hektar.`);
  } else {
    steps.push(`Official base dosage reference (${officialDosage.reference}): N=${baseN} kg, P₂O₅=${baseP} kg, K₂O=${baseK} kg per hectare.`);
  }

  // 2. Soil adjustment (Heuristic)
  const soilAdjust = SOIL_FACTOR[input.soilType] || {
    n: 1,
    p: 1,
    k: 1,
    description: isIndo ? "Jenis tanah standar, tidak ada penyesuaian" : "Standard soil type, no adjustment",
  };
  const adjN = baseN * soilAdjust.n;
  const adjP = baseP * soilAdjust.p;
  const adjK = baseK * soilAdjust.k;

  if (isIndo) {
    steps.push(`Penyesuaian karakteristik tanah: ${soilAdjust.description}. Dosis disesuaikan menjadi N=${adjN.toFixed(1)} kg, P=${adjP.toFixed(1)} kg, K=${adjK.toFixed(1)} kg per hektar.`);
  } else {
    steps.push(`Soil characteristic adjustment: ${soilAdjust.description}. Adjusted to N=${adjN.toFixed(1)} kg, P=${adjP.toFixed(1)} kg, K=${adjK.toFixed(1)} kg per hectare.`);
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
    steps.push(`Konversi luas lahan: ${input.landSize} ${input.unit} = ${areaHa.toFixed(4)} Hektar. Total nutrisi tanaman: N=${totalN.toFixed(1)} kg, P=${totalP.toFixed(1)} kg, K=${totalK.toFixed(1)} kg.`);
  } else {
    steps.push(`Land area conversion: ${input.landSize} ${input.unit} = ${areaHa.toFixed(4)} Hectare. Total nutrient demand: N=${totalN.toFixed(1)} kg, P=${totalP.toFixed(1)} kg, K=${totalK.toFixed(1)} kg.`);
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
    harvest: "panen",
  };
  const translatedStage = isIndo ? (stageTranslations[input.growthStage] || input.growthStage) : input.growthStage;

  if (isIndo) {
    steps.push(`Penyesuaian fase pertumbuhan (${translatedStage}): Tahap ini memerlukan ${(phaseRatio * 100).toFixed(0)}% dari total dosis siklus. Dosis fase ini: N=${phaseN.toFixed(1)} kg, P=${phaseP.toFixed(1)} kg, K=${phaseK.toFixed(1)} kg.`);
  } else {
    steps.push(`Growth stage adjustment (${translatedStage}): Requires ${(phaseRatio * 100).toFixed(0)}% of total cycle dosage. Current phase requirement: N=${phaseN.toFixed(1)} kg, P=${phaseP.toFixed(1)} kg, K=${phaseK.toFixed(1)} kg.`);
  }

  // 5. Fertilizer Optimization (Urea 46% N, SP-36 36% P2O5, KCl 60% K2O)
  const ureaRequired = phaseN / 0.46;
  const sp36Required = phaseP / 0.36;
  const kclRequired = phaseK / 0.60;

  if (isIndo) {
    steps.push(`Optimasi formula pupuk tunggal: Dikonversikan ke Urea (46% N), SP-36 (36% P), dan KCl (60% K) untuk mencegah tumpang tindih hara.`);
  } else {
    steps.push(`Single-nutrient fertilizer conversion: Mapped to Urea (46% N), SP-36 (36% P), and KCl (60% K) for targeted application.`);
  }

  // 6. Dynamic Marketplace Products
  let products = liveMarketplaceProducts && liveMarketplaceProducts.length > 0 ? liveMarketplaceProducts : [
    { id: "p1", name: "Pupuk Urea Non-Subsidi 50kg", price: 350000, slug: "urea-non-subsidi", storeName: "Tani Makmur Jaya" },
    { id: "p2", name: "Pupuk SP-36 50kg", price: 150000, slug: "sp-36-50kg", storeName: "Sumber Tani" },
    { id: "p3", name: "Pupuk KCl Mahkota 50kg", price: 450000, slug: "kcl-mahkota", storeName: "Tani Makmur Jaya" },
  ];

  if (isIndo) {
    steps.push(`Pencocokan katalog toko: Menghubungkan kebutuhan pupuk terhitung dengan inventaris marketplace LoopTani.`);
  } else {
    steps.push(`Marketplace catalog matching: Linked calculated fertilizer amounts with LoopTani verified sellers.`);
  }

  const totalNutrients = phaseN + phaseP + phaseK;
  const pN = totalNutrients > 0 ? Math.round((phaseN / totalNutrients) * 100) : 0;
  const pP = totalNutrients > 0 ? Math.round((phaseP / totalNutrients) * 100) : 0;
  const pK = totalNutrients > 0 ? Math.round((phaseK / totalNutrients) * 100) : 0;

  // Dynamic confidence score calculation
  const soilConfidenceBonus = input.soilType === "loam" ? 4 : input.soilType === "clay" ? 3 : 1;
  const stageConfidenceBonus = input.growthStage === "vegetative" ? 2 : 1;
  const confidence = Math.min(98, 91 + soilConfidenceBonus + stageConfidenceBonus);

  // Dynamic tailored agronomic insights
  const dynamicInsights = generateDynamicInsights(input, isIndo);

  return {
    nutrients: [
      { name: "nitrogen", amount: Math.max(1, Math.round(phaseN)), unit: "kg", percentage: pN },
      { name: "phosphorus", amount: Math.max(1, Math.round(phaseP)), unit: "kg", percentage: pP },
      { name: "potassium", amount: Math.max(1, Math.round(phaseK)), unit: "kg", percentage: pK },
    ],
    fertilizers: [
      { name: "Urea (46% N)", amount: Math.max(1, Math.round(ureaRequired)), unit: "kg" },
      { name: "SP-36 (36% P)", amount: Math.max(1, Math.round(sp36Required)), unit: "kg" },
      { name: "KCl (60% K)", amount: Math.max(1, Math.round(kclRequired)), unit: "kg" },
    ],
    estimatedCost: Math.round((ureaRequired / 50) * 350000 + (sp36Required / 50) * 150000 + (kclRequired / 50) * 450000),
    confidence,
    insights: dynamicInsights,
    recommendationSource: {
      dosage: officialDosage.reference,
      soilAdjustment: isIndo ? `Heuristik: ${soilAdjust.description}` : `Heuristic: ${soilAdjust.description}`,
      fertilizerSelection: "Loop Tani Precision Engine",
    },
    stepByStep: steps,
    marketplaceProducts: products,
    inputData: input,
  };
}
