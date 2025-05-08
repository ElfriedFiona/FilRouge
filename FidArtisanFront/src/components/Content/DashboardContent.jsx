import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import StatCard from '../Dashboard/StatCard';
import ListCard from '../Dashboard/ListCard';
import UserService from '../../services/UserService';

const DashboardContent = () => {
    const [stats, setStats] = useState({
        clientCount: 0,
        artisanCount: 0,
        newRegistrationsCount: 0
    });
    
    const [recentArtisans, setRecentArtisans] = useState([]);
    const [recentClients, setRecentClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Récupérer tous les utilisateurs
                const users = await UserService.getAllUsers();
                
                // Filtrer les clients et artisans
                const clients = users.filter(user => user.role === 'client');
                const artisans = users.filter(user => user.role === 'artisan');
                
                // Calculer les statistiques
                setStats({
                    clientCount: clients.length,
                    artisanCount: artisans.length,
                    // Supposons que les nouveaux enregistrements sont ceux des 24 dernières heures
                    newRegistrationsCount: users.filter(user => {
                        const createdDate = new Date(user.created_at);
                        const oneDayAgo = new Date();
                        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
                        return createdDate >= oneDayAgo;
                    }).length
                });
                
                // Préparation des données pour les cartes de liste
                const formattedArtisans = artisans
                    .slice(0, 3) // Limiter à 3 artisans
                    .map(artisan => ({
                        id: artisan.id,
                        name: `${artisan.first_name} ${artisan.last_name}`,
                        profession: artisan.profession || "Non spécifié",
                        rating: artisan.rating || 0,
                        image: artisan.profile_image || "/default-profile.png"
                    }));
                
                const formattedClients = clients
                    .slice(0, 3) // Limiter à 3 clients
                    .map(client => ({
                        id: client.id,
                        name: client.name,
                        email: client.email,
                        joinDate: new Date(client.created_at).toLocaleDateString(),
                        image: client.profile_image || "/default-profile.png"
                    }));
                
                setRecentArtisans(formattedArtisans);
                setRecentClients(formattedClients);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des données du dashboard:", error);
                setLoading(false);
            }
        };
        
        fetchDashboardData();
    }, []);

    const statCards = [
        {
            title: "Clients",
            value: stats.clientCount,
            icon: "users",
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Artisans",
            value: stats.artisanCount,
            icon: "tool",
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Nouvelles Inscriptions",
            value: stats.newRegistrationsCount,
            icon: "user-plus",
            color: "bg-purple-100 text-purple-600"
        }
    ];

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
                <p className="text-sm text-gray-500">Bienvenue sur votre tableau de bord d'administration</p>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {statCards.map((stat, index) => (
                            <StatCard
                                key={index}
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                color={stat.color}
                            />
                        ))}
                    </div>
                    
                    {/* Listes d'utilisateurs récents */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ListCard
                            title="Artisans récents"
                            items={recentArtisans}
                            renderItem={(artisan) => (
                                <div className="flex items-center p-4 hover:bg-gray-50 rounded-md transition-colors">
                                    <img
                                        src={artisan.image}
                                        alt={artisan.name}
                                        className="h-10 w-10 rounded-full object-cover mr-3"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{artisan.name}</p>
                                        <p className="text-sm text-gray-500">{artisan.profession}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-yellow-500 mr-1">★</span>
                                        <span className="text-sm">{artisan.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                            )}
                            actionButton={{
                                label: "Voir tous les artisans",
                                icon: <PlusCircle size={16} />,
                                onClick: () => window.location.href = '/admin/artisans'
                            }}
                        />
                        
                        <ListCard
                            title="Clients récents"
                            items={recentClients}
                            renderItem={(client) => (
                                <div className="flex items-center p-4 hover:bg-gray-50 rounded-md transition-colors">
                                    <img
                                        src={client.image}
                                        alt={client.name}
                                        className="h-10 w-10 rounded-full object-cover mr-3"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{client.name}</p>
                                        <p className="text-sm text-gray-500">{client.email}</p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Inscrit le {client.joinDate}
                                    </div>
                                </div>
                            )}
                            actionButton={{
                                label: "Voir tous les clients",
                                icon: <PlusCircle size={16} />,
                                onClick: () => window.location.href = '/admin/clients'
                            }}
                        />
                    </div>

                    {/* Section tableau récapitulatif */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Dernières activités</h2>
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Utilisateur
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* Données fictives pour l'exemple */}
                                    {[
                                        {
                                            user: "Thomas Dupont",
                                            type: "Client",
                                            action: "Nouvelle inscription",
                                            date: "Aujourd'hui, 10:45"
                                        },
                                        {
                                            user: "Marie Lambert",
                                            type: "Artisan",
                                            action: "Mise à jour du profil",
                                            date: "Aujourd'hui, 09:30"
                                        },
                                        {
                                            user: "Jean Martin",
                                            type: "Client",
                                            action: "Demande de devis",
                                            date: "Hier, 16:20"
                                        }
                                    ].map((activity, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {activity.user}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    activity.type === "Client" 
                                                        ? "bg-blue-100 text-blue-800" 
                                                        : "bg-green-100 text-green-800"
                                                }`}>
                                                    {activity.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {activity.action}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {activity.date}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Section résumé système */}
                    <div className="mt-8 bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">État du système</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-700 mb-2">Performance</h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">CPU</span>
                                            <span className="text-sm font-medium text-gray-700">45%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">Mémoire</span>
                                            <span className="text-sm font-medium text-gray-700">68%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">Stockage</span>
                                            <span className="text-sm font-medium text-gray-700">32%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-700 mb-2">Informations du serveur</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex justify-between">
                                        <span className="text-gray-600">Version:</span>
                                        <span className="font-medium">v1.2.4</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-600">Dernière mise à jour:</span>
                                        <span className="font-medium">27/04/2025</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-600">Temps de fonctionnement:</span>
                                        <span className="font-medium">14 jours</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-600">Base de données:</span>
                                        <span className="font-medium text-green-600">Connectée</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-600">Service API:</span>
                                        <span className="font-medium text-green-600">En ligne</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardContent;