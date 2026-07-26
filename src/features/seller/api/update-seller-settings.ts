import { axiosInstance } from "@/lib/axios";
import type { UserSellerProfile } from "@/types/api";
import type { UpdateSellerSettingsPayload } from "../types";

export async function updateSellerSettings(
  payload: UpdateSellerSettingsPayload
): Promise<UserSellerProfile> {
  const { data } = await axiosInstance.patch<UserSellerProfile>(
    "/seller/settings",
    payload
  );
  return data;
}
