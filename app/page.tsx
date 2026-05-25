import type { Metadata } from "next";
import Hero from "./components/Hero";
import Specialties from "./components/Specialties";

export const metadata: Metadata = {
  title: "CQT.EXE",
  description: "Minecraft plugins, web dev, and DevOps — available for hire.",
};

export default function Page() {
  return (
    <>
      <Hero />
      <Specialties />
    </>
  );
}
