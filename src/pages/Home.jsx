import { Hero } from "../sections/Hero";
import { Nosotros } from "../sections/Nosotros";
import { Contacto } from "../sections/Contacto";
import { Gallery } from "../sections/Gallery";
import { Catalog } from "../sections/Catalog";
import { SectionIndicator } from "../components/SectionIndicator";

export const Home = () => {
  return (
    <main className="w-full">
      <SectionIndicator />
      <Hero />
      <Nosotros />
      <Gallery />
      <Catalog />
      <Contacto />
    </main>
  );
};
