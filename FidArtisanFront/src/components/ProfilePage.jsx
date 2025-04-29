import React, { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';
import { Pencil, MapPin, Phone, Mail } from 'lucide-react';
import { ProfileSection } from './ProfileSection';
import { OrdersSection } from './OrdersSection';
import { FavoriteArtisansSection } from './FavoriteArtisanSection';
import { ReviewsGivenSection } from './ReviewsGivenSection';
import api from '../services/api';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const [isEditingMain, setIsEditingMain] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    location: '',
    phone: '',
    email: '',
    profilePicture: '',
    bannerPicture: '',
    about: '',
    telephone: '',
    ville_id: null,
    sexe: '',
    description: '',
    langue: '',
  });

  const userId = localStorage.getItem('userId');
  const [isOwner, setIsOwner] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    ville_id: null,
    sexe: '',
    description: '',
    langue: '',
    photo: null,
  });
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get('/profile');
        if (response.data) {
          const { id, name, email, client, photo_url } = response.data;
          const profilePictureUrl =
            client?.photo?.startsWith('http')
              ? client.photo
              : client?.photo
              ? `http://127.0.0.1:8000/${client.photo}`
              : 'https://via.placeholder.com/150';

          setProfileData({
            name,
            email,
            telephone: client?.telephone,
            ville_id: client?.ville_id,
            sexe: client?.sexe,
            description: client?.description,
            langue: client?.langue,
            profilePicture: profilePictureUrl,
            location: '',
            phone: '',
            bannerPicture: '',
            about: '',
          });

          setFormData({
            name,
            email,
            telephone: client?.telephone,
            ville_id: client?.ville_id,
            sexe: client?.sexe,
            description: client?.description,
            langue: client?.langue,
            photo: null,
          });

          if (String(id) === userId) {
            setIsOwner(true);
          }
        }
      } catch (error) {
        console.error("Erreur profil:", error);
        toast.error("Erreur chargement profil.");
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

    fetchProfileData();
    fetchCities();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditingMain(true);
  };

  const handleCancelEdit = () => {
    setIsEditingMain(false);
    setFormData({
      ...formData,
      name: profileData.name,
      email: profileData.email,
      telephone: profileData.telephone,
      ville_id: profileData.ville_id,
      sexe: profileData.sexe,
      description: profileData.description,
      langue: profileData.langue,
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

      toast.success(response.data.message || 'Profil mis à jour.');
      setIsEditingMain(false);
      setProfileData(prev => ({
        ...prev,
        ...formData,
        profilePicture: response.data.photo_url || prev.profilePicture,
      }));
    } catch (error) {
      toast.error("Erreur mise à jour profil.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden mb-5">
        <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600" />
        <div className="px-6 py-5 relative">
          <div className="absolute -top-16 left-6">
          <div className="relative h-32 w-32 rounded-full border-4 border-white overflow-hidden">
  <img
    src={formData.photo ? URL.createObjectURL(formData.photo) : profileData.profilePicture}
    alt="Profil"
    className="w-full h-full object-cover"
  />
  {isEditingMain && (
    <label className="absolute bottom-1 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-md">
      <FaCamera className="h-6 w-8" />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.files[0] }))}
        className="hidden"
      />
    </label>
  )}
</div>


          </div>

          {isOwner && !isEditingMain && (
            <button className="absolute top-4 right-4 flex items-center rounded-full px-4 py-2 border border-blue-500 text-blue-500 hover:bg-blue-50" onClick={handleEditClick}>
              <Pencil size={16} className="mr-2" />
              <span>Modifier le profil</span>
            </button>
          )}

          {isEditingMain && (
            <div className="absolute top-4 right-4 space-x-2">
              <button onClick={handleCancelEdit} className="rounded-full px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50">Annuler</button>
              <button onClick={handleSaveClick} className="rounded-full px-4 py-2 bg-blue-500 text-white hover:bg-blue-700">Sauvegarder</button>
            </div>
          )}

          <div className="mt-16">
            <h1 className="text-2xl font-bold">
              {isEditingMain ? (
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm" />
              ) : (
                profileData.name
              )}
            </h1>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin size={16} className="mr-1" />
              {isEditingMain ? (
                <select name="ville_id" value={formData.ville_id || ''} onChange={handleInputChange} className="border-gray-300 rounded-md shadow-sm">
                  <option value="">Non renseigné</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.nom}</option>
                  ))}
                </select>
              ) : (
                <span>{cities.find(city => city.id === profileData.ville_id)?.nom || 'Non renseignée'}</span>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <Phone size={16} className="mr-2" />
                <span>{isEditingMain ? (
                  <input type="text" name="telephone" value={formData.telephone || ''} onChange={handleInputChange} className="w-48 border-gray-300 rounded-md shadow-sm" />
                ) : (
                  profileData.telephone || 'Téléphone non renseigné'
                )}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail size={16} className="mr-2" />
                <span>{isEditingMain ? (
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm" />
                ) : (
                  profileData.email
                )}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span>Sexe: {isEditingMain ? (
                  <select name="sexe" value={formData.sexe || ''} onChange={handleInputChange} className="border-gray-300 rounded-md shadow-sm">
                    <option value="">Non renseigné</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                  </select>
                ) : (
                  profileData.sexe || 'Non renseigné'
                )}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span>Langue: {isEditingMain ? (
                  <select name="langue" value={formData.langue || ''} onChange={handleInputChange} className="border-gray-300 rounded-md shadow-sm">
                    <option value="">Non renseignée</option>
                    <option value="Français">Français</option>
                    <option value="Anglais">Anglais</option>
                  </select>
                ) : (
                  profileData.langue || 'Non renseignée'
                )}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileSection
        title="À propos"
        content={profileData.description}
        formValue={formData.description}
        name="description"
        onChange={handleInputChange}
        isOwner={isOwner}
      />
      <OrdersSection isOwner={isOwner} />
      <FavoriteArtisansSection isOwner={isOwner} />
      <ReviewsGivenSection isOwner={isOwner} />
    </div>
  );
}
