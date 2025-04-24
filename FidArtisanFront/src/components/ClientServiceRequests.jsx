import { useEffect, useState } from 'react';
import axios from 'axios';

const ClientServiceRequests = ({ userId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avis, setAvis] = useState({}); // stocker les avis temporaires

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`/api/services/user/${userId}`);
        setServices(res.data);
      } catch (err) {
        console.error('Erreur chargement services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [userId]);

  const handleAvisChange = (id, field, value) => {
    setAvis(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      }
    }));
  };

  const submitAvis = (id) => {
    const data = avis[id];
    if (!data || !data.note || !data.commentaire) return;

    // ⚠️ Cette partie suppose que tu as un système pour enregistrer les avis
    axios.post(`/api/services/${id}/avis`, data)
      .then(() => {
        alert("Merci pour votre avis !");
        setAvis(prev => ({ ...prev, [id]: null }));
      })
      .catch((err) => {
        console.error("Erreur enregistrement avis:", err);
      });
  };

  if (loading) return <p>Chargement en cours...</p>;

  if (services.length === 0) return <p>Vous n'avez encore envoyé aucune demande.</p>;

  return (
    <div className="space-y-4">
      {services.map(service => (
        <div key={service.id} className="p-4 border rounded shadow-sm bg-white">
          <h3 className="text-lg font-semibold">{service.type_de_service}</h3>
          <p className="text-sm text-gray-600">Artisan : {service.artisan?.user?.name}</p>
          <p>Description : {service.description}</p>
          <p className="text-sm">Statut : <span className="font-bold">{service.statut || 'en attente'}</span></p>
          <p>Date limite : {service.date_limite}</p>

          {service.statut === 'terminé' && (
            <div className="mt-4">
              <h4 className="text-md font-medium mb-1">Laissez un avis</h4>
              <input
                type="number"
                placeholder="Note sur 5"
                min={1}
                max={5}
                value={avis[service.id]?.note || ''}
                onChange={e => handleAvisChange(service.id, 'note', e.target.value)}
                className="border px-2 py-1 rounded mb-2 w-24 block"
              />
              <textarea
                placeholder="Votre commentaire..."
                value={avis[service.id]?.commentaire || ''}
                onChange={e => handleAvisChange(service.id, 'commentaire', e.target.value)}
                className="border px-2 py-1 rounded w-full"
              />
              <button
                onClick={() => submitAvis(service.id)}
                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Envoyer l’avis
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClientServiceRequests;
