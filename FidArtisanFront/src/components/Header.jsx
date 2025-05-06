import React, { useState, useEffect, useRef } from 'react';
import { Bell, Mail, Search, Settings, MessageSquare, User, LogOut, ChevronDownIcon, MenuIcon, XIcon } from 'lucide-react';
import Profession from './Profession'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('Utilisateur');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const [ville, setVille] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [villes, setVilles] = useState([]);
  const [loadingSug, setLoadingSug] = useState(false);
  const [bellActive, setBellActive] = useState(false);
  
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.name || 'Utilisateur');
        setProfile(user);
      } catch (error) {
        console.error('Erreur parsing user:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Charger les villes pour la recherche
  useEffect(() => {
    if (searchOpen) {
      api.get('/villes')
        .then(({ data }) => setVilles(data))
        .catch(console.error);
    }
  }, [searchOpen]);

  // Autocomplete pour la recherche
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
        setSearchOpen(false);
        navigate('/resultats', { state: { artisans: data } });
      })
      .catch(console.error);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    api.post('/logout')
      .then(() => {
        localStorage.clear();
        navigate('/login', { replace: true });
      })
      .catch((error) => {
        console.error('Erreur lors de la déconnexion:', error);
      });
  };
  
  const fetchNotifications = async () => {
    if (!profile?.id) return;
  
    try {
      const response = await api.get(`/services/user/${profile.id}`);
      setNotifications(response.data.filter(service =>
        service.statut !== 'terminé' && service.statut !== 'en attente'
      ));
      setUnreadCount(response.data.length);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications :", error);
    }
  };
  
  useEffect(() => {
    if (profile?.id) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [profile]);
  
  const isActive = (path) => {
    if (path === '/accueil') {
      return location.pathname === '/accueil' || location.pathname === '/' || location.pathname === '';
    }
    return location.pathname === path;
  };
  
  const activeLinkStyle = "text-blue-500 border-b-2 border-blue-500 font-medium px-3 py-2 text-sm";
  const inactiveLinkStyle = "text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium";
  
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-xl sticky top-0 z-[1000]">
      {searchOpen && (
  <div className="absolute top-0 left-0 right-0 bg-white z-[1001] shadow-md border-b border-gray-200" ref={searchRef}>
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Rechercher</h2>
        <button onClick={() => setSearchOpen(false)} className="text-gray-600 hover:text-gray-800">
          <XIcon size={24} />
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
        <div className="flex-1">
          <input 
            type="text" 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            placeholder="Plombier, Électricien..." 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="w-full md:w-64">
          <select 
            value={ville} 
            onChange={(e) => setVille(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Toutes les villes</option>
            {villes.map((v) => (
              <option key={v.id} value={v.id}>{v.nom}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-auto">
          <button 
            onClick={handleSearch} 
            className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Rechercher
          </button>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Suggestions :</h3>
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            {suggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSearchOpen(false);
                  navigate(`/artisan/${suggestion.id}`);
                }}
              >
                <div className="font-medium">{suggestion.profession.nom}</div>
                <div className="text-sm text-gray-600">
                  {suggestion.user.name}, {suggestion.ville.nom}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loadingSug && (
        <div className="mt-4 text-center text-gray-600">
          Chargement des suggestions...
        </div>
      )}
    </div>
  </div>
)}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <a href="/accueil" className="text-blue-500 font-bold text-xl">Fid'Artisan</a>

        {/* Burger menu pour mobile */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 hover:text-gray-900">
            {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <a 
                href="/accueil" 
                className={isActive('/accueil') ? activeLinkStyle : inactiveLinkStyle}
              >
                Accueil
              </a>
              <div className="relative" ref={dropdownRef}>
                <button
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium flex items-center"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Métiers artisanaux
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
                {dropdownOpen && <Profession />}
              </div>
              <a 
                href="/contact" 
                className={isActive('/contact') ? activeLinkStyle : inactiveLinkStyle}
              >
                Contact
              </a>
              <LinkButton 
                to="/serviceclient" 
                icon={Settings} 
                label="Demandes" 
                isActive={isActive('/serviceclient')}
              />
              <div className="flex flex-col items-center">
                <button 
                  className="p-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search size={20} />
                </button>
                <span className="text-xs text-gray-500">Recherche</span>
              </div>
              <AlertButton unreadCount={unreadCount} bellActive={bellActive} setBellActive={setBellActive} />
              <UserDropdown username={username} toggleDropdown={toggleDropdown} isDropdownOpen={isDropdownOpen} handleLogout={handleLogout} />
            </>
          ) : (
            <>
              <a 
                href="/accueil" 
                className={isActive('/accueil') ? activeLinkStyle : inactiveLinkStyle}
              >
                Accueil
              </a>
              <div className="relative" ref={dropdownRef}>
                <button
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium flex items-center"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Métiers artisanaux
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
                {dropdownOpen && <Profession />}
              </div>
              <a 
                href="/contact" 
                className={isActive('/contact') ? activeLinkStyle : inactiveLinkStyle}
              >
                Contact
              </a>
              <a href="/login" className="ml-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                Connexion
              </a>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu (connecté ou pas) */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 space-y-2 px-4 pb-4">
          {isAuthenticated ? (
            <>
              <MobileLink to="/accueil" label="Accueil" isActive={isActive('/accueil')} />
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                Métiers artisanaux
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </button>
              {dropdownOpen && <Profession />}
              <MobileLink to="/contact" label="Contact" isActive={isActive('/contact')} />
              <MobileLink to="/serviceclient" label="Demandes de Service" isActive={isActive('/serviceclient')} />
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Rechercher
              </button>
              <MobileLink to="/alertes" label={`Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}`} isActive={isActive('/alertes')} />
              <div className="border-t pt-2">
                <MobileLink to="/client" label="Profil" isActive={isActive('/client')} />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              <MobileLink to="/accueil" label="Accueil" isActive={isActive('/accueil')} />
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                Métiers artisanaux
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </button>
              <MobileLink to="/contact" label="Contact" isActive={isActive('/contact')} />
              <a href="/login" className="block w-full text-center py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Connexion
              </a>
            </>
          )}
        </div>
      )}
    </header>
  );
};

// Composants réutilisables pour factoriser
const IconButton = ({ icon: Icon, label }) => (
  <div className="flex flex-col items-center">
    <button className="p-2 text-gray-600 hover:text-gray-900">
      <Icon size={20} />
    </button>
    <span className="text-xs text-gray-500">{label}</span>
  </div>
);

const LinkButton = ({ to, icon: Icon, label, isActive }) => (
  <Link to={to} className="flex flex-col items-center">
    <button className={`p-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'}`}>
      <Icon size={20} />
    </button>
    <span className={`text-xs ${isActive ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>{label}</span>
  </Link>
);

const AlertButton = ({ bellActive, setBellActive }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  
  // Calculer le nombre de notifications non lues
  const unreadCount = notifications.filter(service => 
    service.statut !== 'terminé' && service.statut !== 'annulé'
  ).length;

  // Récupérer les notifications depuis le contexte global
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user.id) {
          api.get(`/services/user/${user.id}`)
            .then(response => {
              setNotifications(response.data.filter(service => 
                service.statut !== 'terminé' && service.statut !== 'annulé'
              ));
            })
            .catch(error => {
              console.error("Erreur lors de la récupération des notifications:", error);
            });
        }
      } catch (error) {
        console.error("Erreur de parsing:", error);
      }
    }
  }, []); // Remarquez qu'on a supprimé `unreadCount` de la dépendance
  
  // Gestionnaire de clic en dehors pour fermer la liste des notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
        setBellActive(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setBellActive]);
  
  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    setBellActive(!bellActive);
  };
  
  return (
    <div className="flex flex-col items-center relative" ref={notificationRef}>
      <button 
        className={`p-2 ${bellActive ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'} relative`}
        onClick={handleBellClick}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 rounded-full w-4 h-4 text-xs text-white flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      <span className={`text-xs ${bellActive ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>Notifications</span>
      
      {/* Modal des notifications */}
      {showNotifications && notifications.length > 0 && (
        <div className="absolute top-12 right-0 bg-white text-gray-700 shadow-lg rounded-md w-64 max-h-80 overflow-y-auto z-50">
          <div className="py-2 px-3 font-medium border-b">
            Vos notifications
          </div>
          <ul className="flex flex-col text-sm">
            {notifications.map((notification) => (
              <li key={notification.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100">
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">{notification.artisan?.user?.name || "Un artisan"}</span> a accepté votre demande de service.
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      Statut: <span className="text-blue-500">{notification.statut}</span>
                    </span>
                    <Link to={`/services/${notification.id}`} className="text-xs text-blue-500 hover:underline">
                      Voir détails
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {notifications.length > 5 && (
            <div className="py-2 px-4 text-center border-t">
              <Link to="/notifications" className="text-xs text-blue-500 hover:underline">
                Voir toutes les notifications
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Message si pas de notifications */}
      {showNotifications && notifications.length === 0 && (
        <div className="absolute top-12 right-0 bg-white text-gray-700 shadow-lg rounded-md w-64 z-50">
          <div className="py-6 px-4 text-center text-sm text-gray-500">
            Vous n'avez pas de notifications
          </div>
        </div>
      )}
    </div>
  );
};


const UserDropdown = ({ username, toggleDropdown, isDropdownOpen, handleLogout }) => (
  <div className="relative">
    <button onClick={toggleDropdown} className="flex items-center cursor-pointer">
      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
        <span>{username.charAt(0).toUpperCase()}</span>
      </div>
      <span className="ml-2 font-medium">{username}</span>
      <span className="ml-2">▼</span>
    </button>
    {isDropdownOpen && (
      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-md rounded-md z-20">
        <ul className="py-2">
          <li>
            <a href="/client" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center">
              <User size={16} className="mr-2" /> Profil
            </a>
          </li>
          <li>
            <button onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left flex items-center">
              <LogOut size={16} className="mr-2" /> Déconnexion
            </button>
          </li>
        </ul>
      </div>
    )}
  </div>
);

const MobileLink = ({ to, label, isActive }) => (
  <Link to={to} className={isActive 
    ? "block px-4 py-2 text-sm text-blue-500 bg-blue-50" 
    : "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"}>
    {label}
  </Link>
);

export default Header;