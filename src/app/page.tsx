import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Work } from "@/components/sections/work";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { About } from "@/components/sections/about";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { JsonLd } from "@/components/seo/json-ld";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Hero />
      <Marquee />
      <Work />
      <Services />
      <Process />
      <About />
      <Testimonials />
      <Faq />
      <Contact />
    </>
  );
}
