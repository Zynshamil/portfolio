import { Hero, HeroBackdrop } from "@/components/sections/hero";
import { Collaborators } from "@/components/sections/collaborators";
import { JsonLd } from "@/components/seo/json-ld";
import { ScrollStage } from "@/components/ui/scroll-stage";

export default function Home() {
  return (
    <>
      <JsonLd />
      <ScrollStage backdrop={<HeroBackdrop />} hero={<Hero />}>
        <Collaborators />
      </ScrollStage>
    </>
  );
}
