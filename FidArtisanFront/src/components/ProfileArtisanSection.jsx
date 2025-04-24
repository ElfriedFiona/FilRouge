import React, { useState } from 'react';
import api from '../services/api';

export const ProfileSection = ({ title, content, isOwner, onDescriptionUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState(content || '');

  const handleSave = () => {
    api.put('/profile/description', { description })
      .then(() => {
        setEditMode(false);
        if (onDescriptionUpdate) {
          onDescriptionUpdate(description); // Appeler la fonction de mise à jour passée en prop
        }
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour de la description', error);
        // Gérer l'erreur ici
      });
  };
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {isOwner && (
          <>
            {!editMode ? (
              <button onClick={() => setEditMode(true)} className="text-blue-600">Modifier</button>
            ) : (
              <div className="space-x-2">
                <button onClick={handleSave} className="text-green-600">Enregistrer</button>
                <button onClick={() => { setEditMode(false); setDescription(content); }} className="text-gray-500">Annuler</button>
              </div>
            )}
          </>
        )}
      </div>
      {editMode ? (
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border rounded p-2"
        />
      ) : (
        <p className="text-gray-700">{content || 'Non renseigné'}</p>
      )}
    </div>
  );
};
