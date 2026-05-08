import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Pencil } from 'lucide-react';
import { Button } from '../Button';
import { useGalleryAdmin } from '../../hooks/useGalleryAdmin';

export const EditTrabajoModal = ({ isOpen, onClose, item }) => {
  const { updateTrabajo } = useGalleryAdmin();
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: 'boda',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        titulo: item.titulo || '',
        categoria: item.categoria || 'boda'
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo) return;

    setIsSaving(true);
    try {
      await updateTrabajo(item.id, formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-merengue-dark/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-8 border-b border-merengue-pastel bg-merengue-gray/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-merengue-main shadow-sm">
                <Pencil size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-merengue-dark font-display">
                  Editar Trabajo
                </h3>
                <p className="text-xs text-merengue-text/40 uppercase tracking-widest font-bold">Modificando detalles</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-white rounded-full text-merengue-text/30 hover:text-merengue-main hover:rotate-90 transition-all duration-300 shadow-sm border border-merengue-pastel"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {/* Visual Preview (Read-only) */}
            <div className="flex items-center space-x-6 bg-merengue-gray/20 p-6 rounded-[2rem] border border-merengue-pastel">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-md border-2 border-white shrink-0">
                <img src={item.imageUrl} alt="preview" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-merengue-dark">Imagen Actual</h4>
                <p className="text-sm text-merengue-text/60 leading-tight">
                  Para cambiar la imagen, es necesario borrar este trabajo y publicar uno nuevo con el encuadre deseado.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-merengue-dark ml-1">
                  Título del Trabajo
                </label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-merengue-gray focus:border-merengue-main outline-none transition-all text-lg"
                  placeholder="Ej. Pastel de Bodas con Rosas"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-merengue-dark ml-1">
                  Categoría
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-merengue-gray focus:border-merengue-main outline-none transition-all bg-white text-lg cursor-pointer appearance-none"
                >
                  <option value="boda">🍰 Bodas</option>
                  <option value="xv">👑 XV Años</option>
                  <option value="cumpleaños">🎈 Cumpleaños</option>
                  <option value="infantil">🧸 Infantil</option>
                  <option value="galletas">🍪 Galletas y Postres</option>
                  <option value="otros">✨ Otros</option>
                </select>
              </div>
            </div>

            <div className="pt-6 flex justify-end space-x-4">
              <Button 
                type="button" 
                onClick={onClose}
                variant="outline"
                className="px-8 border-merengue-pastel text-merengue-text/60 hover:bg-merengue-gray/30"
              >
                Descartar
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
                className="px-10 shadow-xl shadow-merengue-main/20"
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Guardando...</span>
                  </div>
                ) : (
                  <>
                    <Check size={18} className="mr-2" /> Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
