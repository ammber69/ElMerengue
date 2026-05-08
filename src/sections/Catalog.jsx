import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArticleCard } from '../components/ArticleCard';
import { useArticulos } from '../hooks/useArticulos';
import { ShoppingBag, Loader2, Sparkles } from 'lucide-react';

const CATEGORIES = ['Todos', 'Moldes', 'Ingredientes', 'Herramientas', 'Capacillos', 'Otros'];

export const Catalog = () => {
  const [filter, setFilter] = useState('Todos');
  const { articulos, loading } = useArticulos(filter);

  return (
    <section id="catalogo" className="snap-start min-h-screen py-24 bg-merengue-gray/30 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-merengue-main/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-merengue-main/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <Sparkles className="text-merengue-main" size={20} />
            <span className="text-merengue-main font-bold text-sm uppercase tracking-widest">Suministros de Calidad</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-merengue-dark mb-4"
          >
            Catálogo de Repostería
          </motion.h2>
          <div className="w-24 h-1.5 bg-merengue-main mx-auto rounded-full mb-10" />
          
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border-2 ${
                  filter === cat 
                    ? 'bg-merengue-main border-merengue-main text-white shadow-xl shadow-merengue-main/20 scale-105' 
                    : 'bg-white border-merengue-pastel text-merengue-text hover:border-merengue-main hover:text-merengue-main'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="text-merengue-main animate-spin mb-4" size={48} />
            <p className="text-merengue-text font-medium italic">Preparando el catálogo...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {articulos.map((item) => (
                <ArticleCard key={item.id} item={item} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && articulos.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-[3rem] border border-merengue-pastel shadow-sm"
          >
            <ShoppingBag className="text-merengue-main/20 mx-auto mb-6" size={64} />
            <p className="text-merengue-text/60 text-lg font-medium">No encontramos artículos en esta categoría.</p>
            <button 
              onClick={() => setFilter('Todos')}
              className="mt-6 text-merengue-main font-bold hover:underline"
            >
              Ver todos los productos
            </button>
          </motion.div>
        )}

        <div className="mt-20 text-center">
          <p className="text-merengue-text/60 mb-6 italic font-medium">¿Buscas algo específico que no está en la lista?</p>
          <a 
            href="#contacto" 
            className="inline-flex items-center space-x-2 text-merengue-dark font-bold border-b-2 border-merengue-main pb-1 hover:text-merengue-main transition-colors"
          >
            <span>Contáctanos directamente</span>
          </a>
        </div>
      </div>
    </section>
  );
};
