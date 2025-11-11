import React from "react";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sección sobre la empresa */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Sobre la empresa</h2>
          <p className="text-sm leading-relaxed">
            Somos una empresa comprometida con ofrecer contenido de calidad y
            espacios publicitarios efectivos para nuestros clientes.
          </p>
        </div>

        {/* Sección de enlaces */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Enlaces útiles</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/politicas-de-privacidad"
                className="hover:text-white transition-colors"
              >
                Políticas de privacidad
              </a>
            </li>
            <li>
              <a
                href="/terminos-y-condiciones"
                className="hover:text-white transition-colors"
              >
                Términos y condiciones
              </a>
            </li>
            <li>
              <a
                href="/contacto"
                className="hover:text-white transition-colors"
              >
                Contacto
              </a>
            </li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div className="flex flex-col items-start md:items-end">
          <h2 className="text-lg font-semibold text-white mb-3">Síguenos</h2>
          <div className="flex space-x-4">
            <a
              href="https://wa.me/XXXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors"
            >
              <FaWhatsapp size={20} />
            </a>
            <a
              href="https://www.instagram.com/tu_empresa"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-pink-600 rounded-full hover:bg-pink-700 transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.facebook.com/tu_empresa"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
            >
              <FaFacebookF size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Palabra Argentina. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
