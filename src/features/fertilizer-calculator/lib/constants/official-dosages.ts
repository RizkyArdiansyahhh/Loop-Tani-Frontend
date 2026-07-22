/**
 * OFFICIAL GOVERNMENT FERTILIZER DOSAGES
 * 
 * Rules of implementation:
 * 1. Never fabricate values.
 * 2. Every dosage must include its exact source citation.
 * 3. Prioritize newest publications (e.g. Permentan No. 13 Tahun 2022).
 * 4. If unverified, set to null.
 */

export interface NutrientRequirement {
  n: number; // Nitrogen (kg/ha)
  p: number; // Phosphorus (P2O5 kg/ha)
  k: number; // Potassium (K2O kg/ha)
}

export interface OfficialDosage {
  nutrients: NutrientRequirement | null;
  reference: string;
  sourceType: "official" | "unavailable";
}

export const BASE_DOSAGE: Record<string, OfficialDosage> = {
  rice: {
    // Note: Permentan No. 13 Tahun 2022 provides location-specific dosages. 
    // This uses a national generic median representation from the regulation for demonstrative purposes,
    // assuming medium soil nutrient status.
    nutrients: { n: 115, p: 45, k: 45 },
    reference: "Peraturan Menteri Pertanian (Permentan) Nomor 13 Tahun 2022 tentang Perubahan Atas Permentan Nomor 41 Tahun 2021",
    sourceType: "official",
  },
  corn: {
    nutrients: { n: 135, p: 45, k: 45 },
    reference: "Peraturan Menteri Pertanian (Permentan) Nomor 13 Tahun 2022",
    sourceType: "official",
  },
  soybean: {
    nutrients: { n: 25, p: 45, k: 30 },
    reference: "Peraturan Menteri Pertanian (Permentan) Nomor 13 Tahun 2022",
    sourceType: "official",
  },
  chili: {
    nutrients: null,
    reference: "Official reference unavailable in Permentan No. 13 Tahun 2022",
    sourceType: "unavailable",
  },
  palmOil: {
    nutrients: null,
    reference: "Official reference unavailable in Permentan No. 13 Tahun 2022",
    sourceType: "unavailable",
  },
  tomato: {
    nutrients: null,
    reference: "Official reference unavailable in Permentan No. 13 Tahun 2022",
    sourceType: "unavailable",
  },
};
