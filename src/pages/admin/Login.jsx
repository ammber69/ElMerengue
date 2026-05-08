import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import toast from 'react-hot-toast';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import logo from "../../assets/logo.png";

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = useMemo(() => ({
    fullScreen: { enable: false },
    particles: {
      number: { value: 40, density: { enable: true, value_area: 800 } },
      color: { value: ["#D63384", "#F9A825", "#F48FB1"] },
      shape: { type: "circle" },
      opacity: { value: 0.3, random: true },
      size: { value: 4, random: true },
      move: { enable: true, speed: 1.5, direction: "bottom", straight: false, outModes: "out" }
    }
  }), []);

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
    <div className="relative min-h-screen flex items-center justify-center bg-merengue-snow px-4 overflow-hidden">
      {/* Particles Background */}
      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0 z-0"
        />
      )}

      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-merengue-pastel/30 to-transparent z-0" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-merengue-pastel/30 to-transparent z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-merengue-dark/5 p-10 border border-white/50">
          {/* Logo Section inside the card */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="w-48 h-48 mb-4 drop-shadow-xl"
            >
              <img 
                src={logo} 
                alt="El Merengue Logo" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            <h1 className="text-3xl font-display font-bold text-merengue-dark tracking-tight text-center">Panel Admin</h1>
            <div className="h-1 w-10 bg-merengue-main rounded-full mt-2 opacity-50" />
            <p className="text-merengue-text/50 text-xs mt-3 font-medium uppercase tracking-widest">Identificación Requerida</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-merengue-dark ml-1">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-merengue-text/30 group-focus-within:text-merengue-main transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-merengue-gray bg-white/50 focus:bg-white focus:ring-4 focus:ring-merengue-main/10 focus:border-merengue-main outline-none transition-all text-lg"
                  placeholder="admin@elmerengue.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-merengue-dark ml-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-merengue-text/30 group-focus-within:text-merengue-main transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-merengue-gray bg-white/50 focus:bg-white focus:ring-4 focus:ring-merengue-main/10 focus:border-merengue-main outline-none transition-all text-lg"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-5 text-xl rounded-2xl shadow-xl shadow-merengue-main/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Entrar al Panel'}
            </Button>
          </form>

          <div className="mt-10 p-5 bg-merengue-gray/30 rounded-2xl flex items-start space-x-4 border border-merengue-pastel/20">
            <AlertCircle className="text-merengue-main flex-shrink-0 mt-0.5" size={20} />
            <p className="text-xs text-merengue-text/60 leading-relaxed font-medium">
              Acceso restringido. Por seguridad, todos los intentos de inicio de sesión son registrados.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
