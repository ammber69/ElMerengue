import { useState } from 'react';
import { db, storage } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc, writeBatch, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import toast from 'react-hot-toast';

export const useArticlesAdmin = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const addArticle = async (file, data) => {
    setUploading(true);
    setProgress(0);

    try {
      // 1. Obtener el orden más alto
      const q = query(collection(db, 'articulos'), orderBy('orden', 'desc'));
      const snapshot = await getDocs(q);
      const nextOrden = snapshot.empty ? 0 : snapshot.docs[0].data().orden + 1;

      // 2. Subir imagen
      const storageRef = ref(storage, `articulos/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(p);
          },
          (error) => {
            toast.error("Error al subir la imagen");
            setUploading(false);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // 3. Guardar en Firestore
            await addDoc(collection(db, 'articulos'), {
              ...data,
              precio: parseFloat(data.precio) || 0,
              imageUrl: downloadURL,
              imagePath: storageRef.fullPath,
              orden: nextOrden,
              activo: true,
              createdAt: serverTimestamp()
            });

            toast.success("Artículo añadido con éxito");
            setUploading(false);
            setProgress(0);
            resolve();
          }
        );
      });
    } catch (error) {
      toast.error("Error al guardar los datos");
      setUploading(false);
      throw error;
    }
  };

  const deleteArticle = async (id, imagePath) => {
    try {
      await deleteDoc(doc(db, 'articulos', id));
      if (imagePath) {
        await deleteObject(ref(storage, imagePath));
      }
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

