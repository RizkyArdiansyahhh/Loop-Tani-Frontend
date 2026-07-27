import * as z from "zod";

export const addressFormSchema = z.object({
  type: z.enum(["HOME", "OFFICE", "OTHER"]),
  label: z.string().trim().optional().nullable(),
  recipientName: z
    .string()
    .trim()
    .min(2, "Nama penerima minimal 2 karakter")
    .max(100, "Nama penerima maksimal 100 karakter"),
  recipientPhone: z
    .string()
    .trim()
    .min(10, "Nomor telepon minimal 10 karakter")
    .max(16, "Nomor telepon maksimal 16 karakter")
    .regex(/^(\+62|62|0)[0-9]{7,15}$/, "Format nomor telepon tidak valid. Gunakan format Indonesia (contoh: 0812xxxx atau 628xx)"),
  provinceId: z.string().trim().min(1, "Provinsi wajib dipilih"),
  provinceName: z.string().trim().min(1, "Provinsi wajib dipilih"),
  cityId: z.string().trim().min(1, "Kota/Kabupaten wajib dipilih"),
  cityName: z.string().trim().min(1, "Kota/Kabupaten wajib dipilih"),
  districtId: z.string().trim().min(1, "Kecamatan wajib dipilih"),
  districtName: z.string().trim().min(1, "Kecamatan wajib dipilih"),
  subDistrictId: z.string().trim().min(1, "Kelurahan/Desa wajib dipilih"),
  subDistrictName: z.string().trim().min(1, "Kelurahan/Desa wajib dipilih"),
  postalCode: z
    .string()
    .trim()
    .min(3, "Kode pos minimal 3 karakter")
    .max(10, "Kode pos maksimal 10 karakter")
    .regex(/^[0-9]+$/, "Kode pos hanya boleh berisi angka"),
  street: z
    .string()
    .trim()
    .min(5, "Alamat lengkap minimal 5 karakter")
    .max(255, "Alamat lengkap maksimal 255 karakter"),
  notes: z.string().trim().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  placeId: z.string().trim().optional().nullable(),
  isDefault: z.boolean().optional().default(false),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;
