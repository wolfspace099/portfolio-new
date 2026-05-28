import type { Metadata } from "next";
import About from "../components/About";

export const metadata: Metadata = {
  title: "ABOUT | CQT.EXE",
  description: "A cat that codes. College student, perfectionist, Linux user.",
};

export default function Page() {
  return <About />;
}
