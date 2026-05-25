import type { Metadata } from "next";
import QuoteForm from "../components/QuoteForm";

export const metadata: Metadata = {
  title: "QUOTE | CQT.EXE",
  description: "Request a quote for your project.",
};

export default function Page() {
  return <QuoteForm />;
}
