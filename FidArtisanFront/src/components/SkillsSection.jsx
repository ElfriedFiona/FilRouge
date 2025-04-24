import React, { useState } from 'react';
import api from '../services/api';

export default function SkillsSection({ skills, artisanId, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(skills || []);

  const handleSave = async () => {
    try {
      await Promise.all(formData.map(skill => {
        if (skill.id) {
          return api.put(`/competences/${skill.id}`, skill);
        } else {
          return api.post('/competences', { ...skill, artisan_id: artisanId });
        }
      }));
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/competences/${id}`);
    setFormData(formData.filter(s => s.id !== id));
  };

  return (
    <div className="section">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl">Compétences</h2>
        {isOwner && !editing && <button onClick={() => setEditing(true)}>Modifier</button>}
      </div>

      {formData.map((skill, idx) => (
        <div key={idx} className="mb-2 flex gap-2">
          {editing ? (
            <>
              <input
                className="border p-1"
                value={skill.competences}
                onChange={(e) => {
                  const newData = [...formData];
                  newData[idx].competences = e.target.value;
                  setFormData(newData);
                }}
              />
              {skill.id && <button onClick={() => handleDelete(skill.id)}>🗑</button>}
            </>
          ) : (
            <span>{skill.competences}</span>
          )}
        </div>
      ))}

      {editing && (
        <div className="mt-2 flex gap-2">
          <button onClick={handleSave}>Enregistrer</button>
          <button onClick={() => setEditing(false)}>Annuler</button>
          <button onClick={() => setFormData([...formData, { competences: '' }])}>+ Ajouter</button>
        </div>
      )}
    </div>
  );
}