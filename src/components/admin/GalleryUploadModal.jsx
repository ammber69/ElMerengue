import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../Button';
import { useGalleryAdmin } from '../../hooks/useGalleryAdmin';
import { ImageCropper } from './ImageCropper';

export const GalleryUploadModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [unCroppedImage, setUnCroppedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    categoria: 'boda'
  });

  const { addTrabajo, uploading, progress } = useGalleryAdmin();

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
    maxSize: 5242880 // 5MB
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
      await addTrabajo(file, formData);
      setFile(null);
      setPreview(null);
      setUnCroppedImage(null);
      setFormData({ titulo: '', categoria: 'boda' });
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
            {/* Left side: Upload/Crop Area */}
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
                  <h3 className="text-2xl font-display font-bold text-merengue-dark mb-3">Sube tu creación</h3>
                  <p className="text-merengue-text/60 text-lg leading-relaxed px-4">Arrastra una foto aquí o haz clic para seleccionar</p>
                  <div className="mt-8 flex items-center space-x-2 text-merengue-text/30 text-xs uppercase tracking-widest font-bold">
                    <span>JPG</span>
                    <span className="w-1 h-1 bg-merengue-text/20 rounded-full" />
                    <span>PNG</span>
                    <span className="w-1 h-1 bg-merengue-text/20 rounded-full" />
                    <span>WEBP</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Form Area */}
            <div className="p-12 flex flex-col">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-merengue-pastel rounded-xl flex items-center justify-center text-merengue-main">
                  <Sparkles size={20} />
                </div>
                <span className="text-merengue-main font-bold text-sm uppercase tracking-widest">Nueva Publicación</span>
              </div>
              <h2 className="text-4xl font-display font-bold text-merengue-dark mb-10">Detalles del Trabajo</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8 flex-1 flex flex-col">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-merengue-dark ml-1">Título de la creación</label>
                  <input
                    type="text"
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    placeholder="Ej. Pastel de Bodas Elegante"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-merengue-gray focus:border-merengue-main outline-none transition-all text-lg placeholder:text-merengue-text/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-merengue-dark ml-1">¿En qué categoría encaja?</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-merengue-gray focus:border-merengue-main outline-none transition-all appearance-none bg-white text-lg cursor-pointer"
                  >
                    <option value="boda">🍰 Bodas</option>
                    <option value="xv">👑 XV Años</option>
                    <option value="cumpleaños">🎈 Cumpleaños</option>
                    <option value="infantil">🧸 Infantil</option>
                    <option value="galletas">🍪 Galletas y Postres</option>
                    <option value="otros">✨ Otros</option>
                  </select>
                </div>

                <div className="mt-auto pt-10">
                  {uploading ? (
                    <div className="space-y-4">
                      <div className="w-full h-4 bg-merengue-gray rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-merengue-main to-merengue-pastel"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-center text-sm text-merengue-main font-bold animate-pulse">
                        Endulzando la base de datos... {Math.round(progress)}%
                      </p>
                    </div>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={!file || isCropping}
                      className="w-full rounded-[1.5rem] py-5 text-xl font-bold flex items-center justify-center space-x-3 shadow-2xl shadow-merengue-main/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                    >
                      <span>Publicar Trabajo</span>
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
