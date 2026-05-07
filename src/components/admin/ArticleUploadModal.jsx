import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle2, DollarSign } from 'lucide-react';
import { Button } from '../Button';
import { useArticlesAdmin } from '../../hooks/useArticlesAdmin';
import { ImageCropper } from './ImageCropper';

export const ArticleUploadModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [unCroppedImage, setUnCroppedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    categoria: 'moldes',
    descripcion: ''
  });

  const { addArticle, uploading, progress } = useArticlesAdmin();

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setUnCroppedImage(URL.createObjectURL(selectedFile));
      setIsCropping(true);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    maxSize: 5242880
  });

  const handleCropComplete = (croppedFile, croppedPreviewUrl) => {
    setFile(croppedFile);
    setPreview(croppedPreviewUrl);
    setIsCropping(false);
  };

  const handleCropCancel = () => {
    setUnCroppedImage(null);
    setIsCropping(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      await addArticle(file, formData);
      setFile(null);
      setPreview(null);
      setUnCroppedImage(null);
      setFormData({ nombre: '', precio: '', categoria: 'moldes', descripcion: '' });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-merengue-dark/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-merengue-gray rounded-full transition-colors z-10"
          >
            <X size={24} />
          </button>

          <div className="grid md:grid-cols-2 h-full">
            <div className={`p-10 border-r border-merengue-pastel transition-colors h-full flex flex-col justify-center
              ${isDragActive ? 'bg-merengue-pastel' : 'bg-white'}`}
            >
              {isCropping ? (
                 <ImageCropper 
                   imageSrc={unCroppedImage}
                   onCropComplete={handleCropComplete}
                   onCancel={handleCropCancel}
                 />
              ) : preview ? (
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-lg group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Button 
                       onClick={() => setIsCropping(true)}
                       className="bg-white text-merengue-dark py-2 px-4 rounded-xl"
                     >
                       Volver a recortar
                     </Button>
                  </div>
                </div>
              ) : (
                <div 
                  {...getRootProps()} 
                  className="w-full h-full min-h-[300px] border-2 border-dashed border-merengue-pastel rounded-3xl bg-merengue-gray/30 cursor-pointer flex flex-col items-center justify-center text-center p-6 hover:bg-merengue-gray/50 transition-colors"
                >
                  <input {...getInputProps()} />
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6 text-merengue-main">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-merengue-dark mb-2">Imagen del Producto</h3>
                  <p className="text-merengue-text/60 text-sm">Arrastra la foto del artículo aquí</p>
                </div>
              )}
            </div>

            <div className="p-10 overflow-y-auto max-h-[80vh]">
              <h2 className="text-2xl font-bold text-merengue-dark mb-8">Detalles del Artículo</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-merengue-dark mb-2">Nombre</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Ej. Molde de Silicón Corazón"
                    className="w-full px-4 py-3 rounded-xl border border-merengue-pastel focus:ring-2 focus:ring-merengue-main outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-merengue-dark mb-2">Precio ($)</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-merengue-text/40" />
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.precio}
                        onChange={(e) => setFormData({...formData, precio: e.target.value})}
                        placeholder="0.00"
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-merengue-pastel focus:ring-2 focus:ring-merengue-main outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-merengue-dark mb-2">Categoría</label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-merengue-pastel focus:ring-2 focus:ring-merengue-main outline-none bg-white"
                    >
                      <option value="moldes">Moldes</option>
                      <option value="ingredientes">Ingredientes</option>
                      <option value="herramientas">Herramientas</option>
                      <option value="capacillos">Capacillos</option>
                      <option value="otros">Otros</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-merengue-dark mb-2">Descripción (Opcional)</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Describe el producto..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-merengue-pastel focus:ring-2 focus:ring-merengue-main outline-none resize-none"
                  />
                </div>

                <div className="pt-4">
                  {uploading ? (
                    <div className="space-y-2">
                      <div className="w-full h-3 bg-merengue-gray rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-merengue-main"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-center text-xs text-merengue-text/60">Subiendo... {Math.round(progress)}%</p>
                    </div>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={!file || isCropping}
                      className="w-full rounded-2xl py-4 flex items-center justify-center space-x-2"
                    >
                      <span>Guardar Artículo</span>
                      <CheckCircle2 size={20} />
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
