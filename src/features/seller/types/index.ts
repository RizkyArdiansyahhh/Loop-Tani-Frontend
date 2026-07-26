import * as z from "zod";

export type SocialPlatform =
  | "INSTAGRAM"
  | "TIKTOK"
  | "YOUTUBE"
  | "FACEBOOK"
  | "X"
  | "WHATSAPP"
  | "WEBSITE"
  | "TELEGRAM";

export type SellerSocialMediaItem = {
  id?: string;
  sellerId?: string;
  platform: SocialPlatform;
  url: string;
};

export const settingsSchema = z.object({
  storeName: z.string().min(2, "Nama toko minimal 2 karakter").max(80),
  storeSlug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  phone: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  website: z.string().optional(),
  youtube: z.string().optional(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export type UpdateSellerSettingsPayload = {
  storeName?: string;
  storeSlug?: string;
  phone?: string;
  province?: string;
  city?: string;
  postalCode?: string;
  address?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  socialMedia?: SellerSocialMediaItem[];
};
