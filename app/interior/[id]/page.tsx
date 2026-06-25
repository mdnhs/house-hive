import { notFound } from "next/navigation";
import { INTERIORS_DATA } from "@/lib/mockData";
import { InteriorDetailsClient } from "./InteriorDetailsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InteriorDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const interior = INTERIORS_DATA.find((i) => i.id === resolvedParams.id);
  
  if (!interior) {
    notFound();
  }

  return <InteriorDetailsClient interior={interior} />;
}
