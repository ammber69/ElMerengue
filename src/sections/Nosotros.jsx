import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Heart, Star, Award } from "lucide-react";

export const Nosotros = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const features = [
    { icon: <Award size={24} />, title: "10+ años", desc: "De experiencia" },
    { icon: <Star size={24} />, title: "Calidad", desc: "Garantizada" },
    { icon: <Heart size={24} />, title: "Hecho con amor", desc: "Cada detalle cuenta" }
  ];

  return (
    <section id="nosotros" className="snap-start min-h-screen flex items-center py-24 bg-merengue-snow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-display font-bold text-merengue-dark mb-6">Nuestra Historia</h2>
            <p className="text-merengue-text/80 text-lg mb-6 leading-relaxed">
              En <span className="font-semibold text-merengue-main">El Merengue</span>, creemos que cada celebración merece ser recordada con un toque dulce. Durante más de una década, hemos creado pasteles y postres que no solo se ven espectaculares, sino que saben a hogar.
            </p>
            <p className="text-merengue-text/80 text-lg mb-10 leading-relaxed">
              Utilizamos ingredientes de la más alta calidad para garantizar que cada bocado sea una experiencia premium.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {features.map((item, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-xl shadow-sm border border-merengue-gray hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-merengue-pastel text-merengue-main mb-3">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-merengue-dark mb-1">{item.title}</h4>
                  <p className="text-sm text-merengue-text/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-merengue-main/20 relative">
              <img 
                src="https://images.unsplash.com/photo-1557308536-ee471ef2c390?q=80&w=1000&auto=format&fit=crop" 
                alt="Nuestra panadería"
                className="w-full h-full object-cover"
              />
              {/* Decorative element */}
              <div className="absolute inset-0 border-4 border-merengue-snow/20 rounded-3xl m-4 pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
