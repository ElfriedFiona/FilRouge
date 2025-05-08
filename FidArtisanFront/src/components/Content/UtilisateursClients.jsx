import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, UserPlus, ChevronLeft, ChevronRight, Download, Upload } from 'lucide-react';
import UserService from '../../services/UserService';

const UtilisateurClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedClients, setSelectedClients] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip_code: '',
        country: 'France',
        status: 'actif'
    });

    const itemsPerPage = 10;

    useEffect(() => {
        fetchClients();
    }, [currentPage]);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const clients = await UserService.getAllClients(); // <- c'est un tableau !
    
            setClients(clients);
            setTotalPages(Math.ceil(clients.length / itemsPerPage)); // adapte si pagination
        } catch (error) {
            console.error("Erreur lors du chargement des clients:", error);
        } finally {
            setLoading(false);
        }
    };
    
    

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Revenir à la première page lors d'une recherche
        fetchClients();
    };

    const handleSelectClient = (clientId) => {
        if (selectedClients.includes(clientId)) {
            setSelectedClients(selectedClients.filter(id => id !== clientId));
        } else {
            setSelectedClients([...selectedClients, clientId]);
        }
    };

    const handleSelectAllClients = (e) => {
        if (e.target.checked) {
            setSelectedClients(clients.map(client => client.id));
        } else {
            setSelectedClients([]);
        }
    };

    const handleDeleteSelected = async () => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedClients.length} client(s) ?`)) {
            try {
                // Dans une application réelle, ceci serait un appel API de suppression par lots
                await Promise.all(selectedClients.map(id => UserService.deleteUser(id)));
                fetchClients();
                setSelectedClients([]);
            } catch (error) {
                console.error("Erreur lors de la suppression des clients:", error);
            }
        }
    };

    const openEditModal = (client) => {
        setCurrentClient(client);
        setFormData({
            first_name: client.first_name,
            last_name: client.last_name,
            email: client.email,
            phone: client.phone || '',
            address: client.address || '',
            city: client.city || '',
            zip_code: client.zip_code || '',
            country: client.country || 'France',
            status: client.status || 'actif'
        });
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setCurrentClient(null);
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            zip_code: '',
            country: 'France',
            status: 'actif'
        });
        setIsModalOpen(true);
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentClient) {
                // Mise à jour d'un client existant
                await UserService.updateUser(currentClient.id, {
                    ...formData,
                    role: 'client'  // S'assurer que le rôle reste "client"
                });
            } else {
                // Création d'un nouveau client
                await UserService.createUser({
                    ...formData,
                    role: 'client'
                });
            }
            setIsModalOpen(false);
            fetchClients();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du client:", error);
        }
    };

    const exportToCsv = () => {
        const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Adresse', 'Ville', 'Code Postal', 'Pays', 'Statut'];
        const csvData = clients.map(client => [
            client.first_name,
            client.last_name,
            client.email,
            client.phone || '',
            client.address || '',
            client.city || '',
            client.zip_code || '',
            client.country || '',
            client.status || 'actif'
        ]);
        
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'clients.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const importFromCsv = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const csvText = event.target.result;
            const lines = csvText.split('\n');
            const headers = lines[0].split(',');
            
            // Mapping entre les en-têtes CSV et les champs de l'API
            const headerMap = {
                'Prénom': 'first_name',
                'Nom': 'last_name',
                'Email': 'email',
                'Téléphone': 'phone',
                'Adresse': 'address',
                'Ville': 'city',
                'Code Postal': 'zip_code',
                'Pays': 'country',
                'Statut': 'status'
            };
            
            const clients = [];
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                
                const values = lines[i].split(',');
                const client = { role: 'client' };
                
                headers.forEach((header, index) => {
                    const apiField = headerMap[header.trim()];
                    if (apiField) {
                        client[apiField] = values[index]?.trim() || '';
                    }
                });
                
                clients.push(client);
            }
            
            // Dans une application réelle, ceci serait un appel API d'importation par lots
            try {
                for (const client of clients) {
                    await UserService.createUser(client);
                }
                fetchClients();
                alert('Importation terminée avec succès!');
            } catch (error) {
                console.error("Erreur lors de l'importation:", error);
                alert("Une erreur s'est produite lors de l'importation.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestion des Clients</h1>
                    <p className="text-sm text-gray-500">Gérez vos clients et leurs informations</p>
                </div>
                <div className="flex space-x-2">
                    <button 
                        onClick={openAddModal}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        <UserPlus size={16} className="mr-2" />
                        Ajouter un client
                    </button>
                </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Rechercher un client..."
                                className="w-full px-4 py-2 border rounded-md pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                    </form>
                    <div className="flex items-center space-x-2">
                        <button 
                            className="flex items-center px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
                            onClick={() => document.getElementById('csvImport').click()}
                        >
                            <Upload size={16} className="mr-2" />
                            Importer
                        </button>
                        <input 
                            id="csvImport" 
                            type="file" 
                            accept=".csv" 
                            className="hidden" 
                            onChange={importFromCsv}
                        />
                        <button 
                            className="flex items-center px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
                            onClick={exportToCsv}
                        >
                            <Download size={16} className="mr-2" />
                            Exporter
                        </button>
                        <button className="flex items-center px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">
                            <Filter size={16} className="mr-2" />
                            Filtres
                        </button>
                    </div>
                </div>
            </div>

            {/* Liste des clients */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 w-10">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        onChange={handleSelectAllClients}
                                        checked={selectedClients.length === clients.length && clients.length > 0}
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Téléphone
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ville
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date d'inscription
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-4 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : clients.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                                        Aucun client trouvé
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-300"
                                                checked={selectedClients.includes(client.id)}
                                                onChange={() => handleSelectClient(client.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                <img 
    className="h-10 w-10 rounded-full object-cover" 
    src={client.client?.photo ? `http://127.0.0.1:8000/storage/uploads/${client.client.photo}` : "/default-profile.png"} 
    alt={client.name}
