import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useTrabajos = (categoria = 'Todos') => {
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let q = query(collection(db, 'trabajos'), orderBy('orden', 'asc'));

    if (categoria !== 'Todos') {
      q = query(
        collection(db, 'trabajos'),
        where('categoria', '==', categoria.toLowerCase()),
        orderBy('orden', 'asc')
      );
    }

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).filter(t => t.activo !== false); // Solo activos
        
        setTrabajos(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error al cargar trabajos:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [categoria]);

  return { trabajos, loading, error };
};
