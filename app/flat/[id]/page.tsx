import { notFound } from "next/navigation";
import { FLATS_DATA } from "@/lib/mockData";
import { FlatDetailsClient } from "./FlatDetailsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FlatDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const flat = FLATS_DATA.find((f) => f.id === resolvedParams.id);
  
  if (!flat) {
    notFound();
  }

  return <FlatDetailsClient flat={flat} />;
}
