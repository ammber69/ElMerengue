import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, deleteDoc, updateDoc, doc, writeBatch, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const useGalleryAdmin = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const addTrabajo = async (base64Image, data) => {
    setUploading(true);
    setProgress(50); // Fake progress

    try {
      // 1. Obtener el orden más alto actual
      const q = query(collection(db, 'trabajos'), orderBy('orden', 'desc'));
      const snapshot = await getDocs(q);
      const nextOrden = snapshot.empty ? 0 : snapshot.docs[0].data().orden + 1;

      setProgress(90);

      // 2. Guardar en Firestore directamente con la imagen Base64
      await addDoc(collection(db, 'trabajos'), {
        ...data,
        imageUrl: base64Image, // Save the base64 string
        imagePath: null, // No longer used
        orden: nextOrden,
        activo: true,
        createdAt: serverTimestamp()
      });

      toast.success("Trabajo añadido con éxito");
      setUploading(false);
      setProgress(0);
    } catch (error) {
      console.error("Error en addTrabajo:", error);
      toast.error("Error al guardar los datos");
      setUploading(false);
      throw error;
    }
  };

  const updateTrabajo = async (id, data) => {
    try {
      await updateDoc(doc(db, 'trabajos', id), data);
      toast.success("Trabajo actualizado");
    } catch (error) {
      console.error("Error actualizando trabajo:", error);
      toast.error("Error al actualizar");
    }
  };

  const deleteTrabajo = async (id) => {
    try {
      // 1. Eliminar de Firestore
      await deleteDoc(doc(db, 'trabajos', id));
      // No need to delete from Storage anymore

      toast.success("Trabajo eliminado");
    } catch (error) {
      console.error("Error eliminando trabajo:", error);
      toast.error("Error al eliminar");
    }
  };

  const updateOrden = async (items) => {
    const batch = writeBatch(db);
    items.forEach((item, index) => {
      const docRef = doc(db, 'trabajos', item.id);
      batch.update(docRef, { orden: index });
    });

    try {
      await batch.commit();
      toast.success("Orden actualizado");
    } catch (error) {
      console.error("Error actualizando orden:", error);
      toast.error("Error al guardar el nuevo orden");
    }
  };

  return { addTrabajo, updateTrabajo, deleteTrabajo, updateOrden, uploading, progress };
};
