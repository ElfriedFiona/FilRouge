import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Mail,
    Megaphone,
    User,
    Search,
    LogOut,
    PlusCircle,
    ArrowRight,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const UserData = {
    name: null,
    role: null,
    status: null,
    link: null,
    image: null,
    actions: null, // Ajout de la propriété actions
}

const recentArtisans = [
    {
        name: 'John Smith', role: 'Electrician', status: 'Active', link: '#', image: '/placeholder-avatar.jpg', actions: (
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4">View</button>
        )
    },
    {
        name: 'Alice Johnson', role: 'Plumber', status: 'Active', link: '#', image: '/placeholder-avatar.jpg', actions: (
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4">View</button>
        )
    },
    {
        name: 'Bob Williams', role: 'Carpenter', status: 'Inactive', link: '#', image: '/placeholder-avatar.jpg', actions: (
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4">View</button>
        )
    },
];

const recentClients = [
    {
        name: 'Peter Jones', role: 'Client', status: 'Active', link: '#', image: '/placeholder-avatar.jpg', actions: (
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4">View</button>
        )
    },
    {
        name: 'Mary Brown', role: 'Client', status: 'Active', link: '#', image: '/placeholder-avatar.jpg', actions: (
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4">View</button>
        )
    },
    {
        name: 'David Wilson', role: 'Client', status: 'Inactive', link: '#', image: '/placeholder-avatar.jpg', actions: (
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4">View</button>
        )
    },
];

// Contenu des différentes sections
const DashboardContent = () => (
    <>
        <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Admin</h2>
            <p className="text-gray-600">
                Aujourd'hui, 15 nouvelles inscriptions et 10 signalements à vérifier. Consultez les statistiques et gérez la plateforme efficacement !
            </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Clients" value="1000" />
            <StatCard title="Artisans" value="1500" />
            <StatCard title="Nouvelles Inscriptions" value="15" icon={<PlusCircle className="h-6 w-6 text-white" />} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ListCard title="Liste des derniers artisans" users={recentArtisans} />
            <ListCard title="Liste des derniers clients" users={recentClients} />
        </section>
    </>
);

