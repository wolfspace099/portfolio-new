import type { Metadata } from "next";
import Projects from "../components/Projects";

export const metadata: Metadata = {
  title: "WORK | CQT.EXE",
  description: "Projects — plugins that ran on real servers, web apps that actually shipped.",
};

export default function Page() {
  return <Projects />;
}
