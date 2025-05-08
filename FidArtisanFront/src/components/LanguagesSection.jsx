import React, { useState } from 'react';
import api from '../services/api';
import { FaEdit } from 'react-icons/fa';

// Liste des langues disponibles
const AVAILABLE_LANGUAGES = [
  'Français',
  'Anglais',
  'Français et Anglais',
];

export function LanguagesSection({ languages, artisanId, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages?.[0]?.language || '');

  const save = async () => {
    await api.put(`/artisans/${artisanId}`, { langue: selectedLanguage });
    setEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Langues</h2>
        {isOwner && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            <FaEdit /> Modifier
          </button>
        )}
      </div>

      {editing ? (
        <>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="border p-2 mb-4 w-full rounded"
          >
            <option value="">-- Sélectionner une langue --</option>
            {AVAILABLE_LANGUAGES.map((lang, i) => (
              <option key={i} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={save}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Enregistrer
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Annuler
            </button>
          </div>
        </>
      ) : selectedLanguage ? (
        <div>{selectedLanguage}</div>
      ) : (
        <div className="text-gray-500">Aucune langue renseignée.</div>
      )}
    </div>
  );
}
