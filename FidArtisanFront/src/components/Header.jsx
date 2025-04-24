import React, { useEffect, useState, useRef } from 'react';
import { ChevronDownIcon, MenuIcon, XIcon } from 'lucide-react';
import Profession from './Profession';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null); 

  useEffect(() => {
    const handleClickOutside = (event) => { 
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { 
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-xl sticky top-0 z-[1000] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <a href="/accueil" className="text-blue-500 font-bold text-xl">Fid'Artisan</a>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
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
              <a href="/contact" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Contact
              </a>
              <button className="ml-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                <a href="/login">Connexion</a>
              </button>
            </div>
          </div>

          {/* Burger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-2">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Métiers artisanaux
            </button>
            {dropdownOpen && <Profession />}
            <a href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Contact
            </a>
            <a href="/login" className="block px-4 py-2 bg-blue-500 text-white rounded-md text-center mx-4 hover:bg-blue-600">
              Connexion
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;