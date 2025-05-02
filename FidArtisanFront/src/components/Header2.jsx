import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaUser, FaBell, FaSearch, FaSlidersH } from 'react-icons/fa';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';


export default function Header({ setActiveContent }) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const menuRef = useRef();
  const profileButtonRef = useRef();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const [q, setQ] = useState('');
const [ville, setVille] = useState('');
const [suggestions, setSuggestions] = useState([]);
const [villes, setVilles] = useState([]);
const [loadingSug, setLoadingSug] = useState(false);
const debounceRef = useRef(null);
const navigate = useNavigate();

const logout = () => {
  api.post('/logout')
    .then(() => {
      localStorage.clear(); // Supprime tout
      navigate('/login');
    })
    .catch((error) => {
      console.error('Erreur lors de la déconnexion:', error);
    });
};
// Charger les villes
useEffect(() => {
  api.get('/villes')
     .then(({ data }) => setVilles(data))
     .catch(console.error);
}, []);

// Gérer l'autocomplétion
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
  api.get('/artisans/search', { params: { q: searchQ, ville: searchVille } })
     .then(({ data }) => navigate('/resultats', { state: { artisans: data } }))
     .catch(console.error);
};


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

  // Fonction pour récupérer les dernières demandes de service
  const fetchNotifications = async () => {
    if (!profile?.artisan?.id) return;
  
    try {
      const response = await api.get(`/services/artisan/${profile.artisan.id}`);
      // Filtrer les services non terminés ou non annulés
      const activeNotifications = response.data.filter(service =>
        service.statut !== 'terminé' && service.statut !== 'annulée'
      );
      setNotifications(activeNotifications);
      setUnreadCount(activeNotifications.length);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications :", error);
    }
  };
  
  

  // Met à jour les notifications toutes les 10 secondes
 // Met à jour les notifications toutes les 10 secondes
useEffect(() => {
  if (profile?.artisan?.id) {
    fetchNotifications(); // appel immédiat
    const interval = setInterval(fetchNotifications, 10000); // mise à jour toutes les 10s
    return () => clearInterval(interval); // nettoyage
  }
}, [profile]); // on attend que le profil soit dispo


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
      <div className="relative hidden md:flex items-center ml-4">
  <input
    type="text"
    className="px-3 py-1 border rounded-l text-sm"
    placeholder="Rechercher..."
    value={q}
    onChange={e => setQ(e.target.value)}
    onKeyDown={e => e.key === 'Enter' && handleSearch()}
  />
  <select
    value={ville}
    onChange={e => setVille(e.target.value)}
    className="text-sm px-2 py-1 border-t border-b border-r rounded-r"
  >
    <option value="">Toutes les villes</option>
    {villes.map(v => (
      <option key={v.id} value={v.nom}>{v.nom}</option>
    ))}
  </select>

  {/* Liste suggestions */}
  {(loadingSug || suggestions.length > 0) && (
    <ul className="absolute top-full left-0 bg-white border shadow-lg z-50 w-full max-h-64 overflow-auto text-sm">
      {loadingSug && (
        <li className="px-3 py-2 text-gray-500">Chargement...</li>
      )}
      {!loadingSug && suggestions.length === 0 && (
        <li className="px-3 py-2 text-gray-500 italic">Aucun résultat</li>
      )}
      {!loadingSug && suggestions.map((art, i) => (
        <li
          key={i}
          onClick={() => {
            setQ(art.user.name);
            setSuggestions([]);
            handleSearch(art.user.name, ville);
          }}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
        >
          {art.user.name} — {art.profession.nom} ({art.ville.nom})
        </li>
      ))}
    </ul>
  )}
</div>


      {/* Notifications et menu utilisateur */}
      <div className="flex items-center gap-4">
        {/* Notification */}
      <div className="relative" onClick={() => setShowNotifications(!showNotifications)}>
        <FaBell className="text-gray-600 text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Liste des notifications */}
      {showNotifications && notifications.length > 0 && (
        <div className="absolute top-16 right-0 bg-white text-gray-700 shadow-lg rounded-md w-64 max-h-80 overflow-y-auto">
          <ul className="flex flex-col text-sm">
          {notifications.map((notification) => (
  <li key={notification.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
    <div>
      <p >{notification.user?.name } a envoyé une demande de service.</p>
      <button
        className="text-blue-500 mt-1"
        onClick={() => setActiveContent("Demandes")}
      >
        Voir plus
      </button>
    </div>
  </li>
))}

            </ul>
        </div>
      )}

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
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600" onClick={logOut}>
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
