import { axiosInstance } from "@/lib/axios";
import { Address, CreateAddressPayload, UpdateAddressPayload } from "../types/address.type";

export const addressKeys = {
  all: ["address"] as const,
  list: () => [...addressKeys.all, "list"] as const,
  default: () => [...addressKeys.all, "default"] as const,
  detail: (id: string) => [...addressKeys.all, "detail", id] as const,
};

export async function getAddresses(): Promise<Address[]> {
  const { data } = await axiosInstance.get<Address[]>("/address");
  return data;
}

export async function getDefaultAddress(): Promise<Address> {
  const { data } = await axiosInstance.get<Address>("/address/default");
  return data;
}

export async function getAddress(id: string): Promise<Address> {
  const { data } = await axiosInstance.get<Address>(`/address/${id}`);
  return data;
}

export async function createAddress(payload: CreateAddressPayload): Promise<Address> {
  const { data } = await axiosInstance.post<Address>("/address", payload);
  return data;
}

export async function updateAddress(id: string, payload: UpdateAddressPayload): Promise<Address> {
  const { data } = await axiosInstance.patch<Address>(`/address/${id}`, payload);
  return data;
}

export async function setDefaultAddress(id: string): Promise<Address> {
  const { data } = await axiosInstance.patch<Address>(`/address/${id}/set-default`);
  return data;
}

export async function deleteAddress(id: string): Promise<Address> {
  const { data } = await axiosInstance.delete<Address>(`/address/${id}`);
  return data;
}
