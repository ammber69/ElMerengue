import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, Phone } from "lucide-react";
import { Button } from "../components/Button";

export const Contacto = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const WHATSAPP_NUMBER = "522713138307";
  const WHATSAPP_NUMBER_2 = "522712831339";
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola El Merengue! Me gustaría cotizar un pedido.')}`;

  return (
    <section id="contacto" className="py-24 bg-gradient-to-b from-merengue-snow to-merengue-pastel/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-display font-bold text-merengue-dark mb-4">Visítanos</h2>
          <p className="text-lg text-merengue-text/80 font-sub">Estamos listos para endulzar tus momentos especiales.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-xl shadow-merengue-main/5 border border-merengue-pastel"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-display font-semibold text-merengue-main mb-6">Contáctanos</h3>
              <div className="flex items-start space-x-4 mb-6">
                <MapPin className="text-merengue-main mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-merengue-dark">Dirección</h4>
                  <p className="text-merengue-text/80 mt-1">Av.4 entre calles 1 y 3<br />Yanga, Veracruz</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Phone className="text-merengue-main mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-merengue-dark">Teléfono / WhatsApp</h4>
                  <p className="text-merengue-text/80 mt-1">271 313 83 07</p>
                  <p className="text-merengue-text/80 mt-0.5">271 283 13 39</p>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full text-lg py-6 bg-green-500 hover:bg-green-600 focus:ring-green-500 animate-pulse-soft shadow-lg shadow-green-500/20"
              onClick={() => window.open(whatsappUrl, '_blank')}
            >
              <svg className="w-6 h-6 mr-2 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.245 3.483 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              Pedir por WhatsApp
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-96 w-full rounded-3xl overflow-hidden shadow-lg border border-merengue-snow"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.2059!2d-96.8010!3d18.8344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDUwJzA0LjAiTiA5NsKwNDcnNTUuOSJX!5e0!3m2!1ses!2smx!4v1714583192000!5m2!1ses!2smx" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
