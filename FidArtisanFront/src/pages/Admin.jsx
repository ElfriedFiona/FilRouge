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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
            <Button size="sm">View</Button>
        )
    },
    {
        name: 'Alice Johnson', role: 'Plumber', status: 'Active', link: '#', image: '/placeholder-avatar.jpg', actions: (
            <Button size="sm">View</Button>
        )
    },
    {
        name: 'Bob Williams', role: 'Carpenter', status: 'Inactive', link: '#', image: '/placeholder-avatar.jpg', actions: (
            <Button size="sm">View</Button>
        )
    },
];

const recentClients = [
    {
        name: 'Peter Jones', role: 'Client', status: 'Active', link: '#', image: '/placeholder-avatar.jpg', actions: (
            <Button size="sm">View</Button>
        )
    },
    {
        name: 'Mary Brown', role: 'Client', status: 'Active', link: '#', image: '/placeholder-avatar.jpg', actions: (
            <Button size="sm">View</Button>
        )
    },
    {
        name: 'David Wilson', role: 'Client', status: 'Inactive', link: '#', image: '/placeholder-avatar.jpg', actions: (
            <Button size="sm">View</Button>
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
        <Card>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentClients.map((client, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{client.name}</TableCell>
                                <TableCell>{client.role}</TableCell>
                                <TableCell>
                                    <Badge variant={client.status === 'Active' ? "success" : "destructive"}>
                                        {client.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{client.actions}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </section>
);

const UtilisateurArtisansContent = () => (
    <section>
        <h2 className="text-2xl font-semibold mb-4">Artisans</h2>
        <p className="mb-4">
            Voici la liste des artisans. Vous pouvez les gérer ici.
        </p>
        <Card>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentArtisans.map((artisan, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{artisan.name}</TableCell>
                                <TableCell>{artisan.role}</TableCell>
                                <TableCell>
                                    <Badge variant={artisan.status === 'Active' ? "success" : "destructive"}>
                                        {artisan.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{artisan.actions}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </section>
);

const CalendrierContent = () => (
    <section>
        <h2 className="text-2xl font-semibold mb-4">Calendrier</h2>
        <p className="mb-4">
            Ceci est le calendrier de la plateforme. Vous pouvez voir les événements, les rendez-vous, etc.
        </p>
        {/* Ajouter ici le contenu spécifique au calendrier */}
        <Card>
            <CardHeader>
                <CardTitle>Calendrier des événements</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Contenu du calendrier</p>
            </CardContent>
        </Card>
    </section>
);

const MailBoxContent = () => (
    <section>
        <h2 className="text-2xl font-semibold mb-4">Boîte aux lettres</h2>
        <p className="mb-4">
            Ceci est votre boîte aux lettres. Vous pouvez voir vos messages, en envoyer, etc.
        </p>
        {/* Ajouter ici le contenu spécifique à la boîte aux lettres */}
        <Card>
            <CardHeader>
                <CardTitle>Vos Messages</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Contenu de la boite aux lettres</p>
            </CardContent>
        </Card>
    </section>
);

const AnnoncesContent = () => (
    <section>
        <h2 className="text-2xl font-semibold mb-4">Annonces</h2>
        <p className="mb-4">
            Ceci est la page des annonces. Vous pouvez voir les annonces, en créer, etc.
        </p>
        {/* Ajouter ici le contenu spécifique aux annonces */}
        <Card>
            <CardHeader>
                <CardTitle>Liste des Annonces</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Contenu des annonces</p>
            </CardContent>
        </Card>
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
                    <NavItem
                        icon={<LayoutDashboard />}
                        text="Dashboard"
                        active={activeSection === 'Dashboard'}
                        onClick={() => setActiveSection('Dashboard')}
                    />
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start text-gray-700 hover:bg-gray-100",
                                activeSection.startsWith('Utilisateur') && "bg-blue-100 text-blue-600 font-semibold"
                            )}
                            onClick={() => setIsUtilisateurOpen(!isUtilisateurOpen)}
                        >
                            <Users />
                            <span className="ml-2">Utilisateur</span>
                            {isUtilisateurOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
                        </Button>
                        {isUtilisateurOpen && (
                            <div className="ml-8 space-y-1">
                                <NavItem
                                    text="Clients"
                                    active={activeSection === 'UtilisateurClients'}
                                    onClick={() => setActiveSection('UtilisateurClients')}
                                    indent
                                />
                                <NavItem
                                    text="Artisans"
                                    active={activeSection === 'UtilisateurArtisans'}
                                    onClick={() => setActiveSection('UtilisateurArtisans')}
                                    indent
                                />
                            </div>
                        )}
                    </div>
                    <NavItem
                        icon={<Calendar />}
                        text="Calendrier"
                        active={activeSection === 'Calendrier'}
                        onClick={() => setActiveSection('Calendrier')}
                    />
                    <NavItem
                        icon={<Mail />}
                        text="MailBox"
                        active={activeSection === 'MailBox'}
                        onClick={() => setActiveSection('MailBox')}
                    />
                    <NavItem
                        icon={<Megaphone />}
                        text="Annonces"
                        active={activeSection === 'Annonces'}
                        onClick={() => setActiveSection('Annonces')}
                    />
                </nav>
                <div className="mt-auto p-4">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-700 hover:bg-gray-100"
                        onClick={() => setActiveSection('Dashboard')} // You'd likely have a logout function here
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
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
                        <Input
                            type="text"
                            placeholder="Rechercher des utilisateurs"
                            className="w-64"
                        />
                        <Button variant="ghost" className="text-gray-700 hover:bg-gray-100">
                            <Search className="h-5 w-5" />
                        </Button>
                        <Avatar>
                            <AvatarImage src="/placeholder-avatar.jpg" alt="Fiona" />
                            <AvatarFallback>F</AvatarFallback>
                        </Avatar>
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
    <Button
        variant="ghost"
        className={cn(
            "w-full justify-start text-gray-700 hover:bg-gray-100",
            active && "bg-blue-100 text-blue-600 font-semibold",
            indent && "pl-8" // Add left padding for indentation
        )}
        onClick={onClick}
    >
        {icon && icon}
        <span className="ml-2">{text}</span>
    </Button>
);

const StatCard = ({ title, value, icon }) => (
    <Card className="bg-blue-500 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase">{title}</CardTitle>
            {icon && icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <Button variant="link" className="text-white px-0 mt-2">
                Plus d'infos <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
        </CardContent>
    </Card>
);

const ListCard = ({ title, users }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {users.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.role}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={cn(
                            "text-xs font-semibold px-2 py-1 rounded",
                            user.status === 'Active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        )}>
                            {user.status}
                        </span>
                        <Button variant="link" className="text-blue-600 px-0">
                            Voir Plus <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </CardContent>
    </Card>
);

export default Dashboard;