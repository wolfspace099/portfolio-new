import type { Metadata } from "next";
import Desktop from "../components/desktop/Desktop";

export const metadata: Metadata = {
  title: "About | Cqt",
  description: "Full-stack developer specialising in Minecraft plugins, web applications and DevOps.",
};

export default function Page() {
  return <Desktop initialApp="about" />;
}
