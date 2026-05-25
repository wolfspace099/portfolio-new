import type { Metadata } from "next";
import Projects from "../components/Projects";

export const metadata: Metadata = {
  title: "WORK | CQT.EXE",
  description: "Projects — Minecraft plugins, web apps, and DevOps work.",
};

export default function Page() {
  return <Projects />;
}
