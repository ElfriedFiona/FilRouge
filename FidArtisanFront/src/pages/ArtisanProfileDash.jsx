import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import CreateServiceForm from '../components/CreateServiceForm';
import {ProfileSection }   from '../components/ProfileArtisanSection';
import {ServicesSection }  from '../components/ServicesSection';
import {ProjectsSection }  from '../components/ProjectsSection';
import SkillsSection      from '../components/SkillsSection';
import {ExperienceSection} from '../components/ExperienceSection';
import ReviewsSection     from '../components/ReviewsSection';
import {LanguagesSection } from '../components/LanguagesSection';

/**
 * Composant ProfileCompletionGuide
 * Affiche un guide de complétion du profil avec une barre de progression.
 */
const ProfileCompletionGuide = ({ percentage, missingFields, onEditClick }) => {
  console.log('ProfileCompletionGuide:', { percentage, missingFields });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div className="px-6 py-5">
        <h2 className="text-xl font-bold mb-3">Complétez votre profil pour attirer plus de clients!</h2>
        
        {/* Barre de progression */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className={`h-4 rounded-full ${
              percentage < 30 ? 'bg-red-500' : percentage < 70 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        {/* Affichage du pourcentage et des éléments restants */}
        <div className="flex justify-between text-sm mb-4">
          <span>{percentage}% complété</span>
          <span>{missingFields.length} éléments restants</span>
        </div>
        
        {/* Liste des champs manquants */}
        {missingFields.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Éléments à compléter:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {missingFields.map((field, index) => (
                <li key={index} className="text-gray-700">{field}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Bouton pour compléter le profil */}
        <button 
          onClick={onEditClick} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Compléter mon profil
        </button>
      </div>
    </div>
  );
};

export default function ArtisanProfile() {
  const { id } = useParams();
  const [userId, setUserId] = useState(null);
  const [artisan, setArtisan] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    photo: '',
    name: '',
    profession: '',
    profession_id: '',
    location: '',
    ville_id: '',
    telephone: '',
    email: '',
    description: '',
    languages: [],
    services: [],
    projets: [],
    competences: [],
    experiences: [],
    reviews: [],
    sexe: '',
  });
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [tempBasicInfo, setTempBasicInfo] = useState({});
  const [newPhoto, setNewPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  // New states for professions and cities
  const [professions, setProfessions] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // New state for profile completion
  const [profileCompletion, setProfileCompletion] = useState({
    percentage: 0,
    missingFields: [],
    showGuidance: false
  });

  useEffect(() => {
    console.log('useEffect déclenché, ID de l\'artisan:', id);
    api.get(`/artisans/${id}/profil`)
      .then(({ data }) => {
        console.log('Réponse de l\'API /artisans/${id}/profil:', data);
        const langs = data.langue ? [{ language: data.langue, level: "Intermédiaire", proficiency: 60 }] : [];
        const mappedProfile = {
          photo: data.photo?.startsWith('http') ? data.photo : `http://127.0.0.1:8000/storage/uploads/${data.photo}`,
          name: data.user?.name || '',
          profession: data.profession?.nom || '',
          profession_id: data.profession_id || '',
          location: data.ville?.nom || '',
          ville_id: data.ville_id || '',
          telephone: data.telephone || '',
          email: data.user?.email || '',
          description: data.description || '',
          languages: langs,
          services: data.servicesproposer || [],
          projets: data.projets || [],
          competences: data.competences || [],
          experiences: data.experiences || [],
          reviews: (data.avis || []).map(a => ({ id: a.id, author: a.user?.name || '', rating: a.note, date: new Date(a.created_at).toLocaleDateString('fr-FR'), comment: a.commentaire || '' })),
          sexe: data.sexe || '',
        };
        setArtisan({ ...data, _mappedLanguages: langs });
        setProfile(mappedProfile);
        setTempBasicInfo(mappedProfile);
        console.log('État profile initialisé:', mappedProfile);
        
        // Calculer le pourcentage de complétion du profil
        calculateProfileCompletion(mappedProfile);
      })
      .catch(error => console.error('Erreur lors de la récupération du profil:', error));

    api.get('/profile')
      .then(({ data }) => {
        console.log('Réponse de l\'API /profile (utilisateur connecté):', data);
        setUserId(data.id);
        const isUserArtisan = data.role === 'artisan';
        const ownerArtisanId = data.artisan?.id;
        if (isUserArtisan && parseInt(id) === ownerArtisanId) {
          setIsOwner(true);
          console.log('L\'utilisateur est le propriétaire de ce profil.');
        } else {
          setIsOwner(false);
          console.log('L\'utilisateur n\'est pas le propriétaire de ce profil.');
        }
      })
      .catch(err => console.error('Erreur profil utilisateur', err));
  }, [id]);
  
  // Fonction pour calculer le pourcentage de complétion du profil
  const calculateProfileCompletion = (profileData) => {
    const criticalFields = [
      { name: 'photo', label: 'Photo de profil', completed: !!profileData.photo },
      { name: 'description', label: 'Description', completed: !!profileData.description && profileData.description.length > 50 },
      { name: 'profession', label: 'Profession', completed: !!profileData.profession },
      { name: 'location', label: 'Ville', completed: !!profileData.location },
      { name: 'telephone', label: 'Téléphone', completed: !!profileData.telephone },
      { name: 'services', label: 'Services proposés', completed: profileData.services.length > 0 },
      { name: 'competences', label: 'Compétences', completed: profileData.competences.length > 0 },
      { name: 'experiences', label: 'Expériences', completed: profileData.experiences.length > 0 }
    ];
    
    const completedFields = criticalFields.filter(field => field.completed).length;
    const percentage = Math.round((completedFields / criticalFields.length) * 100);
    const missingFields = criticalFields.filter(field => !field.completed).map(field => field.label);
    
    setProfileCompletion({
      percentage,
      missingFields,
      showGuidance: percentage < 70 && isOwner
    });
    
    console.log(`Profil complété à ${percentage}%. Champs manquants: ${missingFields.join(', ')}`);
  };

  // Function to load professions and cities when edit mode is activated
  const loadFormData = async () => {
    setIsLoading(true);
    try {
      // Load professions
      const professionsResponse = await api.get('/professions');
      setProfessions(professionsResponse.data);
      console.log('Professions chargées:', professionsResponse.data);
      
      // Load cities
      const citiesResponse = await api.get('/villes');
      setCities(citiesResponse.data);
      console.log('Villes chargées:', citiesResponse.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données de formulaire:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBasicInfo = () => {
    setIsEditingBasicInfo(true);
    setNewPhoto(null);
    setPhotoPreview(null);
    setTempBasicInfo(profile);
    loadFormData(); // Load professions and cities when entering edit mode
    console.log('Mode édition des informations de base activé.');
  };

  const handleCancelEditBasicInfo = () => {
    setIsEditingBasicInfo(false);
    setTempBasicInfo(profile);
    setNewPhoto(null);
    setPhotoPreview(null);
    console.log('Mode édition des informations de base annulé.');
  };

  const handleSaveBasicInfo = async () => {
    const formData = new FormData();
    formData.append('name', tempBasicInfo.name);
    formData.append('email', tempBasicInfo.email);
    formData.append('telephone', tempBasicInfo.telephone || '');
    formData.append('ville_id', tempBasicInfo.ville_id || '');
    formData.append('profession_id', tempBasicInfo.profession_id || '');
    formData.append('sexe', tempBasicInfo.sexe || '');
  
    if (newPhoto) {
      formData.append('photo', newPhoto, newPhoto.name);
    }

    formData.append('_method', 'PUT');
  
    try {
      const response = await api.post('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); 
      console.log('Réponse :', response.data);
      
      // Update the selected profession and city names from the selected IDs
      const selectedProfession = professions.find(p => p.id === parseInt(tempBasicInfo.profession_id));
      const selectedCity = cities.find(c => c.id === parseInt(tempBasicInfo.ville_id));
      
      const updatedProfile = {
        ...profile,
        name: tempBasicInfo.name,
        email: tempBasicInfo.email,
        telephone: tempBasicInfo.telephone,
        sexe: tempBasicInfo.sexe,
        profession: selectedProfession?.nom || profile.profession,
        profession_id: tempBasicInfo.profession_id,
        location: selectedCity?.nom || profile.location,
        ville_id: tempBasicInfo.ville_id,
        photo: response.data.photo_url || profile.photo,
      };
  
      setProfile(updatedProfile);
      // Recalculer le pourcentage de complétion après la mise à jour
      calculateProfileCompletion(updatedProfile);
      
      setIsEditingBasicInfo(false);
      setNewPhoto(null);
      setPhotoPreview(null);
    } catch (error) {
      console.error('Erreur :', error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempBasicInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
    console.log('Champ modifié:', name, 'Nouvelle valeur:', value, 'tempBasicInfo actuel:', tempBasicInfo);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        console.log('Aperçu de la nouvelle photo chargé:', reader.result);
      };
      reader.readAsDataURL(file);
      console.log('Nouvelle photo sélectionnée:', file);
    } else {
      setNewPhoto(null);
      setPhotoPreview(null);
      console.log('Sélection de photo annulée.');
    }
  };

  if (!artisan) {
    console.log('L\'artisan est en cours de chargement...');
    return <p>Chargement…</p>;
  }

  console.log('Rendu du composant ArtisanProfile avec l\'état actuel:', { artisan, profile, isOwner, isEditingBasicInfo, tempBasicInfo, newPhoto, photoPreview });

  return (
    <>
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden mb-5">
        <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600" />
        <div className="px-6 py-5 relative">
          <div className="absolute -top-16 left-6">
            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 flex items-center justify-center">
              {(photoPreview || profile.photo) ? (
                <img src={photoPreview || profile.photo} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <i className="fas fa-user text-4xl text-gray-400"></i>
              )}
            </div>
          </div>
          {isOwner && !isEditingBasicInfo && (
            <div className="absolute top-4 right-4">
              <button onClick={handleEditBasicInfo} className="text-blue-600 hover:underline focus:outline-none">
                Modifier les informations
              </button>
            </div>
          )}
          {isOwner && isEditingBasicInfo && (
            <div className="absolute top-4 right-4 space-x-2">
              <button onClick={handleSaveBasicInfo} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Enregistrer
              </button>
              <button onClick={handleCancelEditBasicInfo} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Annuler
              </button>
            </div>
          )}
          <div className="mt-16">
            {isEditingBasicInfo ? (
              <div className="space-y-2">
                <div>
                  <label htmlFor="photo" className="block text-gray-700 text-sm font-bold mb-1">Photo</label>
                  <input type="file" id="photo" name="photo" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handlePhotoChange} />
                  {photoPreview && <img src={photoPreview} alt="Aperçu" className="mt-2 max-w-xs" />}
                </div>
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-1">Nom</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={tempBasicInfo.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="profession_id" className="block text-gray-700 text-sm font-bold mb-1">Profession</label>
                  {isLoading ? (
                    <p>Chargement des professions...</p>
                  ) : (
                    <select
                      id="profession_id"
                      name="profession_id"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={tempBasicInfo.profession_id || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Sélectionner une profession</option>
                      {professions.map(profession => (
                        <option key={profession.id} value={profession.id}>
                          {profession.nom}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label htmlFor="ville_id" className="block text-gray-700 text-sm font-bold mb-1">Ville</label>
                  {isLoading ? (
                    <p>Chargement des villes...</p>
                  ) : (
                    <select
                      id="ville_id"
                      name="ville_id"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={tempBasicInfo.ville_id || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Sélectionner une ville</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>
                          {city.nom}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label htmlFor="telephone" className="block text-gray-700 text-sm font-bold mb-1">Téléphone</label>
                  <input 
                    type="text" 
                    id="telephone" 
                    name="telephone" 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    value={tempBasicInfo.telephone || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={tempBasicInfo.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="sexe" className="block text-gray-700 text-sm font-bold mb-1">Sexe</label>
                  <select 
                    id="sexe" 
                    name="sexe" 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    value={tempBasicInfo.sexe || ''} 
                    onChange={handleInputChange}
                  >
                    <option value="">Sélectionner</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-lg text-gray-600">{profile.profession}</p>
                <div className="flex items-center mt-2 text-gray-600">📍 {profile.location}</div>
                <div className="mt-2 text-gray-600">Sexe: {profile.sexe === 'M' ? 'Homme' : profile.sexe === 'F' ? 'Femme' : 'Non spécifié'}</div>
                <div className="mt-4 space-y-2 text-gray-600">
                  <div>☎ {profile.telephone}</div>
                  <div>✉ {profile.email}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Ajout du composant ProfileCompletionGuide ici */}

      {profileCompletion.showGuidance && (
        <ProfileCompletionGuide 
          percentage={profileCompletion.percentage}
          missingFields={profileCompletion.missingFields}
          onEditClick={handleEditBasicInfo}
        />
      )}


      <ProfileSection
        title="À propos"
        isOwner={isOwner}
        content={profile.description || 'Non renseigné'}
        onDescriptionUpdate={newDescription => {
          setArtisan(prevArtisan => ({ ...prevArtisan, description: newDescription }));
          setProfile(prevProfile => ({ ...prevProfile, description: newDescription }));
        }}
      />
      <ServicesSection isOwner={isOwner} services={profile.services} artisanId={parseInt(id)} />
      <ProjectsSection isOwner={isOwner} projects={profile.projets} artisanId={parseInt(id)} />
      <SkillsSection isOwner={isOwner} skills={profile.competences} artisanId={parseInt(id)}/>
      <ExperienceSection isOwner={isOwner} experiences={profile.experiences} artisanId={parseInt(id)} />
      <LanguagesSection isOwner={isOwner} languages={artisan._mappedLanguages} artisanId={parseInt(id)} /> 
      <ReviewsSection isOwner={isOwner} reviews={profile.reviews} />

      {!isOwner && (
        <button
          onClick={() => setIsServiceModalOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 z-50"
        >
          📩 Demander un service
        </button>
      )}

      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-screen overflow-y-auto">
            <button
              onClick={() => setIsServiceModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <CreateServiceForm
              userId={userId}
              artisanId={artisan.id}
              onSuccess={() => setIsServiceModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
    </>
  );
}