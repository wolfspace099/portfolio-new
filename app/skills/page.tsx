import type { Metadata } from "next";
import Desktop from "../components/desktop/Desktop";

export const metadata: Metadata = {
  title: "Skills | Cqt",
  description: "What I know and use — Java, TypeScript, React, Linux, and more.",
};

export default function Page() {
  return <Desktop initialApp="skills" />;
}
