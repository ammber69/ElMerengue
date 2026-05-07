import { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, ShoppingBag, Loader2 } from 'lucide-react';
import { useArticulos } from '../../hooks/useArticulos';
import { useArticlesAdmin } from '../../hooks/useArticlesAdmin';

const SortableArticle = ({ item, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="group bg-white border border-merengue-pastel rounded-2xl p-4 mb-3 flex items-center shadow-sm hover:shadow-md transition-shadow"
    >
      <button 
        {...attributes} 
        {...listeners}
        className="p-2 text-merengue-text/40 hover:text-merengue-main cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={20} />
      </button>

      <div className="w-16 h-16 rounded-xl overflow-hidden bg-merengue-gray ml-2">
        <img src={item.imageUrl} alt={item.nombre} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 ml-4">
        <div className="flex items-center space-x-2">
          <h4 className="font-bold text-merengue-dark leading-tight">{item.nombre}</h4>
          <span className="text-merengue-main font-bold text-sm">${item.precio}</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-merengue-main bg-merengue-pastel/50 px-2 py-0.5 rounded-full">
            {item.categoria}
          </span>
          <p className="text-xs text-merengue-text/40 truncate max-w-[200px]">{item.descripcion}</p>
        </div>
      </div>

      <button 
        onClick={() => onDelete(item.id)}
        className="p-3 text-merengue-text/30 hover:text-red-500 transition-colors"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export const ArticlesManager = () => {
  const { articulos, loading } = useArticulos();
  const { deleteArticle, updateOrden } = useArticlesAdmin();
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Sync local items if the length differs to avoid blocking new items
    if (articulos && articulos.length !== items.length) {
      setItems(articulos);
    }
  }, [articulos, items.length]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      const newArray = arrayMove(items, oldIndex, newIndex);
      setItems(newArray);
      updateOrden(newArray);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-merengue-text/40">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p>Cargando artículos...</p>
    </div>
  );

  if (items.length === 0) return (
    <div className="text-center py-20 bg-merengue-gray/30 rounded-3xl border-2 border-dashed border-merengue-pastel">
      <ShoppingBag className="text-merengue-main/20 mx-auto mb-4" size={48} />
      <h3 className="text-xl font-bold text-merengue-dark">No hay artículos en el catálogo</h3>
      <p className="text-merengue-text/60">Añade productos para que tus clientes puedan verlos</p>
    </div>
  );

  return (
    <div className="max-w-3xl">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {items.map(item => (
            <SortableArticle key={item.id} item={item} onDelete={deleteArticle} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