/>

                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {client.name} 
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{client.email}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{client.client.telephone || "—"}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{client.client.ville || "—"}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                client.status === 'actif' ? 'bg-green-100 text-green-800' : 
                                                client.status === 'inactif' ? 'bg-red-100 text-red-800' : 
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {client.etat || 'actif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(client.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
    <div className="flex justify-end space-x-2">
        <button 
            onClick={() => openEditModal(client)} 
            className="text-blue-600 hover:text-blue-900"
        >
            <Edit size={16} />
        </button>

        <button 
            onClick={() => {
                if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${client.name} ?`)) {
                    UserService.deleteUser(client.id).then(fetchClients);
                }
            }} 
            className="text-red-600 hover:text-red-900"
        >
            <Trash2 size={16} />
        </button>

        <button 
            onClick={async () => {
                const newStatus = client.etat === 'actif' ? 'inactif' : 'actif';
                if (window.confirm(`Voulez-vous vraiment changer l'état de ${client.name} à "${newStatus}" ?`)) {
                    try {
                        await UserService.changeUserStatus(client.id, newStatus);
                        fetchClients(); // Recharger la liste
                    } catch (error) {
                        alert('Erreur lors du changement de statut');
                    }
                }
            }}
            className="text-yellow-600 hover:text-yellow-800"
        >
            {client.etat === 'actif' ? 'Désactiver' : 'Activer'}
        </button>
    </div>
</td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination et actions en lot */}
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex items-center">
                        {selectedClients.length > 0 && (
                            <button 
                                onClick={handleDeleteSelected}
                                className="ml-3 inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                            >
                                <Trash2 size={16} className="mr-2" />
                                Supprimer ({selectedClients.length})
                            </button>
                        )}
                    </div>
                    <div className="flex items-center justify-between sm:justify-end">
                        <div className="text-sm text-gray-700 mr-4">
                            <span>Page {currentPage} sur {totalPages}</span>
                        </div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                    currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                disabled={currentPage === totalPages}
                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                    currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Modal pour ajouter/modifier un client */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                        <div className="flex justify-between items-center border-b px-6 py-4">
                            <h3 className="text-lg font-medium">
                                {currentClient ? "Modifier un client" : "Ajouter un client"}
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Adresse
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ville
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Code postal
                                    </label>
                                    <input
                                        type="text"
                                        name="zip_code"
                                        value={formData.zip_code}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pays
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Statut
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    >
                                        <option value="actif">Actif</option>
                                        <option value="inactif">Inactif</option>
                                        <option value="en_attente">En attente</option>
                                    </select>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    {currentClient ? "Mettre à jour" : "Créer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UtilisateurClients;