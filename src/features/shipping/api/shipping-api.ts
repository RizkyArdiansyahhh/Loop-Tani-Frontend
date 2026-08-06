import { axiosInstance } from "@/lib/axios";
import {
  GetShippingOptionsPayload,
  GroupedCourierOption,
  ShippingDestination,
} from "../types/shipping.type";

export const shippingApi = {
  searchDestination: async (search: string): Promise<ShippingDestination[]> => {
    const { data } = await axiosInstance.get<ShippingDestination[]>(
      "/shipping/destination",
      {
        params: { search },
      }
    );
    return data;
  },

  getShippingOptions: async (
    payload: GetShippingOptionsPayload
  ): Promise<GroupedCourierOption[]> => {
    const { data } = await axiosInstance.post<GroupedCourierOption[]>(
      "/shipping/options",
      payload
    );
    return data;
  },
};
