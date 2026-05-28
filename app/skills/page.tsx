import type { Metadata } from "next";
import Skills from "../components/Skills";

export const metadata: Metadata = {
  title: "SKILLS | CQT.EXE",
  description: "What I actually know and use — Java, TypeScript, React, Linux, and more.",
};

export default function Page() {
  return <Skills />;
}
