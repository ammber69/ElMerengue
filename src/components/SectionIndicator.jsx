import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { id: 'inicio', label: 'Inicio', href: '#' },
  { id: 'nosotros', label: 'Nosotros', href: '#nosotros' },
  { id: 'trabajos', label: 'Trabajos', href: '#trabajos' },
  { id: 'catalogo', label: 'Tienda', href: '#catalogo' },
  { id: 'contacto', label: 'Contacto', href: '#contacto' },
];

export const SectionIndicator = () => {
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id || 'inicio');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sectionElements = sections
      .map(s => s.id === 'inicio' ? document.querySelector('section') : document.getElementById(s.id))
      .filter(el => el !== null);

    sectionElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4">
      {sections.map((section) => {
        const isActive = activeSection === section.id || (section.id === 'inicio' && activeSection === '');
        
        return (
          <a
            key={section.id}
            href={section.href}
            className="group relative flex items-center justify-end"
            aria-label={`Ir a ${section.label}`}
          >
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-8 text-xs font-bold text-merengue-main uppercase tracking-widest whitespace-nowrap bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-merengue-pastel"
                >
                  {section.label}
                </motion.span>
              )}
            </AnimatePresence>
            
            <div className={`
              w-3 h-3 rounded-full transition-all duration-500 border-2
              ${isActive 
                ? 'bg-merengue-main border-merengue-main scale-125 shadow-lg shadow-merengue-main/40' 
                : 'bg-merengue-pastel/40 border-merengue-main/20 group-hover:border-merengue-main/50 group-hover:scale-110'
              }
            `} />
          </a>
        );
      })}
    </div>
  );
};
