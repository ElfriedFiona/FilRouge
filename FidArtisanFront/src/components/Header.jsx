import React, { useState, useEffect, useRef } from 'react';
import { Bell, Mail, Search, Settings, MessageSquare, User, LogOut, ChevronDownIcon, MenuIcon, XIcon } from 'lucide-react';
import Profession from './Profession'; 
import { Link } from 'react-router-dom';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('Utilisateur');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.name || 'Utilisateur');
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-xl sticky top-0 z-[1000]">
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
              <IconButton icon={MessageSquare} label="Messages" />
              <LinkButton to="/serviceclient" icon={Settings} label="Demandes" />
              <LinkButton to="/contact" icon={Mail} label="Contact" />
              <IconButton icon={Search} label="Recherche" />
              <AlertButton />
              <UserDropdown username={username} toggleDropdown={toggleDropdown} isDropdownOpen={isDropdownOpen} handleLogout={handleLogout} />
            </>
          ) : (
            <>
              <a href="/contact" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
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
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                Métiers artisanaux
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </button>
              {dropdownOpen && <Profession />}
              <MobileLink to="/serviceclient" label="Demandes de Service" />
              <MobileLink to="/contact" label="Contact" />
              <MobileLink to="/recherche" label="Rechercher" />
              <MobileLink to="/alertes" label="Alertes" />
              <div className="border-t pt-2">
                <MobileLink to="/client" label="Profil" />
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
              <MobileLink to="/contact" label="Contact" />
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

const LinkButton = ({ to, icon: Icon, label }) => (
  <Link to={to} className="flex flex-col items-center">
    <button className="p-2 text-gray-600 hover:text-gray-900">
      <Icon size={20} />
    </button>
    <span className="text-xs text-gray-500">{label}</span>
  </Link>
);

const AlertButton = () => (
  <div className="flex flex-col items-center relative">
    <button className="p-2 text-gray-600 hover:text-gray-900 relative">
      <Bell size={20} />
      <span className="absolute top-1 right-1 bg-red-500 rounded-full w-4 h-4 text-xs text-white flex items-center justify-center">
        1
      </span>
    </button>
    <span className="text-xs text-gray-500">Alertes</span>
  </div>
);

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

const MobileLink = ({ to, label }) => (
  <Link to={to} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
    {label}
  </Link>
);

export default Header;
