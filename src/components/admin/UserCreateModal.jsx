import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { Button } from '../Button';
import { useUsersAdmin } from '../../hooks/useUsersAdmin';
import toast from 'react-hot-toast';

export const UserCreateModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { createAdmin } = useUsersAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return toast.error('La contraseña debe tener al menos 6 caracteres');
    }

    setLoading(true);
    try {
      await createAdmin(email, password, name);
      toast.success('¡Administrador creado con éxito!');
      setEmail('');
      setPassword('');
      setName('');
      onClose();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Este correo ya está en uso');
      } else {
        toast.error('Error al crear el administrador');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-merengue-dark/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-merengue-main p-8 text-white relative">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <UserPlus size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">Nuevo Administrador</h2>
                <p className="text-white/70 text-sm">Crea una cuenta para un nuevo colaborador</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-merengue-dark mb-2 ml-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-merengue-dark/30" size={20} />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-merengue-pastel focus:ring-2 focus:ring-merengue-main outline-none transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-merengue-dark mb-2 ml-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-merengue-dark/30" size={20} />
                  <input
                    type="email"
                    required
                    placeholder="admin@ejemplo.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-merengue-pastel focus:ring-2 focus:ring-merengue-main outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-merengue-dark mb-2 ml-1">
                  Contraseña Temporal
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-merengue-dark/30" size={20} />
                  <input
                    type="password"
                    required
                    placeholder="Min. 6 caracteres"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-merengue-pastel focus:ring-2 focus:ring-merengue-main outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-merengue-gray/50 p-4 rounded-2xl flex items-start space-x-3">
              <ShieldCheck className="text-merengue-main flex-shrink-0" size={20} />
              <p className="text-[11px] text-merengue-text/60 leading-relaxed">
                Al crear este usuario, tendrá acceso completo al panel de administración. 
                Asegúrate de compartir las credenciales de forma segura.
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 font-bold text-merengue-dark/60 hover:bg-merengue-gray rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 rounded-2xl shadow-lg shadow-merengue-main/20"
              >
                {loading ? 'Creando...' : 'Crear Usuario'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
