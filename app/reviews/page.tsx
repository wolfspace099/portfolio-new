import type { Metadata } from "next";
import Reviews from "../components/Reviews";

export const metadata: Metadata = {
  title: "REVIEWS | CQT.EXE",
  description: "Client reviews and testimonials.",
};

export default function Page() {
  return <Reviews />;
}
