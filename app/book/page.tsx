import type { Metadata } from "next";

import { BookExperience } from "../components/book/BookExperience";
import { PageTransition } from "../components/ui/PageTransition";

export const metadata: Metadata = {
  title: "The pop-up book",
  description:
    "The path of Faris Zaidan Nafis from Indonesia to Kumamoto, told as a fine-press pop-up book in five spreads.",
};

export default function BookPage() {
  return (
    <PageTransition>
      <BookExperience />
    </PageTransition>
  );
}
