import { Instagram, Facebook, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-merengue-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div>
          <h2 className="text-3xl font-display font-bold mb-4 bg-gradient-to-r from-merengue-main to-pink-300 bg-clip-text text-transparent">
            El Merengue
          </h2>
          <p className="text-white/70 max-w-sm leading-relaxed">
            Haciendo tus momentos especiales aún más dulces desde Yanga, Veracruz. Postres artesanales con amor.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-6">Contacto</h3>
          <ul className="space-y-4 text-white/70">
            <li className="flex items-start space-x-3">
              <MapPin size={20} className="text-merengue-main flex-shrink-0 mt-1" />
              <span>Av.4 entre calles 1 y 3, Yanga, Ver.</span>
            </li>
            <li className="flex items-start space-x-3">
              <Phone size={20} className="text-merengue-main flex-shrink-0 mt-1" />
              <div>
                <p>271 313 83 07</p>
                <p>271 283 13 39</p>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-6">Síguenos</h3>
          <div className="flex space-x-4">
            <a 
              href="https://www.facebook.com/postreria.flores.2023?locale=es_LA" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-merengue-main hover:border-merengue-main transition-all duration-300 group"
            >
              <Facebook size={24} className="group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="#" 
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-merengue-main hover:border-merengue-main transition-all duration-300 group"
            >
              <Instagram size={24} className="group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 text-center text-white/60 text-sm">
        <p>&copy; {new Date().getFullYear()} El Merengue. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
