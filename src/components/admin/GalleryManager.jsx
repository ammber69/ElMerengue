import { useState, useEffect, useMemo } from 'react';
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
import { Trash2, GripVertical, Image as ImageIcon, Loader2, Edit2, ChevronRight } from 'lucide-react';
import { useTrabajos } from '../../hooks/useTrabajos';
import { useGalleryAdmin } from '../../hooks/useGalleryAdmin';
import { EditTrabajoModal } from './EditTrabajoModal';

const CATEGORIES = [
  { id: 'boda', label: 'Bodas' },
  { id: 'xv', label: 'XV Años' },
  { id: 'cumpleaños', label: 'Cumpleaños' },
  { id: 'infantil', label: 'Infantil' },
  { id: 'galletas', label: 'Galletas y Postres' },
  { id: 'otros', label: 'Otros' }
];

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
      className="group bg-white border border-merengue-pastel rounded-2xl p-4 mb-3 flex items-center shadow-sm hover:shadow-md transition-all duration-300"
    >
      <button 
        {...attributes} 
        {...listeners}
        className="p-2 text-merengue-text/20 hover:text-merengue-main cursor-grab active:cursor-grabbing transition-colors"
      >
        <GripVertical size={20} />
      </button>

      <div className="w-16 h-16 rounded-xl overflow-hidden bg-merengue-gray ml-2 shadow-inner border border-merengue-pastel">
        <img src={item.imageUrl} alt={item.titulo} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 ml-5">
        <h4 className="font-bold text-merengue-dark text-lg leading-tight">{item.titulo}</h4>
        <div className="flex items-center mt-1 space-x-2">
           <span className="text-[10px] font-black uppercase tracking-widest text-merengue-main bg-merengue-pastel/30 px-2 py-0.5 rounded-md">
            {item.categoria}
          </span>
        </div>
      </div>

      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(item)}
          className="p-3 text-merengue-text/30 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
        >
          <Edit2 size={20} />
        </button>
        <button 
          onClick={() => onDelete(item.id)}
          className="p-3 text-merengue-text/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (trabajos) {
      setItems(trabajos);
    }
  }, [trabajos]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const groupedItems = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = items.filter(item => item.categoria === cat.id);
      return acc;
    }, {});
  }, [items]);

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

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-merengue-text/20">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="font-bold uppercase tracking-widest text-xs">Cargando creaciones...</p>
    </div>
  );

  return (
    <div className="max-w-4xl">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {CATEGORIES.map(cat => {
          const categoryItems = groupedItems[cat.id];
          if (categoryItems.length === 0) return null;

          return (
            <div key={cat.id} className="mb-12">
              <div className="flex items-center space-x-2 mb-6 ml-1">
                <ChevronRight size={18} className="text-merengue-main" />
                <h3 className="text-xl font-display font-bold text-merengue-dark uppercase tracking-wide">
                  {cat.label}
                </h3>
                <span className="bg-merengue-gray px-2 py-0.5 rounded-lg text-[10px] font-bold text-merengue-text/40">
                  {categoryItems.length}
                </span>
              </div>

              <SortableContext 
                items={categoryItems.map(i => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {categoryItems.map(item => (
                    <SortableItem 
                      key={item.id} 
                      item={item} 
                      onDelete={deleteTrabajo} 
                      onEdit={handleEdit} 
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </DndContext>

      <EditTrabajoModal 
        isOpen={!!editingItem} 
        onClose={() => setEditingItem(null)} 
        item={editingItem} 
      />

      {items.length === 0 && (
        <div className="text-center py-24 bg-merengue-gray/20 rounded-[3rem] border-4 border-dashed border-merengue-pastel">
          <ImageIcon className="text-merengue-main/20 mx-auto mb-6" size={64} />
          <h3 className="text-2xl font-display font-bold text-merengue-dark">La galería está vacía</h3>
          <p className="text-merengue-text/50 mt-2">Es momento de subir tus mejores pasteles</p>
        </div>
      )}
    </div>
  );
};
