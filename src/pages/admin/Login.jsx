import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('¡Bienvenido de nuevo!');
      navigate('/admin');
    } catch (error) {
      toast.error('Credenciales incorrectas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-merengue-snow px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-merengue-dark/5 p-8 border border-merengue-pastel"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-merengue-pastel text-merengue-main mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-merengue-dark">Panel Admin</h1>
          <p className="text-merengue-text/60 mt-2">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-merengue-text mb-2">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-merengue-text/40" size={20} />
              <input 
                type="email" 
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-merengue-gray focus:ring-2 focus:ring-merengue-main focus:border-transparent outline-none transition-all"
                placeholder="admin@elmerengue.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-merengue-text mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-merengue-text/40" size={20} />
              <input 
                type="password" 
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-merengue-gray focus:ring-2 focus:ring-merengue-main focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full py-4 text-lg rounded-xl"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-8 p-4 bg-merengue-gray/50 rounded-xl flex items-start space-x-3">
          <AlertCircle className="text-merengue-main flex-shrink-0" size={20} />
          <p className="text-xs text-merengue-text/60">
            Este panel es de acceso restringido. Si no tienes una cuenta, contacta al administrador del sistema.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
