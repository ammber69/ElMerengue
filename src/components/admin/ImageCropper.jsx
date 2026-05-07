import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Check, X } from 'lucide-react';
import { Button } from '../Button';
import getCroppedImg from '../../utils/cropImage';

export const ImageCropper = ({ imageSrc, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsCropping(true);
      // Now getCroppedImg returns a Base64 string directly
      const base64Image = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      // Pass the base64 string as both the "file" (to be saved to Firestore) and the preview
      onCropComplete(base64Image, base64Image);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-merengue-gray/30 p-6 rounded-3xl relative overflow-hidden min-h-[400px]">
      <div className="absolute top-0 left-0 right-0 bottom-24 bg-black/10 rounded-2xl overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1} // 1:1 aspect ratio
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
          cropShape="rect"
          showGrid={true}
        />
      </div>
      
      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-bold text-merengue-dark">Zoom</span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(e.target.value)}
            className="w-full accent-merengue-main"
          />
        </div>
        <div className="flex justify-between space-x-4">
          <Button 
            onClick={onCancel} 
            className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 py-3 rounded-xl flex items-center justify-center"
            disabled={isCropping}
          >
            <X size={18} className="mr-2" /> Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            className="flex-1 py-3 rounded-xl flex items-center justify-center"
            disabled={isCropping}
          >
            {isCropping ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Check size={18} className="mr-2" /> Aplicar Recorte
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
