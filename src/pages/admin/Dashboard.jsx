import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { Image as ImageIcon, ShoppingBag, LogOut, Plus } from 'lucide-react';
import { Button } from '../../components/Button';
import { GalleryManager } from '../../components/admin/GalleryManager';
import { GalleryUploadModal } from '../../components/admin/GalleryUploadModal';
import { ArticlesManager } from '../../components/admin/ArticlesManager';
import { ArticleUploadModal } from '../../components/admin/ArticleUploadModal';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Sesión cerrada');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const navItems = [
    { id: 'gallery', label: 'Galería de Trabajos', icon: <ImageIcon size={20} /> },
    { id: 'articles', label: 'Catálogo de Artículos', icon: <ShoppingBag size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-merengue-gray flex">
      {/* Sidebar */}
      <aside className="w-72 bg-merengue-dark text-white p-8 flex flex-col fixed h-full">
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-merengue-main to-pink-300 bg-clip-text text-transparent">
            Merengue
          </h2>
          <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mt-2">Control Panel v1.0</p>
        </div>

        <nav className="flex-1 space-y-3">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-merengue-main shadow-xl shadow-merengue-main/20 text-white' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`${activeTab === item.id ? 'text-white' : 'text-merengue-main/60'}`}>
                {item.icon}
              </div>
              <span className="font-semibold tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center space-x-4 px-5 py-4 rounded-2xl hover:bg-red-500/10 text-red-400/80 hover:text-red-400 transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="font-semibold tracking-tight">Cerrar Sesión</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12 overflow-y-auto min-h-screen">
        <header className="flex justify-between items-end mb-12">
          <div>
            <span className="text-merengue-main font-bold text-xs uppercase tracking-widest mb-2 block">Administración</span>
            <h1 className="text-4xl font-black text-merengue-dark tracking-tight">
              {navItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl flex items-center space-x-2 px-8 py-4 shadow-xl shadow-merengue-main/20"
          >
            <Plus size={20} />
            <span className="font-bold">Añadir {activeTab === 'gallery' ? 'Trabajo' : 'Artículo'}</span>
          </Button>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === 'gallery' ? (
            <GalleryManager />
          ) : (
            <ArticlesManager />
          )}
        </div>
      </main>

      {/* Modals */}
      <GalleryUploadModal 
        isOpen={isModalOpen && activeTab === 'gallery'} 
        onClose={() => setIsModalOpen(false)} 
      />
      <ArticleUploadModal
        isOpen={isModalOpen && activeTab === 'articles'}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
