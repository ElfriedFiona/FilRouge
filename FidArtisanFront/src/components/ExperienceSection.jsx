import React, { useState } from 'react';
import api from '../services/api';

export function ExperienceSection({ isOwner, experiences: initialExperiences }) {
  const [isEditing, setIsEditing] = useState(false);
  const [experiences, setExperiences] = useState(initialExperiences);

  const handleChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  const handleSave = async () => {
    try {
      for (const experience of experiences) {
        await api.put(`/experiences/${experience.id}`, experience);
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur en sauvegardant les expériences :', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-5 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Expériences</h2>
        {isOwner && (
          <div className="space-x-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="text-green-600 hover:underline">Enregistrer</button>
                <button onClick={() => setIsEditing(false)} className="text-gray-600 hover:underline">Annuler</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:underline">Modifier</button>
            )}
          </div>
        )}
      </div>

      {experiences.length === 0 ? (
        <p className="text-gray-500">Aucune expérience pour l'instant.</p>
      ) : (
        experiences.map((experience, index) => (
          <div key={experience.id} className="mb-4">
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="w-full border p-1 rounded mb-2"
                  value={experience.poste}
                  onChange={(e) => handleChange(index, 'poste', e.target.value)}
                />
                <input
                  type="text"
                  className="w-full border p-1 rounded mb-2"
                  value={experience.lieu}
                  onChange={(e) => handleChange(index, 'lieu', e.target.value)}
                />
                <div className="flex space-x-2 mb-2">
                  <input
                    type="date"
                    className="border p-1 rounded"
                    value={experience.date_debut}
                    onChange={(e) => handleChange(index, 'date_debut', e.target.value)}
                  />
                  <input
                    type="date"
                    className="border p-1 rounded"
                    value={experience.date_fin || ''}
                    onChange={(e) => handleChange(index, 'date_fin', e.target.value)}
                  />
                </div>
                <textarea
                  className="w-full border p-1 rounded"
                  value={experience.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                />
              </>
            ) : (
              <>
                <h3 className="font-medium">{experience.poste} chez {experience.lieu}</h3>
                <p className="text-sm text-gray-600 mt-1">{experience.date_debut} - {experience.date_fin || 'Présent'}</p>
                <p className="text-sm text-gray-500 mt-1">{experience.description}</p>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}