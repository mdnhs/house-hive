import OnboardingClient from "./OnboardingClient";

interface PageProps {
  searchParams: Promise<{ step?: string }>;
}

export default async function PartnerOnboardingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <OnboardingClient initialStepParam={params.step} />;
}
