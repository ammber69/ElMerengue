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
    <div className="relative min-h-screen flex items-center justify-center bg-[#fafafa] px-4 overflow-hidden">
      {/* Particles Background */}
      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0 z-0 opacity-40"
        />
      )}

      {/* Modern Soft Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-merengue-main/5 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-merengue-pastel/10 rounded-full blur-[120px] z-0" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <div className="bg-white/70 backdrop-blur-[32px] rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(214,51,132,0.12)] p-12 md:p-16 border border-white/60">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-merengue-main/10 rounded-full blur-2xl scale-150" />
              <img 
                src={logo} 
                alt="El Merengue Logo" 
                className="relative w-40 h-40 object-contain drop-shadow-lg"
              />
            </motion.div>
            
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-display font-black text-merengue-dark tracking-tight">
                Panel Admin
              </h1>
              <div className="flex items-center justify-center space-x-3">
                <div className="h-[2px] w-8 bg-merengue-main/20 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-merengue-main/60">
                  Acceso Restringido
                </span>
                <div className="h-[2px] w-8 bg-merengue-main/20 rounded-full" />
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-black text-merengue-dark/40 uppercase tracking-widest ml-1">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-merengue-text/20 group-focus-within:text-merengue-main transition-all duration-300" size={18} />
                  <input 
                    type="email" 
                    required
                    className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-merengue-gray/50 bg-white/40 focus:bg-white focus:ring-[12px] focus:ring-merengue-main/5 focus:border-merengue-main outline-none transition-all duration-500 text-merengue-dark font-medium placeholder:text-merengue-text/20 shadow-sm"
                    placeholder="admin@elmerengue.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-merengue-dark/40 uppercase tracking-widest ml-1">
                  Contraseña
                </label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-merengue-text/20 group-focus-within:text-merengue-main transition-all duration-300" size={18} />
                  <input 
                    type="password" 
                    required
                    className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-merengue-gray/50 bg-white/40 focus:bg-white focus:ring-[12px] focus:ring-merengue-main/5 focus:border-merengue-main outline-none transition-all duration-500 text-merengue-dark font-medium placeholder:text-merengue-text/20 shadow-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 text-xl rounded-[2rem] shadow-[0_20px_40px_-12px_rgba(214,51,132,0.35)] hover:shadow-[0_25px_50px_-12px_rgba(214,51,132,0.45)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 font-bold tracking-tight"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Entrando...</span>
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          {/* Footer Security Notice */}
          <div className="mt-12 pt-8 border-t border-merengue-gray/50">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-merengue-main/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-merengue-main/40" size={18} />
              </div>
              <p className="text-[11px] text-merengue-text/40 leading-relaxed font-medium">
                Este es un sistema privado. El acceso no autorizado está estrictamente prohibido y será monitoreado.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
