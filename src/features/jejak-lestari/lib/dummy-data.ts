// ─── Types ────────────────────────────────────────────────────────────────────

export type ImpactCategory =
  | "pupuk_organik"
  | "kompos"
  | "benih_lokal"
  | "peralatan"
  | "produk_olahan";

export interface TransactionImpact {
  id: string;
  date: string; // ISO date string
  productName: string;
  productCategory: ImpactCategory;
  quantity: number;
  unit: string;
  totalPrice: number; // in IDR
  metrics: {
    co2Prevented: number; // kg
    waterProtected: number; // liter
    energyGenerated: number; // kWh
  };
  impactDescription: string; // human-readable summary
}

export interface SustainabilityTotals {
  totalCo2Prevented: number;
  totalWaterProtected: number;
  totalEnergyGenerated: number;
  transactionCount: number;
  // Contextual comparisons
  treesEquivalent: number;
  electricityMonths: number;
  drivingKmAvoided: number;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

export const dummyTransactions: TransactionImpact[] = [
  {
    id: "txn-001",
    date: "2025-06-28",
    productName: "Pupuk Organik Kompos Premium",
    productCategory: "pupuk_organik",
    quantity: 2,
    unit: "karung",
    totalPrice: 120000,
    metrics: { co2Prevented: 8.4, waterProtected: 340, energyGenerated: 1.2 },
    impactDescription:
      "Mengganti pupuk kimia dengan pupuk organik mencegah 8.4 kg emisi CO₂ & melindungi 340L air tanah dari kontaminasi nitrat.",
  },
  {
    id: "txn-002",
    date: "2025-06-21",
    productName: "Kompos Daun Sisa Panen",
    productCategory: "kompos",
    quantity: 5,
    unit: "kg",
    totalPrice: 45000,
    metrics: { co2Prevented: 3.1, waterProtected: 120, energyGenerated: 0.4 },
    impactDescription:
      "Daur ulang limbah organik menjadi kompos mencegah 3.1 kg gas metana dari TPA & mengurangi kebutuhan air irigasi.",
  },
  {
    id: "txn-003",
    date: "2025-06-14",
    productName: "Benih Padi Lokal Varietas Rojolele",
    productCategory: "benih_lokal",
    quantity: 3,
    unit: "paket",
    totalPrice: 210000,
    metrics: { co2Prevented: 5.6, waterProtected: 580, energyGenerated: 2.8 },
    impactDescription:
      "Benih lokal adaptif menghemat 30% air irigasi vs. varietas impor & mendukung keanekaragaman hayati pertanian lokal.",
  },
  {
    id: "txn-004",
    date: "2025-06-07",
    productName: "Cangkul Ergonomis Stainless",
    productCategory: "peralatan",
    quantity: 1,
    unit: "unit",
    totalPrice: 185000,
    metrics: { co2Prevented: 1.8, waterProtected: 60, energyGenerated: 0.6 },
    impactDescription:
      "Peralatan tahan lama mengurangi frekuensi produksi ulang, menghemat 1.8 kg CO₂ dari proses manufaktur berulang.",
  },
  {
    id: "txn-005",
    date: "2025-05-30",
    productName: "Tepung Singkong Fermentasi",
    productCategory: "produk_olahan",
    quantity: 4,
    unit: "kg",
    totalPrice: 96000,
    metrics: { co2Prevented: 2.9, waterProtected: 200, energyGenerated: 1.1 },
    impactDescription:
      "Olahan singkong lokal mengurangi impor tepung terigu, menekan emisi transportasi sebesar 2.9 kg CO₂.",
  },
  {
    id: "txn-006",
    date: "2025-05-22",
    productName: "Pupuk Hayati Mikoriza",
    productCategory: "pupuk_organik",
    quantity: 3,
    unit: "botol",
    totalPrice: 135000,
    metrics: { co2Prevented: 6.2, waterProtected: 410, energyGenerated: 1.9 },
    impactDescription:
      "Mikoriza meningkatkan penyerapan nutrisi alami tanaman, mengurangi kebutuhan pupuk kimia hingga 40% & emisi N₂O.",
  },
  {
    id: "txn-007",
    date: "2025-05-15",
    productName: "Kompos Bioaktif EM4",
    productCategory: "kompos",
    quantity: 10,
    unit: "kg",
    totalPrice: 80000,
    metrics: { co2Prevented: 4.5, waterProtected: 270, energyGenerated: 0.8 },
    impactDescription:
      "Pengomposan aerobik dengan EM4 mengonversi limbah organik menjadi humus, mencegah 4.5 kg emisi gas rumah kaca.",
  },
];

// Compute totals from dummy data
export function computeSustainabilityTotals(
  transactions: TransactionImpact[]
): SustainabilityTotals {
  const totals = transactions.reduce(
    (acc, txn) => ({
      totalCo2Prevented: acc.totalCo2Prevented + txn.metrics.co2Prevented,
      totalWaterProtected:
        acc.totalWaterProtected + txn.metrics.waterProtected,
      totalEnergyGenerated:
        acc.totalEnergyGenerated + txn.metrics.energyGenerated,
    }),
    { totalCo2Prevented: 0, totalWaterProtected: 0, totalEnergyGenerated: 0 }
  );

  return {
    ...totals,
    transactionCount: transactions.length,
    treesEquivalent: Math.round(totals.totalCo2Prevented / 2.6), // 1 tree ≈ absorbs 2.6 kg CO₂/year
    electricityMonths: parseFloat(
      (totals.totalEnergyGenerated / 30).toFixed(1)
    ), // ~30 kWh/month average household
    drivingKmAvoided: Math.round(totals.totalCo2Prevented * 6), // ~6 km per kg CO₂
  };
}

export const categoryLabels: Record<ImpactCategory, string> = {
  pupuk_organik: "Pupuk Organik",
  kompos: "Kompos",
  benih_lokal: "Benih Lokal",
  peralatan: "Peralatan",
  produk_olahan: "Produk Olahan",
};

export const categoryColors: Record<ImpactCategory, string> = {
  pupuk_organik: "bg-primary/10 text-primary border-primary/20",
  kompos: "bg-accent/10 text-accent border-accent/20",
  benih_lokal: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  peralatan: "bg-muted text-muted-foreground border-border",
  produk_olahan: "bg-primary/5 text-primary/80 border-primary/15",
};
