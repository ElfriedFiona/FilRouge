import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';
import DashboardContent from '../Content/DashboardContent';
import UtilisateurClients from '../Content/UtilisateursClients';
import UtilisateurArtisans from '../Content/UtilisateursArtisans';
import Calendrier from '../Content/Calendrier';
import MailBox from '../Content/MailBox';
import Annonces from '../Content/Annonces';

const Dashboard = () => {
    // État pour gérer la navigation entre les sections
    const [activeSection, setActiveSection] = useState('Dashboard');

    // Fonction pour rendre le contenu approprié en fonction de la section active
    const renderContent = () => {
        switch (activeSection) {
            case 'Dashboard':
                return <DashboardContent />;
            case 'UtilisateurClients':
                return <UtilisateurClients />;
            case 'UtilisateurArtisans':
                return <UtilisateurArtisans />;
            case 'Calendrier':
                return <Calendrier />;
            case 'MailBox':
                return <MailBox />;
            case 'Annonces':
                return <Annonces />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Component */}
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* TopBar Component */}
                <TopBar />
                
                {/* Content based on active section */}
                {renderContent()}

                {/* Footer Component */}
                <Footer />
            </main>
        </div>
    );
};

export default Dashboard;