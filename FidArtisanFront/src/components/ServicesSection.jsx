import React, { useState } from 'react';
 import api from '../services/api';

 export function ServicesSection({ services: initialServices, artisanId, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(initialServices || []);

  const handleChange = (index, field, value) => {
    const updatedFormData = [...formData];
    updatedFormData[index][field] = value;
    setFormData(updatedFormData);
  };

  const save = async () => {
    await Promise.all(formData.map(service => {
      if (service.id) {
        return api.put(`/services-proposes/${service.id}`, {
          titre: service.titre,
          description: service.description,
          montant: service.montant,
        });
      } else {
        const dataToSend = {
          artisan_id: artisanId,
          titre: service.titre,
          description: service.description,
          montant: service.montant,
        };
        console.log('Données envoyées pour un nouveau service :', dataToSend); // Inspecter les données
        return api.post('/services-proposes', dataToSend);
      }
    }));
    setEditing(false);
  };

  const remove = async (id, index) => {
    if (id) {
      await api.delete(`/services-proposes/${id}`);
    }
    const updatedFormData = formData.filter((_, i) => i !== index);
    setFormData(updatedFormData);
  };

  const addService = () => {
    setFormData([...formData, { titre: '', montant: '', description: '' }]);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-5 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Services proposés</h2>
        {isOwner && !editing && (
          <button onClick={() => setEditing(true)} className="text-blue-600 hover:underline">Modifier</button>
        )}
      </div>

      {formData.map((service, index) => (
        <div key={index} className="mb-4 border p-4 rounded">
          {editing ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`titre-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Titre</label>
                <input
                  type="text"
                  id={`titre-${index}`}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={service.titre}
                  onChange={(e) => handleChange(index, 'titre', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`montant-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Montant</label>
                <input
                  type="number"
                  id={`montant-${index}`}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={service.montant}
                  onChange={(e) => handleChange(index, 'montant', parseFloat(e.target.value))}
                />
              </div>
              <div className="col-span-2">
                <label htmlFor={`description-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  id={`description-${index}`}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={service.description || ''}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => remove(service.id, index)}
                  className="text-red-600 hover:underline focus:outline-none"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-medium">{service.titre}</h3>
              <p className="text-sm text-gray-600 mt-1">Prix: {service.montant} FCFA</p>
              {service.description && <p className="text-sm text-gray-500 mt-1">{service.description}</p>}
            </>
          )}
        </div>
      ))}

      {editing && (
        <div className="mt-4 flex space-x-2">
          <button onClick={save} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Enregistrer
          </button>
          <button onClick={() => setEditing(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Annuler
          </button>
          <button onClick={addService} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            + Ajouter un service
          </button>
        </div>
      )}

      {!editing && isOwner && formData.length > 0 && (
        <div className="mt-4">
          <button onClick={() => setEditing(true)} className="text-blue-600 hover:underline focus:outline-none">
            Modifier les services
          </button>
        </div>
      )}

      {!editing && isOwner && formData.length === 0 && (
        <div className="mt-4">
          <button onClick={() => setEditing(true)} className="text-blue-600 hover:underline focus:outline-none">
            Ajouter des services
          </button>
        </div>
      )}
    </div>
  );
 }