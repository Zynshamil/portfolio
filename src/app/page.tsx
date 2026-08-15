import { Hero, HeroBackdrop } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Collaborators } from "@/components/sections/collaborators";
import { JsonLd } from "@/components/seo/json-ld";
import { ScrollStage } from "@/components/ui/scroll-stage";

export default function Home() {
  return (
    <>
      <JsonLd />
      <ScrollStage backdrop={<HeroBackdrop />} hero={<Hero />}>
        {/* Who, then who with. About leads because the headline above it is a
            slogan rather than an introduction — this is the first thing on the
            page that actually says whose site this is. */}
        <About />
        <Collaborators />
      </ScrollStage>
    </>
  );
}
