import { useState } from 'react';
import { db, storage } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc, writeBatch, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import toast from 'react-hot-toast';

export const useGalleryAdmin = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const addTrabajo = async (file, data) => {
    setUploading(true);
    setProgress(0);

    try {
      // 1. Obtener el orden más alto actual
      const q = query(collection(db, 'trabajos'), orderBy('orden', 'desc'));
      const snapshot = await getDocs(q);
      const nextOrden = snapshot.empty ? 0 : snapshot.docs[0].data().orden + 1;

      // 2. Subir imagen a Storage
      const storageRef = ref(storage, `trabajos/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(p);
          },
          (error) => {
            console.error("Error subiendo imagen:", error);
            toast.error("Error al subir la imagen");
            setUploading(false);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // 3. Guardar en Firestore
            await addDoc(collection(db, 'trabajos'), {
              ...data,
              imageUrl: downloadURL,
              imagePath: storageRef.fullPath,
              orden: nextOrden,
              activo: true,
              createdAt: serverTimestamp()
            });

            toast.success("Trabajo añadido con éxito");
            setUploading(false);
            setProgress(0);
            resolve();
          }
        );
      });
    } catch (error) {
      console.error("Error en addTrabajo:", error);
      toast.error("Error al guardar los datos");
      setUploading(false);
      throw error;
    }
  };

  const deleteTrabajo = async (id, imagePath) => {
    try {
      // 1. Eliminar de Firestore
      await deleteDoc(doc(db, 'trabajos', id));

      // 2. Eliminar de Storage
      if (imagePath) {
        const storageRef = ref(storage, imagePath);
        await deleteObject(storageRef);
      }

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

  return { addTrabajo, deleteTrabajo, updateOrden, uploading, progress };
};
