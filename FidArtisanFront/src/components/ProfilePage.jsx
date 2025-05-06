import React, { useState, useEffect } from 'react';
import { Pencil, MapPin, Phone, Mail, Camera } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Données complètes du profil et relations
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    client: {
      telephone: '',
      langue: '',
      sexe: '',
      ville: '',
      photo: '',
      description: ''
    },
    favorites: [],
    avisParArtisans: [],
    services: [] // Nouvelle propriété pour les services en cours
  });
  
  // Formulaire pour l'édition
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    ville_id: '',
    sexe: '',
    description: '',
    langue: '',
    photo: null
  });
  
  const [cities, setCities] = useState([]);
  const userId = localStorage.getItem('userId');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Récupérer l'ID de l'URL si présent
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');
    
    // Déterminer quel ID utiliser (URL ou utilisateur connecté)
    const profileId = idFromUrl || userId;
    
    // Vérifier si c'est le propriétaire du profil
    setIsOwner(profileId === userId);
    
    // Charger les données du profil
    fetchUserData(profileId);
    fetchCities();
  }, [userId]);

  // Charger le profil complet avec l'endpoint users/{id}
  const fetchUserData = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/users/${id}`);
      setUserData(response.data);
      
      // Préparer le formulaire avec les données existantes
      const { name, email, client } = response.data;
      setFormData({
        name: name || '',
        email: email || '',
        telephone: client?.telephone || '',
        ville_id: client?.ville_id || '',
        sexe: client?.sexe || '',
        description: client?.description || '',
        langue: client?.langue || '',
        photo: null
      });
    } catch (error) {
      console.error("Erreur chargement profil:", error);
      toast.error("Erreur lors du chargement du profil.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await api.get('/villes');
      setCities(res.data);
    } catch (err) {
      toast.error("Erreur chargement villes.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Restaurer les données du formulaire
    const { name, email, client } = userData;
    setFormData({
      name: name || '',
      email: email || '',
      telephone: client?.telephone || '',
      ville_id: client?.ville_id || '',
      sexe: client?.sexe || '',
      description: client?.description || '',
      langue: client?.langue || '',
      photo: null
    });
  };

  const handleSaveClick = async () => {
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          data.append(key, value);
        }
      });
      data.append('_method', 'PUT');

      const response = await api.post('/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(response.data.message || 'Profil mis à jour avec succès.');
      setIsEditing(false);
      
      // Recharger les données du profil après la mise à jour
      fetchUserData(userId);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil.");
    }
  };

  // Obtenir l'URL de la photo de profil
  const getProfilePicture = () => {
    if (!userData.client?.photo) return 'https://via.placeholder.com/150';
    
    if (userData.client.photo.startsWith('http')) {
      return userData.client.photo;
    }
    
    return `http://127.0.0.1:8000/storage/uploads/${userData.client.photo}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Afficher le sexe en format lisible
  const displaySexe = (sexe) => {
    if (sexe === 'M') return 'Homme';
    if (sexe === 'F') return 'Femme';
    return 'Non renseigné';
  };

  return (
    <div className="container mx-auto p-4">
      {/* En-tête du profil */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="h-32  bg-blue-400  relative">
          {isOwner && (
            <button 
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
              onClick={handleEditClick}
              disabled={isEditing}
            >
              <Pencil size={16} />
            </button>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row p-4 relative">
          <div className="md:w-1/4 flex justify-center">
            <div className="relative -mt-16">
              <img 
                src={getProfilePicture()} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {isOwner && isEditing && (
                <label className="absolute bottom-0 right-0 bg-gray-100 p-1 rounded-full cursor-pointer">
                  <Camera size={16} />
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          </div>
          
          <div className="md:w-3/4 mt-4 md:mt-0">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ville</label>
                  <select
                    name="ville_id"
                    value={formData.ville_id}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  >
                    <option value="">Sélectionnez une ville</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.nom}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sexe</label>
                  <select
                    name="sexe"
                    value={formData.sexe}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  >
                    <option value="">Non spécifié</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Langue</label>
                  <input
                    type="text"
                    name="langue"
                    value={formData.langue}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  ></textarea>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={handleSaveClick}
                  >
                    Enregistrer
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    onClick={handleCancelEdit}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <div className="mt-2 text-gray-600 flex flex-col gap-1">
                  <div className="flex items-center">
                    <Mail size={16} className="mr-2" />
                    {userData.email}
                  </div>
                  {userData.client?.telephone && (
                    <div className="flex items-center">
                      <Phone size={16} className="mr-2" />
                      {userData.client.telephone}
                    </div>
                  )}
                  {userData.client?.ville && (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2" />
                      {userData.client.ville}
                    </div>
                  )}
                </div>
                {userData.client?.description && (
                  <div className="mt-4">
                    <h3 className="font-medium">À propos</h3>
                    <p className="text-gray-600">{userData.client.description}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Informations Personnelles */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Informations Personnelles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium mb-2">Informations de contact</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Nom</span>
                <span className="block font-medium">{userData.name || 'Non renseigné'}</span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Email</span>
                <span className="block font-medium">{userData.email || 'Non renseigné'}</span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Téléphone</span>
                <span className="block">{userData.client?.telephone || 'Non renseigné'}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Ville</span>
                <span className="block">{userData.client?.ville || 'Non renseignée'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">Autres informations</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Sexe</span>
                <span className="block">{displaySexe(userData.client?.sexe)}</span>
              </div>
              <div className="mb-3">
                <span className="block text-sm text-gray-500">Langue</span>
                <span className="block">{userData.client?.langue || 'Non renseignée'}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Description</span>
                <span className="block">{userData.client?.description || 'Aucune description'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Services en cours */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Services Demandés En Cours</h2>
        
        {userData.services && userData.services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userData.services.slice(0, 4).map((service) => (
              <div key={service.id} className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">{service.service}</h3>
                <div className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Statut:</span>
                    <span className="font-medium">{service.statut}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Date souhaitée:</span>
                    <span>{service.date_limite}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Budget:</span>
                    <span>{service.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Artisan:</span>
                    <a 
                      href={`/artisans/${service.artisan.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {service.artisan.name}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">Aucun service en cours pour le moment.</p>
          </div>
        )}
      </div>
      
      {/* Artisans Favoris */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Artisans Favoris</h2>
        
        {userData.favorites && userData.favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.favorites.map((favorite) => (
              <div key={favorite.id} className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <img
                    src={favorite.profilePicture || 'https://via.placeholder.com/60'}
                    alt={favorite.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{favorite.name}</h3>
                    <p className="text-sm text-gray-600">{favorite.profession}</p>
                    <div className="mt-2">
                      <a
                        href={`/artisans/${favorite.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Voir le profil
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">Aucun artisan favori pour le moment.</p>
          </div>
        )}
      </div>
      
      {/* Avis Reçus */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Avis Reçus</h2>
        
        {userData.avisParArtisans && userData.avisParArtisans.length > 0 ? (
          <div className="space-y-4">
            {userData.avisParArtisans.map((review, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="flex items-start">
                  {/* <img
                    src={review.artisan.photo || 'https://via.placeholder.com/40'}
                    alt={review.artisan.name}
                    className="w-10 h-10 rounded-full object-cover mr-4"
                  /> */}
                  <div className="w-8 h-8 mr-3 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {review.artisan.name.charAt(0)}
              </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{review.artisan.name}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < review.note ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({review.note}/5)</span>
                    </div>
                    <p className="mt-2 text-gray-700">{review.commentaire}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">Aucun avis reçu pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}