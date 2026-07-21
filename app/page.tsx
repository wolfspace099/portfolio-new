import type { Metadata } from "next";
import Hero from "./components/Hero";
import Specialties from "./components/Specialties";

export const metadata: Metadata = {
  title: "CQT.EXE",
  description: "Full-stack developer building Minecraft plugins, web apps and tooling. Available for hire.",
};

export default function Page() {
  return (
    <>
      <Hero />
      <Specialties />
    </>
  );
}
