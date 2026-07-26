import React from "react";
import { EditAddressPage } from "@/features/address";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <EditAddressPage id={id} />;
}
