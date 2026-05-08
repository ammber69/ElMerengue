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
import { Trash2, GripVertical, ShoppingBag, Loader2, ChevronRight, Tag } from 'lucide-react';
import { useArticulos } from '../../hooks/useArticulos';
import { useArticlesAdmin } from '../../hooks/useArticlesAdmin';

const ARTICLE_CATEGORIES = [
  { id: 'moldes', label: 'Moldes' },
  { id: 'ingredientes', label: 'Ingredientes' },
  { id: 'herramientas', label: 'Herramientas' },
  { id: 'capacillos', label: 'Capacillos' },
  { id: 'otros', label: 'Otros' }
];

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
      className="group bg-white border border-merengue-pastel rounded-2xl p-4 mb-3 flex items-center shadow-sm hover:shadow-md transition-all duration-300"
    >
      <button 
        {...attributes} 
        {...listeners}
        className="p-2 text-merengue-text/20 hover:text-merengue-main cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={20} />
      </button>

      <div className="w-16 h-16 rounded-xl overflow-hidden bg-merengue-gray ml-2 shadow-inner border border-merengue-pastel">
        <img src={item.imageUrl} alt={item.nombre} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 ml-5">
        <div className="flex items-center space-x-3">
          <h4 className="font-bold text-merengue-dark text-lg leading-tight">{item.nombre}</h4>
          <span className="text-merengue-main font-black text-lg bg-merengue-pastel/20 px-3 py-0.5 rounded-lg border border-merengue-pastel shadow-sm">
            ${item.precio}
          </span>
        </div>
        <div className="flex items-center space-x-3 mt-1.5">
          <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-merengue-text/40 bg-merengue-gray px-2 py-0.5 rounded-md">
            <Tag size={10} className="mr-1" />
            {item.categoria}
          </div>
          <p className="text-xs text-merengue-text/40 truncate max-w-[300px] font-medium italic">
            {item.descripcion || "Sin descripción"}
          </p>
        </div>
      </div>

      <button 
        onClick={() => onDelete(item.id)}
        className="p-3 text-merengue-text/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
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
    if (articulos) {
      setItems(articulos);
    }
  }, [articulos]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const groupedItems = useMemo(() => {
    return ARTICLE_CATEGORIES.reduce((acc, cat) => {
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-merengue-text/20">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="font-bold uppercase tracking-widest text-xs">Cargando catálogo...</p>
    </div>
  );

  return (
    <div className="max-w-4xl">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {ARTICLE_CATEGORIES.map(cat => {
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
                    <SortableArticle 
                      key={item.id} 
                      item={item} 
                      onDelete={deleteArticle} 
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </DndContext>

      {items.length === 0 && (
        <div className="text-center py-24 bg-merengue-gray/20 rounded-[3rem] border-4 border-dashed border-merengue-pastel">
          <ShoppingBag className="text-merengue-main/20 mx-auto mb-6" size={64} />
          <h3 className="text-2xl font-display font-bold text-merengue-dark">Catálogo vacío</h3>
          <p className="text-merengue-text/50 mt-2">Empieza a añadir artículos para la venta</p>
        </div>
      )}
    </div>
  );
};
