import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc, writeBatch, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const useArticlesAdmin = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const addArticle = async (base64Image, data) => {
    setUploading(true);
    setProgress(50); // Fake progress since it's instant

    try {
      // 1. Obtener el orden más alto
      const q = query(collection(db, 'articulos'), orderBy('orden', 'desc'));
      const snapshot = await getDocs(q);
      const nextOrden = snapshot.empty ? 0 : snapshot.docs[0].data().orden + 1;

      setProgress(90);

      // 2. Guardar en Firestore directamente con la imagen Base64
      await addDoc(collection(db, 'articulos'), {
        ...data,
        precio: parseFloat(data.precio) || 0,
        imageUrl: base64Image, // Save the base64 string
        imagePath: null, // No longer used, kept for backwards compatibility checks
        orden: nextOrden,
        activo: true,
        createdAt: serverTimestamp()
      });

      toast.success("Artículo añadido con éxito");
      setUploading(false);
      setProgress(0);
    } catch (error) {
      toast.error("Error al guardar los datos");
      setUploading(false);
      throw error;
    }
  };

  const deleteArticle = async (id) => {
    try {
      await deleteDoc(doc(db, 'articulos', id));
      // No need to delete from Storage anymore since it's in the doc
      toast.success("Artículo eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const updateOrden = async (items) => {
    const batch = writeBatch(db);
    items.forEach((item, index) => {
      batch.update(doc(db, 'articulos', item.id), { orden: index });
    });
    try {
      await batch.commit();
      toast.success("Orden actualizado");
    } catch {
      toast.error("Error al guardar el nuevo orden");
    }
  };

  return { addArticle, deleteArticle, updateOrden, uploading, progress };
};
