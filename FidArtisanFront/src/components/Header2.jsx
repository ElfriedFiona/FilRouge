import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaUser, FaBell, FaSearch, FaSlidersH } from 'react-icons/fa';
import api from '../services/api';

export default function Header({ setActiveContent }) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const menuRef = useRef();
  const profileButtonRef = useRef();

  // Récupérer les infos de l'artisan connecté
  useEffect(() => {
    api.get('/profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error("Erreur lors de la récupération du profil :", err));
  }, []);

  // Fermer le menu si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <header className="fixed top-0 left-0 w-full bg-white h-16 flex items-center px-6 shadow z-50">
      {/* Logo côté gauche */}
      <div className="top-8 mb-6 text-center pr-12 items-center w-64">
        <span className="text-blue-600 font-bold text-lg">Fid’Artisan</span>
      </div>

      <div className=' border-r border-gray-200 border-solid h-[65px]'></div>

      {/* Avatar central */}
      <div className="hidden fixed md:flex top-8 left-32 z-[1000] transform -translate-x-1/2">
        {profile?.artisan?.photo ? (
          <img
            src={`http://localhost:8000/${profile.artisan.photo}`}
            alt="Avatar"
            className="w-16 h-16 rounded-full shadow-lg border-4 border-white object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg border-4 border-white">
            <FaUser />
          </div>
        )}
      </div>

      {/* Barre de recherche */}
      <div className="flex-1 px-4">
        <div className="relative w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Rechercher des utilisateurs"
            className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400"><FaSearch /></span>
          <span className="absolute right-3 top-2.5 text-gray-400"><FaSlidersH /></span>
        </div>
      </div>

      {/* Notifications et menu utilisateur */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <FaBell className="text-gray-600 text-lg" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">1</span>
        </div>

        {/* Avatar à droite */}
        {profile?.artisan?.photo ? (
          <img
            src={`http://localhost:8000/${profile.artisan.photo}`}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <FaUser />
          </div>
        )}

        {/* Nom + menu déroulant */}
        <div className="relative md:flex items-center" ref={menuRef}>
          <span className="hidden md:block text-gray-700 font-medium mr-2">
            {profile?.name || "Nom"}
          </span>
          <button onClick={() => setOpen(!open)} ref={profileButtonRef}>
            <FaChevronDown />
          </button>

          {open && (
            <div className="absolute top-12 right-0 bg-white text-gray-700 shadow-lg rounded-md w-48">
              <ul className="flex flex-col text-sm">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setActiveContent("Utilisateur");
                    setOpen(false);
                  }}
                >
                  Mon profil
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
                  Déconnexion
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
