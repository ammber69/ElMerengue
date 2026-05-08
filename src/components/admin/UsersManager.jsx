import { useUsersAdmin } from '../../hooks/useUsersAdmin';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, User, Shield, Calendar, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const UsersManager = () => {
  const { users, loading, deleteAdmin } = useUsersAdmin();

  const handleDelete = async (id, email) => {
    if (email === 'admin@elmerengue.com') {
      return toast.error('No se puede eliminar el administrador principal');
    }

    if (window.confirm('¿Estás seguro de que deseas revocar el acceso a este administrador?')) {
      try {
        await deleteAdmin(id);
        toast.success('Acceso revocado correctamente');
      } catch {
        toast.error('Error al eliminar el administrador');
      }
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-merengue-main animate-spin" size={40} />
        <p className="text-merengue-text/60 font-medium">Cargando administradores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {users.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-merengue-pastel">
          <div className="w-20 h-20 bg-merengue-gray rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={40} className="text-merengue-dark/20" />
          </div>
          <h3 className="text-xl font-bold text-merengue-dark mb-2">No hay administradores adicionales</h3>
          <p className="text-merengue-text/60 max-w-xs mx-auto">
            Utiliza el botón "Añadir Administrador" para dar acceso a otros colaboradores.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {users.map((user) => (
              <motion.div
                layout
                key={user.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-merengue-pastel hover:shadow-xl hover:shadow-merengue-dark/5 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-merengue-pastel rounded-2xl flex items-center justify-center text-merengue-main">
                    <Shield size={24} />
                  </div>
                  <button
                    onClick={() => handleDelete(user.id, user.email)}
                    className="p-2 text-merengue-text/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-merengue-dark text-lg leading-tight">{user.name}</h4>
                    <p className="text-merengue-text/60 text-sm truncate">{user.email}</p>
                  </div>

                  <div className="flex items-center text-xs text-merengue-text/40 font-medium space-x-2 pt-4 border-t border-merengue-gray">
                    <Calendar size={14} />
                    <span>
                      Desde el {user.createdAt?.toDate ? format(user.createdAt.toDate(), "d 'de' MMMM, yyyy", { locale: es }) : 'Reciente'}
                    </span>
                  </div>
                </div>

                {user.email === 'admin@elmerengue.com' && (
                  <div className="mt-4 px-3 py-1 bg-merengue-main/10 text-merengue-main text-[10px] font-black uppercase tracking-widest rounded-full inline-block">
                    Super Admin
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="bg-merengue-main/5 p-6 rounded-3xl border border-merengue-main/10 flex items-start space-x-4">
        <AlertCircle className="text-merengue-main flex-shrink-0 mt-1" size={24} />
        <div>
          <h5 className="font-bold text-merengue-main mb-1">Sobre la gestión de usuarios</h5>
          <p className="text-sm text-merengue-text/70 leading-relaxed">
            Eliminar a un usuario de esta lista revocará su visibilidad en el panel, pero por seguridad, 
            sus credenciales de acceso deben ser deshabilitadas manualmente en la consola de Firebase 
            si se desea prohibir el login por completo.
          </p>
        </div>
      </div>
    </div>
  );
};
