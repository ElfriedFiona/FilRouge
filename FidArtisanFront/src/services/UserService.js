// Service pour gérer les appels API liés aux utilisateurs
const API_URL = 'http://localhost:8000/api';

export const UserService = {
    // Obtenir tous les utilisateurs
    getAllUsers: async () => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Échec de la récupération des utilisateurs');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            throw error;
        }
    },
    
    // Obtenir tous les artisans
    getArtisans: async () => {
        try {
            const response = await fetch(`${API_URL}/users/artisans`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Échec de la récupération des artisans');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des artisans:', error);
            throw error;
        }
    },
    
    // Obtenir un utilisateur par ID
    getUserById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Échec de la récupération de l'utilisateur avec ID ${id}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'utilisateur avec ID ${id}:`, error);
            throw error;
        }
    },

    getAllClients: async () => {
        try {
            const response = await fetch(`${API_URL}/users/clients`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Échec de la récupération des clients');
            }
    
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des clients:', error);
            throw error;
        }
    },
    
    
    // Changer l'état d'un utilisateur (actif/inactif)
    // Changer l'état d'un utilisateur (actif/inactif)
changeUserStatus: async (userId, newStatus) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/etat`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ etat: newStatus })
        });

        if (!response.ok) {
            throw new Error(`Échec du changement d'état de l'utilisateur avec ID ${userId}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Erreur lors du changement d'état de l'utilisateur avec ID ${userId}:`, error);
        throw error;
    }
}

};

export default UserService;