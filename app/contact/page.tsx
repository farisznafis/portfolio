import type { Metadata } from "next";
import { Contact } from "../components/Contact";
import { PageTransition } from "../components/ui/PageTransition";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Faris Znafis for projects, roles, or a chat about motion on the web.",
};

export default function ContactPage() {
  return (
    <PageTransition>
      <Contact />
    </PageTransition>
  );
}
