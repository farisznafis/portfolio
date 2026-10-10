import type { Metadata } from "next";

import { PageTransition } from "../components/ui/PageTransition";
import { CertificatesIndex } from "../components/sections/CertificatesIndex";

export const metadata: Metadata = {
  title: "Certificates",
  description:
    "Certificates and awards earned by Faris Zaidan Nafis — machine learning, TensorFlow, data analytics, and competition results.",
};

export default async function CertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;

  return (
    <PageTransition>
      <CertificatesIndex initialId={c} />
    </PageTransition>
  );
}
