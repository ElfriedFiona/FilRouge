import React, { useState, useEffect } from 'react';
import { Bell, Mail, Search, Settings, MessageSquare, User, LogOut } from 'lucide-react';

export function Header() {
  const [username, setUsername] = useState('Utilisateur'); // État par défaut
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Récupérer l'objet utilisateur depuis le localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.name || 'Utilisateur'); // Utiliser user.name si disponible
      } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur depuis localStorage:", error);
      }
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Implemente ta logique de déconnexion ici (vider le localStorage, etc.)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    // Rediriger vers la page de connexion
    window.location.href = '/login';
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-xl sticky top-0 z-10">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-blue-500">Fid'Artisan</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <MessageSquare size={20} />
            </button>
            <span className="text-xs text-gray-500">Messages</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Settings size={20} />
            </button>
            <span className="text-xs text-gray-500">Paramètres</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Mail size={20} />
            </button>
            <span className="text-xs text-gray-500">Email</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Search size={20} />
            </button>
            <span className="text-xs text-gray-500">Rechercher</span>
          </div>
          <div className="flex flex-col items-center relative">
            <button className="p-2 text-gray-600 hover:text-gray-900 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-4 h-4 text-xs text-white flex items-center justify-center">
                1
              </span>
            </button>
            <span className="text-xs text-gray-500">Alertes</span>
          </div>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center cursor-pointer"
            >
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
                    <a
                      href="/profile" // Remplace par le lien de ton profil
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
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