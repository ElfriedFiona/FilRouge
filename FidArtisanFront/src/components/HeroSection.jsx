import React, { useEffect, useState, useRef } from 'react';
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
  const navigate   = useNavigate();

  const [q, setQ]             = useState('');
  const [ville, setVille]     = useState('');
  const [villes, setVilles]   = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSug, setLoadingSug]   = useState(false);
  const [searchError, setSearchError] = useState('');
  const debounceRef = useRef(null);
  
   // Charge les villes
   useEffect(() => {
    api.get('/villes')
       .then(({ data }) => setVilles(data))
       .catch(console.error);
  }, []);

  // Autocomplete
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setLoadingSug(true);
      api.get('/artisans/search', { params: { q, ville } })
         .then(({ data }) => setSuggestions(data))
         .catch(() => setSuggestions([]))
         .finally(() => setLoadingSug(false));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [q, ville]);

  const handleSearch = (searchQ = q, searchVille = ville) => {
    if (!searchQ.trim()) return;
    setSearchError(''); // Réinitialise l'erreur à chaque nouvelle recherche
    api.get('/artisans/search', { params: { q: searchQ, ville: searchVille } })
      .then(({ data }) => {
        if (data && data.length > 0) {
          navigate('/resultats', { state: { artisans: data } });
        } else {
          setSearchError('Aucun artisan trouvé pour votre recherche.'); // Définit le message d'erreur
        }
      })
      .catch(error => {
        console.error('Erreur lors de la recherche :', error);
        setSearchError('Une erreur est survenue lors de la recherche.'); // Message d'erreur générique
      });
  };


  const artisanImages = [{
    src: menuisier_ebeniste,
    title: 'Ébéniste',
    alt: 'Ébéniste travaillant le bois'
  }, {
    src: vannier,
    title: 'Vannier',
    alt: '/artisan_vannier'
  },
  {
    src: menuisier,
    title: 'Menuisier',
    alt: 'menuisier'
  }, {
    src: rotin,
    title: 'Fabricant de rotin',
    alt: 'fabricant_rotin'
  }, {
    src: ferronier,
    title: 'Ferronnier art',
    alt: 'ferronier'
  },
  {
    src: plombier,
    title: 'Plombier (installateur sanitaire)',
    alt: 'plombier'
  }, {
    src: sculpteur,
    title: 'Sculpteur / décorateur sur tous matériaux',
    alt: 'sculpteur'
  }, {
    src: ceramiste,
    title: 'Ceramiste (Potier)',
    alt: 'Ceramiste'
  }, {
    src: maroquinier,
    title: 'Maroquinier',
    alt: 'maroquinier'
  }, {
    src: sparterie,
    title: 'Spartier',
    alt: 'Sparterie'
  }, {
    src: bougies,
    title: 'Fabricant de bougies',
    alt: 'fabricant_bougiesartisanales'
  }, {
    src: bambou,
    title: 'Fabricant objets en bambou',
    alt: 'fabricants_bambou'
  }, {
    src: brodeur,
    title: 'Brodeur',
    alt: 'brodeur'
  }, {
    src: canalisateur,
    title: 'Canalisateur',
    alt: 'canalisateur'
  }, {
    src: portraitiste,
    title: 'Peintre-décorateur / portraitiste', // Regroupement
    alt: 'portraitiste'
  }, {
    src: foreur,
    title: 'Foreur / installateur de puits d’eau',
    alt: 'foreur'
  }, {
    src: paves,
    title: 'Fabricant de pavés',
    alt: 'fabricants_paves'
  }
];

  return (
    <section className="w-full bg-white md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div id='search' className="text-center mb-12">
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
        {/* BARRE DE RECHERCHE */}
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-3xl">
            <div className="flex flex-col md:flex-row shadow-md rounded-lg overflow-visible">
              {/* Métier */}
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Que recherchez-vous ?"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-3 focus:outline-none"
                />
                {/* Suggestions */}
                {(loadingSug || q.trim().length >= 2) && (
                  <ul className="absolute top-full left-0 right-0 bg-white border rounded-b-lg shadow-lg z-50 max-h-60 overflow-auto">
                    {loadingSug && (
                      <li className="px-4 py-2 text-gray-500">Chargement…</li>
                    )}
                    {!loadingSug && suggestions.length === 0 && (
                      <li className="px-4 py-2 text-gray-500 italic">
                        Aucune suggestion trouvée.
                      </li>
                    )}
                    {!loadingSug && suggestions.map((art, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setQ(art.user.name);
                          setSuggestions([]);
                          handleSearch(art.user.name, ville);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {art.user.name} — {art.profession.nom} ({art.ville.nom})
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Ville */}
              <select
                value={ville}
                onChange={e => setVille(e.target.value)}
                className="px-4 py-3 border-t md:border-t-0 md:border-l focus:outline-none"
              >
                <option value="">Toutes les villes</option>
                {villes.map(v => (
                  <option key={v.id} value={v.nom}>{v.nom}</option>
                ))}
              </select>

              {/* Bouton */}
              <button
                onClick={() => handleSearch()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 flex items-center justify-center"
              >
                <SearchIcon className="h-5 w-5 inline mr-1" /> Chercher
              </button>
            </div>
          </div>
        </div>
        
        {searchError && (
          <div className="text-center text-red-500 mb-4">
            {searchError}
          </div>
        )}

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