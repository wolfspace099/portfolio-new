import type { Metadata } from "next";
import About from "../components/About";

export const metadata: Metadata = {
  title: "ABOUT | CQT.EXE",
  description: "Full-stack developer specialising in Minecraft plugins, web applications and DevOps.",
};

export default function Page() {
  return <About />;
}
