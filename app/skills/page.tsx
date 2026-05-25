import type { Metadata } from "next";
import Skills from "../components/Skills";

export const metadata: Metadata = {
  title: "SKILLS | CQT.EXE",
  description: "Tech stack — JavaScript, React, Java, Docker, and more.",
};

export default function Page() {
  return <Skills />;
}
