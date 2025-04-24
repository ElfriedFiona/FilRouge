import React, { useState } from 'react';
import api from '../services/api';

export function LanguagesSection({ languages, artisanId, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [langs, setLangs] = useState(languages);

  const save = async () => {
    await api.put(`/artisans/${artisanId}`, { langue: langs[0]?.language }); // Adapt if needed
    setEditing(false);
  };

  return (
    <div className="section">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Langues</h2>
        {isOwner && !editing && <button onClick={() => setEditing(true)}>Modifier</button>}
      </div>

      {editing ? (
        <>
          {langs.map((lang, i) => (
            <input
              key={i}
              value={lang.language}
              className="border p-1 mb-2 w-full"
              onChange={(e) => {
                const copy = [...langs];
                copy[i].language = e.target.value;
                setLangs(copy);
              }}
            />
          ))}
          <div className="flex gap-2">
            <button onClick={save}>Enregistrer</button>
            <button onClick={() => setEditing(false)}>Annuler</button>
          </div>
        </>
      ) : (
        langs.map((lang, i) => <div key={i}>{lang.language}</div>)
      )}
    </div>
  );
}