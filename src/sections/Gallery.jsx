import { useState } from 'react';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryCard } from '../components/GalleryCard';
import { useTrabajos } from '../hooks/useTrabajos';
import { Loader2, Camera } from 'lucide-react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const CATEGORIES = ['Todos', 'Boda', 'XV', 'Cumpleaños', 'Infantil', 'Galletas', 'Otros'];

export const Gallery = () => {
  const [filter, setFilter] = useState('Todos');
  const [index, setIndex] = useState(-1);
  const { trabajos, loading } = useTrabajos(filter);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <section id="trabajos" className="snap-start py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 bg-merengue-pastel rounded-2xl flex items-center justify-center mx-auto mb-6 text-merengue-main"
          >
            <Camera size={24} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-merengue-dark mb-4"
          >
            Nuestros Trabajos
          </motion.h2>
          <div className="w-24 h-1.5 bg-merengue-main mx-auto rounded-full mb-10" />
          
          {/* Filter Bar */}
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border-2 ${
                  filter === cat 
                    ? 'bg-merengue-main border-merengue-main text-white shadow-xl shadow-merengue-main/30 scale-105' 
                    : 'bg-merengue-gray border-merengue-gray text-merengue-text hover:border-merengue-main hover:text-merengue-main'
                }`}
              >
                {cat === 'XV' ? 'XV Años' : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-merengue-text/40">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="italic font-medium">Revelando creaciones...</p>
          </div>
        ) : (
          <>
            {/* Masonry Grid */}
            <AnimatePresence mode="popLayout">
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex -ml-6 w-auto"
                columnClassName="pl-6 bg-clip-padding"
              >
                {trabajos.map((item, idx) => (
                  <GalleryCard 
                    key={item.id} 
                    item={item} 
                    onClick={() => setIndex(idx)}
                  />
                ))}
              </Masonry>
            </AnimatePresence>

            {/* Empty State */}
            {trabajos.length === 0 && (
              <div className="text-center py-20 bg-merengue-snow rounded-[3rem] border-2 border-dashed border-merengue-pastel">
                <p className="text-merengue-text/60 italic font-medium">No hay trabajos disponibles en esta categoría por el momento.</p>
              </div>
            )}
          </>
        )}

        {/* Lightbox */}
        {!loading && (
          <Lightbox
            index={index}
            open={index >= 0}
            close={() => setIndex(-1)}
            slides={trabajos.map(work => ({ 
              src: work.imageUrl, 
              title: work.titulo, 
              description: `Categoría: ${work.categoria.toUpperCase()}` 
            }))}
          />
        )}
      </div>
    </section>
  );
};
