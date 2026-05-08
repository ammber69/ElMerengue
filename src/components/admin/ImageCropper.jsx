import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Check, X, ZoomIn, ZoomOut } from 'lucide-react';
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
      const base64Image = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(base64Image, base64Image);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Cropper Container */}
      <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden bg-merengue-gray/20 border-2 border-merengue-pastel shadow-inner">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
          cropShape="rect"
          showGrid={true}
          style={{
            containerStyle: { borderRadius: '2rem' }
          }}
        />
      </div>
      
      {/* Controls Container */}
      <div className="bg-merengue-gray/10 p-5 rounded-[2rem] border border-merengue-pastel space-y-4">
        <div className="flex items-center space-x-4">
          <ZoomOut size={16} className="text-merengue-text/40" />
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="flex-1 accent-merengue-main h-1.5 bg-merengue-pastel rounded-full appearance-none cursor-pointer"
          />
          <ZoomIn size={16} className="text-merengue-main" />
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={onCancel} 
            variant="outline"
            className="flex-1 py-3 px-0 border-merengue-pastel text-merengue-text/60 hover:bg-white hover:text-red-500 hover:border-red-200 transition-all duration-300"
            disabled={isCropping}
          >
            <X size={18} className="mr-2" /> Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            className="flex-1 py-3 px-0 shadow-lg shadow-merengue-main/20"
            disabled={isCropping}
          >
            {isCropping ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Check size={18} className="mr-2" /> Aplicar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
