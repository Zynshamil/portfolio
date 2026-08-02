import { Hero } from "@/components/sections/hero";
import { JsonLd } from "@/components/seo/json-ld";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Hero />
    </>
  );
}
