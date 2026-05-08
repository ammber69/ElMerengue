import { motion } from 'framer-motion';
import { Eye, Heart } from 'lucide-react';

export const GalleryCard = ({ item, onClick }) => {
  // Variants for coordinated animations
  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    hover: { 
      y: -8,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.15,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const overlayVariants = {
    initial: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const infoVariants = {
    initial: { y: 30, opacity: 0 },
    hover: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        delay: 0.1,
        ease: "easeOut" 
      }
    }
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-merengue-gray shadow-lg hover:shadow-2xl hover:shadow-merengue-main/20 transition-shadow duration-500"
      onClick={() => onClick(item)}
    >
      {/* Image container */}
      <div className="aspect-square overflow-hidden relative">
        <motion.img
          variants={imageVariants}
          src={item.imageUrl}
          alt={item.titulo}
          className="w-full h-full object-cover"
        />
        
        {/* Pink Tint Overlay - More prominent as requested */}
        <motion.div 
          variants={overlayVariants}
          className="absolute inset-0 bg-gradient-to-t from-merengue-main/90 via-merengue-main/40 to-merengue-main/10 backdrop-blur-[2px]"
        />

        {/* Interior shadow for depth */}
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.1)] pointer-events-none" />
      </div>

      {/* Info Container - Now appears automatically on hover */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 pointer-events-none">
        <motion.div 
          variants={infoVariants}
          className="backdrop-blur-xl bg-white/20 rounded-[2rem] p-6 border border-white/30 shadow-2xl"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-display text-2xl font-bold leading-tight">{item.titulo}</h3>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white">
              <Heart size={16} fill="currentColor" className="opacity-80" />
            </div>
          </div>
          
          <p className="text-white/90 text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center">
            <span className="w-2 h-2 bg-merengue-pastel rounded-full mr-2" />
            {item.categoria}
          </p>
          
          <div className="flex items-center text-white text-xs font-bold uppercase tracking-widest pt-4 border-t border-white/10 group">
            <Eye size={18} className="mr-2 group-hover:scale-125 transition-transform" />
            <span>Explorar creación</span>
          </div>
        </motion.div>
      </div>

      {/* Featured Badge */}
      {item.isFeatured && (
        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-merengue-main text-[10px] font-black px-5 py-2 rounded-full shadow-xl uppercase tracking-[0.2em] border border-merengue-pastel">
          Destacado
        </div>
      )}
    </motion.div>
  );
};
