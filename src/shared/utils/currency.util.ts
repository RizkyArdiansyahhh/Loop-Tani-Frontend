/**
 * Formats a numeric value into IDR (Indonesian Rupiah) currency string.
 * Example: 120000 -> "Rp120.000"
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Rp0";
  }

  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);

  // Replace non-breaking space or normal space after "Rp" with no space to match "Rp120.000" style
  return formatted.replace(/^Rp\s?/, "Rp");
}
