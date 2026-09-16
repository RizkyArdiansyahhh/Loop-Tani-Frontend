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
    nutrients: { n: 115, p: 45, k: 45 },
    reference: "Peraturan Menteri Pertanian (Permentan) Nomor 13 Tahun 2022 tentang Alokasi dan Dosis Pemupukan Berimbang",
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
    nutrients: { n: 150, p: 100, k: 100 },
    reference: "Panduan Pemupukan Hortikultura Balai Penelitian Tanaman Sayuran (Balitsa / BSIP Hortikultura Kementan RI)",
    sourceType: "official",
  },
  palmOil: {
    nutrients: { n: 160, p: 70, k: 210 },
    reference: "Pedoman Pemupukan Tanaman Menghasilkan (TM) Pusat Penelitian Kelapa Sawit (PPKS Medan)",
    sourceType: "official",
  },
  tomato: {
    nutrients: { n: 120, p: 90, k: 120 },
    reference: "Standar Pemupukan Tanaman Tomat Balai Penelitian Tanaman Sayuran (Balitsa / BSIP Kementan RI)",
    sourceType: "official",
  },
};
