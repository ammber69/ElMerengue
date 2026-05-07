import { Hero } from "../sections/Hero";
import { Nosotros } from "../sections/Nosotros";
import { Contacto } from "../sections/Contacto";
import { Gallery } from "../sections/Gallery";
import { Catalog } from "../sections/Catalog";

export const Home = () => {
  return (
    <main className="w-full">
      <Hero />
      <Nosotros />
      <Gallery />
      <Catalog />
      <Contacto />
    </main>
  );
};
