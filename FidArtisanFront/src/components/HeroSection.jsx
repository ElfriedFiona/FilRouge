import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { SearchIcon, MouseIcon } from 'lucide-react';
import brodeur from '../assets/images/brodeur.jpeg';
import menuisier_ebeniste from '../assets/images/menuisier_ebeniste.jpeg';
import vannier from "../assets/images/artisan_vannier.jpeg";
import canalisateur from "../assets/images/canalisateur.jpeg";
import ceramiste from "../assets/images/ceramiste.jpeg";
import bougies from "../assets/images/fabricant_bougiesartisanales.jpeg";
import rotin from "../assets/images/fabricant_rotin.jpeg";
import bambou from "../assets/images/fabricants_bambou.jpeg";
import paves from "../assets/images/fabricants_paves.jpeg";
import ferronier from "../assets/images/ferronier.jpeg";
import foreur from "../assets/images/foreur.jpeg";
import maroquinier from "../assets/images/maroquinier.jpeg";
import portraitiste from "../assets/images/portraitiste.jpeg";
import sculpteur from "../assets/images/sculpteur.jpeg";
import sparterie from "../assets/images/sparterie.jpeg";
import plombier from "../assets/images/plombier.jpg";
import menuisier from "../assets/images/menuisier.jpg";

const HeroSection = () => {
  const scrollRef = useRef(null);
  const [q, setKeyword] = useState('');
  const [ville, setVille] = useState('');
  const navigate = useNavigate();
  const handleSearch = async (searchKeyword = q, searchVille = ville) => {
    try {
      const response = await api.get('/artisans/search', {
        params: {
          q: searchKeyword,
          ville: searchVille
        }
      });
      // Exemple : tu rediriges vers une page de résultats avec les données
      navigate('/resultats', { state: { artisans: response.data } });
    } catch (error) {
      console.error('Erreur lors de la recherche :', error);
    }
  };

  const artisanImages = [{
    src: menuisier_ebeniste,
    title: 'Ébénisterie',
    alt: 'Ébéniste travaillant le bois'
  }, {
    src: vannier,
    title: 'artisan_vannier',
    alt: '/artisan_vannier'
  },
  {
    src: menuisier,
    title: 'menuiserie',
    alt: 'menuisier'
  }, {
    src: rotin,
    title: 'fabricant_rotin',
    alt: 'fabricant_rotin'
  }, {
    src: ferronier,
    title: 'ferronier',
    alt: 'ferronier'
  },
  {
    src: plombier,
    title: 'Plomberie',
    alt: 'plombier'
  }, {
    src: sculpteur,
    title: 'Sculpteur',
    alt: 'sculpteur'
  }, {
    src: ceramiste,
    title: 'Ceramiste',
    alt: 'Ceramiste'
  }, {
    src: maroquinier,
    title: 'maroquinier',
    alt: 'maroquinier'
  }, {
    src: sparterie,
    title: 'Sparterie',
    alt: 'Sparterie'
  }, {
    src: bougies,
    title: 'fabricant_bougiesartisanales',
    alt: 'fabricant_bougiesartisanales'
  }, {
    src: bambou,
    title: 'fabricants Objets en bambou',
    alt: 'fabricants_bambou'
  }, {
    src: brodeur,
    title: 'Broderie',
    alt: 'brodeur'
  }, {
    src: canalisateur,
    title: 'canalisateur d\'eau',
    alt: 'canalisateur'
  }, {
    src: portraitiste,
    title: 'Portraitiste',
    alt: 'portraitiste'
  }, {
    src: foreur,
    title: 'Foreur',
    alt: 'foreur'
  }, {
    src: paves,
    title: 'fabricants_paves',
    alt: 'fabricants_paves'
  }
];

  return (
    <section className="w-full bg-white md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trouver un artisan, <br />
            n'a jamais été aussi simple !
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Besoin d'un plombier, d'un électricien ou d'un menuisier ? Notre
            plateforme réunit les meilleurs artisans et experts de toute
            catégorie.
          </p>
        </div>
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-3xl">
            <div className="flex flex-col md:flex-row shadow-md rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Que recherchez-vous ?"
                value={q}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-grow px-4 py-3 focus:outline-none border-b md:border-b-0 md:border-r border-gray-200" />
              <input
                type="text"
                placeholder="Où ?"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                className="px-4 py-3 focus:outline-none" />
              <button
                onClick={() => handleSearch()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 transition duration-150">
                <SearchIcon className="h-5 w-5 inline mr-1" />
                <span>Chercher</span>
              </button>
            </div>
          </div>
        </div>
        <div className="relative z-0">
          <div ref={scrollRef} className="flex space-x-6 overflow-x-auto pb-8 cursor-grab scrollbar-hide z-0">
            {artisanImages.map((image, index) => (
              <div
                key={index}
                className="flex-none w-32 md:w-40 transform transition-transform duration-300 hover:scale-105 z-0"
                onClick={() => handleSearch(image.title)}
              >
                <div className="relative z-0">
                  <img src={image.src} alt={image.alt} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg z-0" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 z-0" />
                </div>
                <p className="text-center text-sm mt-2 font-medium z-0">
                  {image.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .active {
          cursor: grabbing;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;