import React, { useState } from 'react';
import api from '../services/api';
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus } from 'react-icons/fa';

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
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette compétence?")) {
      try {
        // Uniquement appeler l'API si l'ID existe
        if (id) {
          await api.delete(`/competences/${id}`);
        }
        setFormData(formData.filter(s => s.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Compétences</h2>
        {isOwner && !editing && (
          <button 
            onClick={() => setEditing(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
          >
            <FaEdit /> Modifier
          </button>
        )}
      </div>

      <div className="space-y-2">
        {formData.map((skill, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {editing ? (
              <>
                <input
                  className="flex-1 border rounded p-2"
                  value={skill.competences}
                  placeholder="Entrez une compétence"
                  onChange={(e) => {
                    const newData = [...formData];
                    newData[idx].competences = e.target.value;
                    setFormData(newData);
                  }}
                />
                <button 
                  onClick={() => {
                    if (skill.id) {
                      handleDelete(skill.id);
                    } else {
                      // Pour les nouvelles compétences sans id, on les supprime directement du state
                      setFormData(formData.filter((_, i) => i !== idx));
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                  title="Supprimer"
                >
                  <FaTrash />
                </button>
              </>
            ) : (
              <div className="bg-gray-100 p-2 rounded w-full flex items-center">
                <span className="flex-1">{skill.competences}</span>
              </div>
            )}
          </div>
        ))}

        {formData.length === 0 && !editing && (
          <div className="text-gray-500 italic">Aucune compétence enregistrée</div>
        )}
      </div>

      {editing && (
        <>
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => setFormData([...formData, { competences: '' }])}
              className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 flex items-center gap-1"
            >
              <FaPlus /> Ajouter une compétence
            </button>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button 
              onClick={() => setEditing(false)}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1"
            >
              <FaTimes /> Annuler
            </button>
            <button 
              onClick={handleSave}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
            >
              <FaSave /> Enregistrer
            </button>
          </div>
        </>
      )}
    </div>
  );
}