import type { Metadata } from "next";
import Desktop from "../components/desktop/Desktop";

export const metadata: Metadata = {
  title: "Reviews | Cqt",
  description: "Client reviews and testimonials.",
};

export default function Page() {
  return <Desktop initialApp="reviews" />;
}
