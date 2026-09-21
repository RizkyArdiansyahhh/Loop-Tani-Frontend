import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function optimizeCloudinaryUrl(url: string, width = 400): string {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com")) return url;

  const uploadMatch = url.match(/(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload\/)(?:[^/]+\/)?(v\d+\/.*|[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+.*)/);
  if (uploadMatch) {
    const [, base, path] = uploadMatch;
    return `${base}f_auto,q_auto:good,w_${width},c_limit/${path}`;
  }

  return url.replace("/upload/", `/upload/f_auto,q_auto:good,w_${width},c_limit/`);
}