const UtilisateurClientsContent = () => (
    <section>
        <h2 className="text-2xl font-semibold mb-4">Clients</h2>
        <p className="mb-4">
            Voici la liste des clients. Vous pouvez les gérer ici.
        </p>
        <div className="rounded-md border">
            <div className="p-6">
                <table>
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:first-child]:pl-0 [&:last-child]:pr-0">Nom</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:first-child]:pl-0 [&:last-child]:pr-0">Role</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:first-child]:pl-0 [&:last-child]:pr-0">Status</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:first-child]:pl-0 [&:last-child]:pr-0">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr]:border-b">
                        {recentClients.map((client, index) => (
                            <tr key={index}>
                                <td className="p-4 align-middle font-medium [&:first-child]:pl-0 [&:last-child]:pr-0">{client.name}</td>
                                <td className="p-4 align-middle [&:first-child]:pl-0 [&:last-child]:pr-0">{client.role}</td>
                                <td className="p-4 align-middle [&:first-child]:pl-0 [&:last-child]:pr-0">
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${client.status === 'Active' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                                        {client.status}
                                    </span>
                                </td>
                                <td className="p-4 align-middle [&:first-child]:pl-0 [&:last-child]:pr-0">{client.actions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </section>
);

const UtilisateurArtisansContent = () => (
    <section>
        <h2 className="text-2xl font-semibold mb-4">Artisans</h2>
        <p className="mb-4">
            Voici la liste des artisans. Vous pouvez les gérer ici.
        </p>
        <div className="rounded-md border">
            <div className="p-6">
                <table>
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:first-child]:pl-0 [&:last-child]:pr-0">Nom</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:first-child]:pl-0 [&:last-child]:pr-0">Role</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:first-child]:pl-0 [&:last-child]:pr-0">Status</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:first-child]:pl-0 [&:last-child]:pr-0">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr]:border-b">
                        {recentArtisans.map((artisan, index) => (
                            <tr key={index}>
                                <td className="p-4 align-middle font-medium [&:first-child]:pl-0 [&:last-child]:pr-0">{artisan.name}</td>
                                <td className="p-4 align-middle [&:first-child]:pl-0 [&:last-child]:pr-0">{artisan.role}</td>
                                <td className="p-4 align-middle [&:first-child]:pl-0 [&:last-child]:pr-0">
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${artisan.status === 'Active' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                                        {artisan.status}
                                    </span>
                                </td>
                                <td className="p-4 align-middle [&:first-child]:pl-0 [&:last-child]:pr-0">{artisan.actions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </section>
);

const CalendrierContent = () => (
    <section>
        <h2 className="text-2xl font-semibold mb-4">Calendrier</h2>
        <p className="mb-4">
            Ceci est le calendrier de la plateforme. Vous pouvez voir les événements, les rendez-vous, etc.
        </p>
        {/* Ajouter ici le contenu spécifique au calendrier */}
        <div className="rounded-md border">
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Calendrier des événements</h3>
                <p>Contenu du calendrier</p>
            </div>
        </div>
    </section>
);

const MailBoxContent = () => (
    <section>
        <h2 className="text-2xl font-semibold mb-4">Boîte aux lettres</h2>
        <p className="mb-4">
            Ceci est votre boîte aux lettres. Vous pouvez voir vos messages, en envoyer, etc.
        </p>
        {/* Ajouter ici le contenu spécifique à la boîte aux lettres */}
        <div className="rounded-md border">
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Vos Messages</h3>
                <p>Contenu de la boite aux lettres</p>
            </div>
        </div>
    </section>
);

const AnnoncesContent = () => (
    <section>
        <h2 className="text-2xl font-semibold mb-4">Annonces</h2>
        <p className="mb-4">
            Ceci est la page des annonces. Vous pouvez voir les annonces, en créer, etc.
        </p>
        {/* Ajouter ici le contenu spécifique aux annonces */}
        <div className="rounded-md border">
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Liste des Annonces</h3>
                <p>Contenu des annonces</p>
            </div>
        </div>
    </section>
);

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('Dashboard');
    const [isUtilisateurOpen, setIsUtilisateurOpen] = useState(false);

    const renderContent = () => {
        switch (activeSection) {
            case 'Dashboard':
                return <DashboardContent />;
            case 'UtilisateurClients':
                return <UtilisateurClientsContent />;
            case 'UtilisateurArtisans':
                return <UtilisateurArtisansContent />;
            case 'Calendrier':
                return <CalendrierContent />;
            case 'MailBox':
                return <MailBoxContent />;
            case 'Annonces':
                return <AnnoncesContent />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800">Fid'Artisan</h1>
                </div>
                <nav className="px-4 space-y-2">
                    <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeSection === 'Dashboard' ? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}
                        onClick={() => setActiveSection('Dashboard')}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                    </button>
                    <div className="space-y-1">
                        <button
                            className={`flex w-full justify-start items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeSection.startsWith('Utilisateur') ? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}
                            onClick={() => setIsUtilisateurOpen(!isUtilisateurOpen)}
                        >
                            <Users className="h-4 w-4" />
                            <span className="ml-2">Utilisateur</span>
                            {isUtilisateurOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
                        </button>
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
                    <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeSection === 'Calendrier' ? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}
                        onClick={() => setActiveSection('Calendrier')}
                    >
                        <Calendar className="h-4 w-4" />
                        <span>Calendrier</span>
                    </button>
                    <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeSection === 'MailBox'? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}
                        onClick={() => setActiveSection('MailBox')}
                    >
                        <Mail className="h-4 w-4" />
                        <span>MailBox</span>
                    </button>
                    <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${activeSection === 'Annonces' ? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}
                        onClick={() => setActiveSection('Annonces')}
                    >
                        <Megaphone className="h-4 w-4" />
                        <span>Annonces</span>
                    </button>
                </nav>
                <div className="mt-auto p-4">
                    <button
                        className="flex w-full justify-start items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100"
                        onClick={() => setActiveSection('Dashboard')} // You'd likely have a logout function here
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Top Bar */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <User className="mr-2 h-8 w-8 text-gray-700" />
                        <span className="text-xl font-semibold">Admin</span>
                        <span className="text-gray-500 ml-1">fiona</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Rechercher des utilisateurs"
                            className="w-64 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4">
                            <Search className="h-5 w-5" />
                        </button>
                        <div className="relative rounded-full overflow-hidden h-9 w-9">
                            <img src="/placeholder-avatar.jpg" alt="Fiona" className="object-cover h-full w-full" />
                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600">F</span>
                            </div>
                        </div>
                    </div>
                </header>
                {renderContent()}

                {/* Footer */}
                <footer className="mt-12 text-center text-gray-500 text-sm">
                    Copyright © {new Date().getFullYear()} Fid'Artisan. All rights reserved.
                </footer>
            </main>
        </div>
    );
};

// Helper Components
const NavItem = ({ icon, text, active, onClick, indent }) => (
    <button
        className={`flex w-full justify-start items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-gray-100 ${active ? 'bg-blue-100 text-blue-600 font-semibold' : ''} ${indent ? 'pl-8' : ''}`}
        onClick={onClick}
    >
        {icon && icon}
        <span className="ml-2">{text}</span>
    </button>
);

const StatCard = ({ title, value, icon }) => (
    <div className="rounded-md bg-blue-500 text-white p-6">
        <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium uppercase">{title}</h3>
            {icon && icon}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <button className="inline-flex items-center text-sm font-medium text-blue-100 hover:underline mt-2">
            Plus d'infos <ArrowRight className="ml-1 h-4 w-4" />
        </button>
    </div>
);

const ListCard = ({ title, users }) => (
    <div className="rounded-md border">
        <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <div className="space-y-4">
                {users.map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative rounded-full overflow-hidden h-9 w-9">
                                <img src={user.image} alt={user.name} className="object-cover h-full w-full" />
                                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-600">{user.name.substring(0, 1).toUpperCase()}</span>
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.role}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${user.status === 'Active' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                                {user.status}
                            </span>
                            <button className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline">
                                Voir Plus <ArrowRight className="ml-1 h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default Dashboard;