import React, { useState } from 'react';
import api from '../services/api';
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus } from 'react-icons/fa';

export function ExperienceSection({ isOwner, experiences: initialExperiences, artisanId }) {
  const [experiences, setExperiences] = useState(initialExperiences || []);
  const [editingIds, setEditingIds] = useState({});

  // Format de la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Gestion des changements dans les champs
  const handleChange = (id, field, value) => {
    setExperiences(experiences.map(exp => 
      exp.id === id || exp.temp_id === id ? { ...exp, [field]: value } : exp
    ));
  };

  // Activer le mode édition pour une expérience spécifique
  const toggleEdit = (id) => {
    setEditingIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Ajouter une nouvelle expérience
  const handleAddExperience = () => {
    const newExp = {
      temp_id: `new-${Date.now()}`, // ID temporaire pour le suivi
      poste: '',
      lieu: '',
      date_debut: '',
      date_fin: '',
      description: '',
      artisan_id: artisanId
    };
    
    setExperiences([...experiences, newExp]);
    
    // Mettre automatiquement la nouvelle expérience en mode édition
    toggleEdit(newExp.temp_id);
  };

  // Supprimer une expérience
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette expérience ?")) {
      try {
        if (id && !id.toString().startsWith('new-')) {
          // Si c'est une expérience existante, appeler l'API
          await api.delete(`/experiences/${id}`);
        }
        // Supprimer du state local
        setExperiences(experiences.filter(exp => exp.id !== id && exp.temp_id !== id));
        
        // Nettoyer l'état d'édition
        const newEditingIds = {...editingIds};
        delete newEditingIds[id];
        setEditingIds(newEditingIds);
      } catch (error) {
        console.error('Erreur lors de la suppression :', error);
      }
    }
  };

  // Sauvegarder une expérience spécifique
  const handleSave = async (experience) => {
    try {
      let result;
      
      if (experience.id && !experience.id.toString().startsWith('new-')) {
        // Mise à jour d'une expérience existante
        result = await api.put(`/experiences/${experience.id}`, experience);
      } else {
        // Création d'une nouvelle expérience
        result = await api.post('/experiences', experience);
      }
      
      // Mettre à jour l'expérience dans le state
      const updatedData = result.data;
      setExperiences(experiences.map(exp => 
        (exp.id === experience.id || exp.temp_id === experience.temp_id) 
          ? updatedData 
          : exp
      ));
      
      // Désactiver le mode édition pour cette expérience
      const id = experience.id || experience.temp_id;
      toggleEdit(id);
      
      // Si c'était une nouvelle expérience, mettre à jour l'ID d'édition
      if (experience.temp_id && updatedData.id) {
        const newEditingIds = {...editingIds};
        delete newEditingIds[experience.temp_id];
        setEditingIds(newEditingIds);
      }
    } catch (err) {
      console.error('Erreur en sauvegardant l\'expérience :', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-5 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Expériences</h2>
        {isOwner && (
          <button 
            onClick={handleAddExperience}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
          >
            <FaPlus /> Ajouter une expérience
          </button>
        )}
      </div>

      {experiences.length === 0 ? (
        <p className="text-gray-500 italic">Aucune expérience pour l'instant.</p>
      ) : (
        <div className="space-y-6">
          {experiences.map((experience) => {
            const id = experience.id || experience.temp_id;
            const isEditingThis = editingIds[id];
            
            return (
              <div key={id} className="border-b pb-4 mb-4 last:border-0">
                {isEditingThis ? (
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
                      <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={experience.poste || ''}
                        onChange={(e) => handleChange(id, 'poste', e.target.value)}
                        placeholder="Titre du poste"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lieu / Entreprise</label>
                      <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={experience.lieu || ''}
                        onChange={(e) => handleChange(id, 'lieu', e.target.value)}
                        placeholder="Nom de l'entreprise"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                        <input
                          type="date"
                          className="w-full border p-2 rounded"
                          value={experience.date_debut || ''}
                          onChange={(e) => handleChange(id, 'date_debut', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                        <input
                          type="date"
                          className="w-full border p-2 rounded"
                          value={experience.date_fin || ''}
                          onChange={(e) => handleChange(id, 'date_fin', e.target.value)}
                          placeholder="Laissez vide si poste actuel"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        className="w-full border p-2 rounded"
                        rows="3"
                        value={experience.description || ''}
                        onChange={(e) => handleChange(id, 'description', e.target.value)}
                        placeholder="Décrivez vos responsabilités et réalisations"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => handleSave(experience)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                      >
                        <FaSave /> Enregistrer
                      </button>
                      <button
                        onClick={() => toggleEdit(id)}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 flex items-center gap-1"
                      >
                        <FaTimes /> Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{experience.poste}</h3>
                        <span className="text-gray-600 font-medium">{experience.lieu}</span>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(experience.date_debut)} - {experience.date_fin ? formatDate(experience.date_fin) : 'Présent'}
                        </p>
                      </div>
                      
                      {isOwner && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleEdit(id)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Modifier cette expérience"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(id)}
                            className="text-red-500 hover:text-red-700"
                            title="Supprimer cette expérience"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {experience.description && (
                      <p className="text-gray-700 mt-2">{experience.description}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}