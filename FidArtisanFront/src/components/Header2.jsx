import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaUser, FaBell, FaSearch, FaSlidersH } from 'react-icons/fa';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Header({setActiveContent, setSearchResults}) {
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
        localStorage.clear();
        navigate('/login', { replace: true });
      })
      .catch((error) => {
        console.error('Erreur lors de la déconnexion:', error);
      });
  };

  useEffect(() => {
    api.get('/villes')
      .then(({ data }) => setVilles(data))
      .catch(console.error);
  }, []);

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
    .then(({ data }) => {
      setSearchResults(data); // Mettre à jour l'état dans le parent
      setActiveContent("Résultats"); // Changer le contenu actif
      setSuggestions([]); // Fermer les suggestions
      setQ(''); // Réinitialiser le champ de recherche (optionnel)
    })
    .catch(console.error);
  };

  useEffect(() => {
    api.get('/profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error("Erreur lors de la récupération du profil :", err));
  }, []);

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
      if (showNotifications && !e.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, showNotifications]);

  const fetchNotifications = async () => {
    if (!profile?.artisan?.id) return;
    try {
      const response = await api.get(`/services/artisan/${profile.artisan.id}`);
      const activeNotifications = response.data.filter(service =>
        service.statut !== 'terminé' && service.statut !== 'annulée'
      );
      setNotifications(activeNotifications);
      setUnreadCount(activeNotifications.length);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications :", error);
    }
  };

  useEffect(() => {
    if (profile?.artisan?.id) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  return (
    <header className="fixed top-0 left-0 w-full bg-white h-16 flex items-center justify-between px-6 shadow z-50">
      {/* Logo */}
      <div className="text-blue-600 font-bold text-lg">Fid’Artisan</div>

      {/* Barre de recherche (Desktop) */}
      <div className="relative hidden md:flex items-center ml-4 flex-grow max-w-lg">
        <input
          type="text"
          className="px-3 py-1 border rounded-l text-sm w-full"
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
        {(loadingSug || suggestions.length > 0) && (
          <ul className="absolute top-full left-0 bg-white border shadow-lg z-50 w-full max-h-64 overflow-auto text-sm">
            {loadingSug && <li className="px-3 py-2 text-gray-500">Chargement...</li>}
            {!loadingSug && suggestions.length === 0 && <li className="px-3 py-2 text-gray-500 italic">Aucun résultat</li>}
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

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications (Desktop) */}
        <div className="relative hidden md:block" onClick={() => setShowNotifications(!showNotifications)}>
          <FaBell className="text-gray-600 text-lg" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Notifications Dropdown (Desktop) */}
        {showNotifications && notifications.length > 0 && (
          <div className="absolute top-16 right-8 bg-white text-gray-700 shadow-lg rounded-md w-64 max-h-80 overflow-y-auto notification-dropdown">
            <ul className="flex flex-col text-sm">
              {notifications.map((notification) => (
                <li key={notification.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <div>
                    <p>{notification.user?.name} a envoyé une demande de service.</p>
                    <button
                      className="text-blue-500 mt-1"
                      onClick={() => {
                        setActiveContent("Demandes");
                        setShowNotifications(false);
                      }}
                    >
                      Voir plus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Menu utilisateur (Desktop) */}
        <div className="relative hidden md:flex items-center" ref={menuRef}>
          {profile?.artisan?.photo ? (
            <img
              src={`http://localhost:8000/storage/uploads/${profile.artisan.photo}`}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover mr-2"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
              <FaUser />
            </div>
          )}
          <span className="text-gray-700 font-medium mr-2">{profile?.name || "Nom"}</span>
          <button onClick={() => setOpen(!open)} ref={profileButtonRef}>
            <FaChevronDown />
          </button>

          {open && (
            <div className="absolute top-12 right-0 bg-white text-gray-700 shadow-lg rounded-md w-48">
              <ul className="flex flex-col text-sm">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setActiveContent("Mon Profil");
                    setOpen(false);
                  }}
                >
                  Mon profil
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600" onClick={logout}>
                  Déconnexion
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Menu mobile */}
        <div className="md:hidden flex items-center gap-2">
          {/* Notifications (Mobile) */}
          <div className="relative" onClick={() => setShowNotifications(!showNotifications)}>
            <FaBell className="text-gray-600 text-lg" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {/* Avatar + dropdown (Mobile) */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setOpen(!open)} ref={profileButtonRef} className="flex items-center">
              {profile?.artisan?.photo ? (
                <img
                  src={`http://localhost:8000/storage/uploads/${profile.artisan.photo}`}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <FaUser />
                </div>
              )}
              <FaChevronDown className="ml-1" />
            </button>

            {open && (
              <div className="absolute top-12 right-0 bg-white text-gray-700 shadow-lg rounded-md w-48">
                <ul className="flex flex-col text-sm">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setActiveContent("Mon Profil");
                      setOpen(false);
                    }}
                  >
                    Mon profil
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600" onClick={logout}>
                    Déconnexion
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}