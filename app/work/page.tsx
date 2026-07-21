import type { Metadata } from "next";
import Desktop from "../components/desktop/Desktop";

export const metadata: Metadata = {
  title: "Projects | Cqt",
  description: "Projects — plugins that ran on real servers, web apps that actually shipped.",
};

export default function Page() {
  return <Desktop initialApp="work" />;
}
