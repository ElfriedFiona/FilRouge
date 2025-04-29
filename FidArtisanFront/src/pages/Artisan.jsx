import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Bell,
    Megaphone,
    Coins,
    Star,
    LogOut,
    Search,
    User,
    ChevronRight,
    BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Données de test pour les avis
const recentReviews = [
    { id: 1, name: 'Jane Cooper', rating: 3 },
    { id: 2, name: 'Cameron Williamson', rating: 4 },
    { id: 3, name: 'Leslie Alexander', rating: 3 },
];

// Composant pour afficher les étoiles d'évaluation
const RatingStars = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />);
        } else {
            stars.push(<Star key={i} className="h-4 w-4 text-yellow-400" />);
        }
    }
    return <div className="flex">{stars}</div>;
};

const ArtisanDashboard = () => {
    const [activeSection, setActiveSection] = useState('Dashboard');

    const renderContent = () => {
        switch (activeSection) {
            case 'Dashboard':
                return (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome Artisan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-blue-500">
                                        4 Nouveaux Clients
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" className="text-blue-500">
                                        Plus d'infos <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-blue-500">
                                        150 Vus Du Profil
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" className="text-blue-500">
                                        Plus d'infos <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-gray-800">Les Avis Récents</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {recentReviews.map((review) => (
                                        <div key={review.id} className="flex items-center gap-4">
                                            <User className="h-8 w-8 text-gray-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{review.name}</p>
                                                <RatingStars rating={review.rating} />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-gray-800">Graph Du Nombres De Clients</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center h-48 bg-gray-200 rounded">
                                        <BarChart className="h-10 w-10 text-gray-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                );
            case 'Utilisateur':
                return <div className="flex items-center justify-center h-full">Contenu Utilisateur</div>;
            case 'Calendrier':
                return <div className="flex items-center justify-center h-full">Contenu Calendrier</div>;
            case 'Demandes':
                return <div className="flex items-center justify-center h-full">Contenu Demandes</div>;
            case 'Annonces':
                return <div className="flex items-center justify-center h-full">Contenu Annonces</div>;
            case 'Paiements':
                return <div className="flex items-center justify-center h-full">Contenu Paiements et Abonnements</div>;
            case 'Avis':
                return <div className="flex items-center justify-center h-full">Contenu Avis et Notes</div>;
            case 'Logout':
                return <div className="flex items-center justify-center h-full">Contenu Logout</div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Fid'Artisan</h1>
                </div>
                <nav className="px-4 space-y-2">
                    <NavItem
                        icon={<LayoutDashboard className="h-4 w-4" />}
                        text="Dashboard"
                        active={activeSection === 'Dashboard'}
                        onClick={() => setActiveSection('Dashboard')}
                    />
                    <NavItem
                        icon={<Users className="h-4 w-4" />}
                        text="Utilisateur"
                        onClick={() => setActiveSection('Utilisateur')}
                    />
                    <NavItem
                        icon={<Calendar className="h-4 w-4" />}
                        text="Calendrier"
                        onClick={() => setActiveSection('Calendrier')}
                    />
                    <NavItem
                        icon={<Bell className="h-4 w-4" />}
                        text="Demandes"
                        onClick={() => setActiveSection('Demandes')}
                    />
                    <NavItem
                        icon={<Megaphone className="h-4 w-4" />}
                        text="Annonces"
                        onClick={() => setActiveSection('Annonces')}
                    />
                    <NavItem
                        icon={<Coins className="h-4 w-4" />}
                        text="Paiements et Abonnements"
                        onClick={() => setActiveSection('Paiements')}
                    />
                    <NavItem
                        icon={<Star className="h-4 w-4" />}
                        text="Avis et Notes"
                        onClick={() => setActiveSection('Avis')}
                    />
                    <NavItem
                        icon={<LogOut className="h-4 w-4" />}
                        text="LOGOUT"
                        onClick={() => setActiveSection('Logout')}
                    />
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {/* Top Bar */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Search className="h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Rechercher des utilisateurs"
                            className="border-none focus:ring-0"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <User className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-800 font-medium">Nom</span>
                    </div>
                </div>
                {renderContent()}
                {/* Footer */}
                <footer className="mt-8 text-center text-sm text-gray-500">
                    Copyright © {new Date().getFullYear()} Fid'Artisan. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

// Composant réutilisable pour les éléments de la barre de navigation
const NavItem = ({ icon, text, active, onClick }) => {
    return (
        <div
            className={cn(
                "flex items-center gap-4 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer",
                active ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={onClick}
        >
            {icon}
            <span className="text-sm">{text}</span>
        </div>
    );
};

export default ArtisanDashboard;