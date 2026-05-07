import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-merengue-pastel">
            <h3 className="text-xl font-bold text-merengue-dark font-display">
              Editar Trabajo
            </h3>
            <button 
              onClick={onClose}
              className="p-2 bg-merengue-gray rounded-full text-merengue-text/50 hover:text-merengue-main transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="flex items-center space-x-4 mb-4 bg-merengue-gray/30 p-4 rounded-2xl">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-merengue-gray shrink-0">
                <img src={item.imageUrl} alt="preview" className="w-full h-full object-cover" />
              </div>
              <div className="text-sm text-merengue-text/60">
                La imagen no se puede cambiar desde aquí. Si necesitas otra imagen, borra este trabajo y súbelo de nuevo.
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-merengue-dark mb-2">
                Título del Trabajo
              </label>
              <input
                type="text"
                required
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-merengue-pastel focus:ring-2 focus:ring-merengue-main outline-none transition-all"
                placeholder="Ej. Pastel de Bodas con Rosas"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-merengue-dark mb-2">
                Categoría
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-merengue-pastel focus:ring-2 focus:ring-merengue-main outline-none transition-all bg-white"
              >
                <option value="boda">Bodas</option>
                <option value="xv">XV Años</option>
                <option value="cumpleaños">Cumpleaños</option>
                <option value="infantil">Infantil</option>
                <option value="galletas">Galletas y Postres</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <Button 
                type="button" 
                onClick={onClose}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Guardando...' : (
                  <>
                    <Check size={18} className="mr-2 inline" /> Guardar Cambios
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
