import type { Metadata } from "next";
import Desktop from "../components/desktop/Desktop";

export const metadata: Metadata = {
  title: "Get a Quote | Cqt",
  description: "Request a quote for your project.",
};

export default function Page() {
  return <Desktop initialApp="quote" />;
}
