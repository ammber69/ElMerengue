import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export const ArticleCard = ({ item }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white rounded-3xl overflow-hidden border border-merengue-pastel hover:shadow-2xl hover:shadow-merengue-main/20 transition-all duration-500 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-merengue-gray/20">
        <img 
          src={item.imageUrl} 
          alt={item.nombre} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Sombreado interior dinámico para dar profundidad */}
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] pointer-events-none rounded-t-3xl"></div>
        
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/80 backdrop-blur-xl border border-white/50 text-merengue-main text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-black/5">
            {item.categoria}
          </span>
        </div>
      </div>

      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-merengue-dark leading-tight group-hover:text-merengue-main transition-colors duration-300">
            {item.nombre}
          </h3>
          <span className="text-xl font-black text-merengue-main bg-merengue-main/10 px-3 py-1 rounded-xl">${item.precio}</span>
        </div>
        
        <p className="text-merengue-text/70 text-sm line-clamp-2 mb-6 h-10">
          {item.descripcion || "Consulte disponibilidad y variedades en tienda."}
        </p>

        <a 
          href={`https://wa.me/522713138307?text=Hola! Me interesa el producto: ${item.nombre}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-merengue-gray/50 hover:bg-merengue-main hover:text-white text-merengue-dark font-bold py-3.5 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 active:scale-95"
        >
          <ShoppingCart size={18} />
          <span>Lo quiero</span>
        </a>
      </div>
    </motion.div>
  );
};
