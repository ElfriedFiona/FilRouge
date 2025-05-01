import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Star } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ProfileSection } from './ProfileSection';
import { FavoriteArtisansSection } from './FavoriteArtisanSection';
import { ReviewsGivenSection } from './ReviewsGivenSection';

export function PublicClientProfile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // données de profil de base
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    telephone: '',
    ville: '',
    sexe: '',
    langue: '',
    profilePicture: '',
    description: '',
  });

  // listes
  const [favorites, setFavoris] = useState([]);
  const [avisParArtisans, setAvisRecus] = useState([]);

  // villes pour afficher le nom
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [{ data: villes }, { data: user }] = await Promise.all([
          api.get('/villes'),
          api.get(`/users/${id}`),
        ]);

        // récupérer la liste de toutes les villes
        setCities(villes);

        // extraire ce qu'on veut
        const { name, email, client } = user;
        const villeNom = client?.ville || 'Ville non renseignée';
        
        setProfile({
          name,
          email,
          telephone: client.telephone || '',
          ville: villeNom,
          sexe: client.sexe || '',
          langue: client.langue || '',
          profilePicture: client.photo
            ? `http://127.0.0.1:8000/${client.photo}`
            : 'https://via.placeholder.com/150',
          description: client.description || '',
        });

        // favoris : [{ id, name, profilePicture, profession }]
        setFavoris(client.favorites.map(fav => ({
          id: fav.artisan.id,
          name: fav.artisan.user.name,
          profession: fav.artisan.profession.nom,
          location: villes.find(c => c.id === fav.artisan.ville_id)?.nom || '',
          rating: fav.artisan.user.average_rating || 0,
          image: fav.artisan.photo
            ? `http://127.0.0.1:8000/${fav.artisan.photo}`
            : 'https://via.placeholder.com/64',
        })));

        // avis reçus : [{ note, commentaire, created_at, artisan: { id, name, photo } }]
        setAvisRecus(user.avisParArtisans.map(a => ({
          note: a.note,
          commentaire: a.commentaire,
          created_at: a.created_at,
          artisan: {
            id: a.artisan.id,
            name: a.artisan.user.name,
            photo: a.artisan.photo
              ? `http://127.0.0.1:8000/${a.artisan.photo}`
              : 'https://via.placeholder.com/64',
          }
        })));

      } catch (err) {
        console.error(err);
        // toast.error("Impossible de charger le profil public.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <p>Chargement du profil…</p>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
      {/* Entête */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-5">
        <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600" />
        <div className="px-6 py-5 relative">
          <div className="absolute -top-16 left-6">
            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden">
              <img
                src={profile.profilePicture}
                alt="Photo de profil"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="mt-16">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin size={16} className="mr-1" />
              <span>{profile.ville || 'Ville non renseignée'}</span>
            </div>
            <div className="mt-4 space-y-2 text-gray-600">
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
                <span>{profile.telephone || 'Téléphone non renseigné'}</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2" />
                <span>{profile.email}</span>
              </div>
              <div>Sexe : {profile.sexe || 'Non renseigné'}</div>
              <div>Langue : {profile.langue || 'Non renseignée'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* À propos */}
      <ProfileSection
        title="À propos"
        content={profile.description || 'Ce client n’a pas encore rédigé de description.'}
        isOwner={false}
      />

      {/* Artisans favoris */}
      <FavoriteArtisansSection artisans={favorites} isEditing={false} />

      {/* Avis reçus */}
      <ReviewsGivenSection reviews={avisParArtisans} isOwner={false} />

    </div>
  );
}
