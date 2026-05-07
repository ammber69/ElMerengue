import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion } from "framer-motion";
import { Button } from "../components/Button";
import { ChevronDown } from "lucide-react";

export const Hero = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = useMemo(() => ({
    fullScreen: { enable: false },
    particles: {
      number: { value: 30, density: { enable: true, value_area: 800 } },
      color: { value: ["#D63384", "#F9A825", "#F48FB1"] },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 5, random: true },
      move: { enable: true, speed: 2, direction: "bottom", straight: false, outModes: "out" }
    },
    interactivity: {
      events: { onHover: { enable: true, mode: "bubble" } },
      modes: { bubble: { size: 10, distance: 100 } }
    }
  }), []);

  const handleScroll = () => {
    document.getElementById('trabajos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-merengue-pastel/20">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-merengue-pastel/60 to-merengue-snow z-10" />
        <img 
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2000&auto=format&fit=crop" 
          alt="Pasteles decorados" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0 z-10"
        />
      )}

      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-merengue-dark mb-4 text-balance"
        >
          El Merengue
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-accent text-merengue-main mb-8"
        >
          Repostería artesanal · Yanga, Ver
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button size="lg" onClick={handleScroll} className="text-lg rounded-full px-8 py-6 shadow-lg shadow-merengue-main/20">
            Ver nuestros trabajos
          </Button>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-merengue-main cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        onClick={handleScroll}
      >
        <ChevronDown size={40} />
      </motion.div>
    </section>
  );
};
