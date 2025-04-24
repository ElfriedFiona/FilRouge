import React from 'react';
import { FacebookIcon, TwitterIcon, InstagramIcon } from 'lucide-react';
const Footer = () => {
  return <footer className="w-full bg-gray-50 py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-blue-500 uppercase mb-4">
              Fid'Artisan
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Qui sommes-nous
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Nous contacter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Tarifs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">
              Artisan
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  FidArtisan pour les professionnels
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Devenir partenaire
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Espace artisan
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Conditions Générales
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  Politique cookies
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">
              Email Newsletter
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Recevez nos dernières actualités
            </p>
            <form className="flex flex-col sm:flex-row w-full">
  <input
    type="email"
    placeholder="Votre email"
    className="px-3 py-2 border border-gray-300 rounded-md sm:rounded-r-none mb-2 sm:mb-0 sm:mr-0 flex-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
  />
  <button
    type="submit"
    className="bg-blue-500 text-white px-3 py-2 rounded-md sm:rounded-l-none hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm w-full sm:w-auto"
  >
    S'abonner
  </button>
</form>

          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            Copyright © 2023 FidArtisan. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-700">
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;