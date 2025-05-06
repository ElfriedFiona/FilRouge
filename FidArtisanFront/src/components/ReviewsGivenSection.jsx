import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import api from '../services/api';
// import  api  from './api';  // Assurez-vous d'importer votre instance API

export function ReviewsGivenSection({isEditing }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  // Récupérer les services de l'utilisateur
  const fetchServices = () => {
    api.get(`/avis-artisan-client/${userId}`)
      .then(({ data }) => {
        setServices(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // Appeler la récupération des services lorsque le composant est monté
  useEffect(() => {
    fetchServices();
  }, [userId]);

  // Rendre les étoiles d'avis
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow mb-5 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Mes Avis</h2>
      </div>
      <div className="space-y-6">
        {loading ? (
          <div>Chargement...</div>  // Affichage pendant le chargement
        ) : services.length === 0 ? (
          <div className="text-gray-500">Aucun avis à afficher</div>  // Si aucun service/avis
        ) : (
          services.map((service, index) => (
            service.avis_par_artisans ? (  // Vérifier s'il y a des avis pour ce service
              <div key={index} className="border rounded-lg p-4">
                <div className="flex flex-col">
                  <div>
                    <h3 className="font-semibold">{service.service_name}</h3> {/* Nom du service */}
                    <p className="text-sm text-gray-600">Par {service.avis_par_artisans.artisan_name}</p> {/* Nom de l'artisan */}
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex">{renderStars(service.avis_par_artisans.note)}</div>  {/* Affichage des étoiles */}
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(service.avis_par_artisans.date).toLocaleDateString()}
                    </span>  {/* Date de l'avis */}
                  </div>
                  <p className="mt-2 text-gray-700">{service.avis_par_artisans.commentaire}</p> {/* Commentaire */}
                </div>
              </div>
            ) : null
          ))
        )}
      </div>
    </div>
  );
}
