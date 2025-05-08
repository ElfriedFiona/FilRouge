import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Mail,
    Megaphone,
    LogOut,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection }) => {
    const [isUtilisateurOpen, setIsUtilisateurOpen] = useState(false);

    // Fonction de déconnexion (à implémenter selon vos besoins)
    const handleLogout = () => {
        // Logique de déconnexion
        console.log('Logging out...');
        // Rediriger vers la page de connexion ou appeler une API de déconnexion
    };

    return (
        <aside className="w-64 bg-white shadow-md">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">Fid'Artisan</h1>
            </div>
            <nav className="px-4 space-y-2">
                {/* Dashboard */}
                <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeSection === 'Dashboard' ? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}
                    onClick={() => setActiveSection('Dashboard')}
                >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                </button>
                
                {/* Menu Utilisateur avec sous-menu */}
                <div className="space-y-1">
                    <button
                        className={`flex w-full justify-start items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeSection.startsWith('Utilisateur') ? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}
                        onClick={() => setIsUtilisateurOpen(!isUtilisateurOpen)}
                    >
                        <Users className="h-4 w-4" />
                        <span className="ml-2">Utilisateur</span>
                        {isUtilisateurOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
                    </button>
                    
                    {/* Sous-menu Utilisateur */}
                    {isUtilisateurOpen && (
                        <div className="ml-8 space-y-1">
                            <button
                                className={`flex w-full justify-start items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeSection === 'UtilisateurClients' ? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}
                                onClick={() => setActiveSection('UtilisateurClients')}
                            >
                                <span className="ml-4">Clients</span>
                            </button>
                            <button
                                className={`flex w-full justify-start items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeSection === 'UtilisateurArtisans' ? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}
                                onClick={() => setActiveSection('UtilisateurArtisans')}
                            >
                                <span className="ml-4">Artisans</span>
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Calendrier */}
                <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeSection === 'Calendrier' ? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}
                    onClick={() => setActiveSection('Calendrier')}
                >
                    <Calendar className="h-4 w-4" />
                    <span>Calendrier</span>
                </button>
                
                {/* MailBox */}
                <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeSection === 'MailBox'? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}
                    onClick={() => setActiveSection('MailBox')}
                >
                    <Mail className="h-4 w-4" />
                    <span>MailBox</span>
                </button>
                
                {/* Annonces */}
                <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeSection === 'Annonces' ? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}
                    onClick={() => setActiveSection('Annonces')}
                >
                    <Megaphone className="h-4 w-4" />
                    <span>Annonces</span>
                </button>
            </nav>
            
            {/* Bouton de déconnexion */}
            <div className="mt-auto p-4">
                <button
                    className="flex w-full justify-start items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;