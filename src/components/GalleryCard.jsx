import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

export const GalleryCard = ({ item, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="relative group cursor-pointer overflow-hidden rounded-2xl bg-merengue-gray/20 shadow-md hover:shadow-2xl hover:shadow-merengue-main/20 transition-all duration-500 hover:-translate-y-1"
      onClick={() => onClick(item)}
    >
      {/* Image container with hover scaling */}
      <div className="aspect-square overflow-hidden relative">
        <motion.img
          src={item.imageUrl}
          alt={item.titulo}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Sombreado interior dinámico para dar profundidad */}
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] pointer-events-none"></div>
      </div>

      {/* Overlay - Apple style glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-t from-merengue-dark/90 via-merengue-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="backdrop-blur-md bg-white/10 rounded-2xl p-5 border border-white/20 shadow-xl"
        >
          <h3 className="text-white font-display text-xl font-bold mb-1">{item.titulo}</h3>
          <p className="text-white/80 text-sm font-sub mb-3 uppercase tracking-widest text-[10px]">{item.categoria}</p>
          
          <div className="flex items-center text-merengue-pastel text-xs font-semibold uppercase tracking-wider">
            <Eye size={16} className="mr-2" />
            <span>Ver detalles</span>
          </div>
        </motion.div>
      </div>

      {/* Ribbon/Tag for new items or specific categories */}
      {item.isFeatured && (
        <div className="absolute top-4 right-4 bg-merengue-main text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest border border-white/20">
          Destacado
        </div>
      )}
    </motion.div>
  );
};
