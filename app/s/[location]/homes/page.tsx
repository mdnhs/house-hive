import { ResultsClient } from "./ResultsClient";

interface PageProps {
  params: Promise<{ location: string }>;
}

export default async function SearchResultsPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  // Clean location by decoding it and converting hyphens back to spaces
  const decodedLocation = decodeURIComponent(resolvedParams.location).replace(/-/g, " ");

  return <ResultsClient initialLocation={decodedLocation} />;
}
