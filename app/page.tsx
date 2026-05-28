import type { Metadata } from "next";
import Hero from "./components/Hero";
import Specialties from "./components/Specialties";

export const metadata: Metadata = {
  title: "CQT.EXE",
  description: "Cat that writes Minecraft plugins and web apps. Available for hire.",
};

export default function Page() {
  return (
    <>
      <Hero />
      <Specialties />
    </>
  );
}
