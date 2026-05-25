import type { Metadata } from "next";
import About from "../components/About";

export const metadata: Metadata = {
  title: "ABOUT | CQT.EXE",
  description: "About Cqt — who I am, what I do, and why I do it.",
};

export default function Page() {
  return <About />;
}
