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
import { Trash2, GripVertical, Image as ImageIcon, Loader2, Edit2 } from 'lucide-react';
import { useTrabajos } from '../../hooks/useTrabajos';
import { useGalleryAdmin } from '../../hooks/useGalleryAdmin';
import { EditTrabajoModal } from './EditTrabajoModal';

const SortableItem = ({ item, onDelete, onEdit }) => {
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
        <img src={item.imageUrl} alt={item.titulo} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 ml-4">
        <h4 className="font-bold text-merengue-dark leading-tight">{item.titulo}</h4>
        <span className="text-xs font-medium uppercase tracking-wider text-merengue-main bg-merengue-pastel/50 px-2 py-0.5 rounded-full mt-1 inline-block">
          {item.categoria}
        </span>
      </div>

      <div className="flex space-x-1">
        <button 
          onClick={() => onEdit(item)}
          className="p-3 text-merengue-text/30 hover:text-blue-500 transition-colors"
        >
          <Edit2 size={20} />
        </button>
        <button 
          onClick={() => onDelete(item.id, item.imagePath)}
          className="p-3 text-merengue-text/30 hover:text-red-500 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export const GalleryManager = () => {
  const { trabajos, loading } = useTrabajos();
  const { deleteTrabajo, updateOrden } = useGalleryAdmin();
  const [items, setItems] = useState([]);
  
  // Edit state
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    // If we have items from Firebase, and they differ in length from our local state,
    // it means an item was added or deleted. We sync local state.
    // We avoid doing this blindly on every render to not break the Drag and Drop order.
    if (trabajos && trabajos.length !== items.length) {
      setItems(trabajos);
    }
  }, [trabajos, items.length]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleCloseEdit = () => {
    setEditingItem(null);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-merengue-text/40">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p>Cargando galería...</p>
    </div>
  );

  if (items.length === 0) return (
    <div className="text-center py-20 bg-merengue-gray/30 rounded-3xl border-2 border-dashed border-merengue-pastel">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
        <ImageIcon className="text-merengue-main" size={32} />
      </div>
      <h3 className="text-xl font-bold text-merengue-dark">No hay trabajos aún</h3>
      <p className="text-merengue-text/60">Haz clic en "Añadir Trabajo" para empezar</p>
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-merengue-text/60 font-medium">
          Mostrando {items.length} trabajos. Arrastra para reordenar.
        </p>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map(item => (
            <SortableItem key={item.id} item={item} onDelete={deleteTrabajo} onEdit={handleEdit} />
          ))}
        </SortableContext>
      </DndContext>

      <EditTrabajoModal 
        isOpen={!!editingItem} 
        onClose={handleCloseEdit} 
        item={editingItem} 
      />
    </div>
  );
};
