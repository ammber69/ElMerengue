import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle2, DollarSign, Sparkles } from 'lucide-react';
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
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-merengue-dark/60 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 hover:bg-merengue-gray rounded-full transition-all duration-300 z-10 hover:rotate-90 group"
          >
            <X size={24} className="text-merengue-dark group-hover:text-merengue-main" />
          </button>

          <div className="grid md:grid-cols-2 min-h-[500px]">
            {/* Left side: Upload Area */}
            <div className={`p-12 border-r border-merengue-pastel transition-colors h-full flex flex-col justify-center
              ${isDragActive ? 'bg-merengue-pastel/20' : 'bg-white'}`}
            >
              {isCropping ? (
                 <ImageCropper 
                   imageSrc={unCroppedImage}
                   onCropComplete={handleCropComplete}
                   onCancel={handleCropCancel}
                 />
              ) : preview ? (
                <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden shadow-2xl group border-2 border-merengue-pastel">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-merengue-dark/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                     <Button 
                       onClick={() => setIsCropping(true)}
                       variant="outline"
                       className="bg-white text-merengue-dark py-3 px-6 rounded-2xl border-none shadow-xl hover:scale-110 transition-transform"
                     >
                       Volver a recortar
                     </Button>
                  </div>
                </div>
              ) : (
                <div 
                  {...getRootProps()} 
                  className="w-full h-full min-h-[400px] border-4 border-dashed border-merengue-pastel rounded-[3rem] bg-merengue-gray/20 cursor-pointer flex flex-col items-center justify-center text-center p-8 hover:bg-merengue-pastel/10 hover:border-merengue-main/50 transition-all duration-500 group"
                >
                  <input {...getInputProps()} />
                  <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl mb-8 text-merengue-main group-hover:scale-110 transition-transform duration-500">
                    <Upload size={40} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-merengue-dark mb-3">Imagen del Artículo</h3>
                  <p className="text-merengue-text/60 text-lg leading-relaxed px-4">Arrastra la foto del producto aquí o haz clic para seleccionar</p>
                </div>
              )}
            </div>

            {/* Right side: Form Area */}
            <div className="p-12 flex flex-col overflow-y-auto max-h-[90vh]">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-merengue-pastel rounded-xl flex items-center justify-center text-merengue-main">
                  <Sparkles size={20} />
                </div>
                <span className="text-merengue-main font-bold text-sm uppercase tracking-widest">Nuevo Artículo</span>
              </div>
              <h2 className="text-4xl font-display font-bold text-merengue-dark mb-10">Detalles del Artículo</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-merengue-dark ml-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Ej. Molde de Silicón Corazón"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-merengue-gray focus:border-merengue-main outline-none transition-all text-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-merengue-dark ml-1">Precio ($)</label>
                    <div className="relative">
                      <DollarSign size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-merengue-text/40" />
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.precio}
                        onChange={(e) => setFormData({...formData, precio: e.target.value})}
                        placeholder="0.00"
                        className="w-full pl-11 pr-5 py-4 rounded-2xl border-2 border-merengue-gray focus:border-merengue-main outline-none transition-all text-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-merengue-dark ml-1">Categoría</label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-merengue-gray focus:border-merengue-main outline-none bg-white text-lg cursor-pointer appearance-none"
                    >
                      <option value="moldes">Moldes</option>
                      <option value="ingredientes">Ingredientes</option>
                      <option value="herramientas">Herramientas</option>
                      <option value="capacillos">Capacillos</option>
                      <option value="otros">Otros</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-merengue-dark ml-1">Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Describe el producto brevemente..."
                    rows={4}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-merengue-gray focus:border-merengue-main outline-none transition-all text-lg resize-none"
                  />
                </div>

                <div className="mt-auto pt-8">
                  {uploading ? (
                    <div className="space-y-4">
                      <div className="w-full h-4 bg-merengue-gray rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-merengue-main to-merengue-pastel"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-center text-sm text-merengue-main font-bold">Subiendo... {Math.round(progress)}%</p>
                    </div>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={!file || isCropping}
                      className="w-full rounded-[1.5rem] py-5 text-xl font-bold flex items-center justify-center space-x-3 shadow-2xl shadow-merengue-main/30"
                    >
                      <span>Guardar Artículo</span>
                      <CheckCircle2 size={24} />
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
