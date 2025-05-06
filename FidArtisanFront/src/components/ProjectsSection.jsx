import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus } from 'react-icons/fa';

export function ProjectsSection({ projects, artisanId, isOwner }) {
  const [data, setData] = useState(projects || []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // État pour nouveau projet
  const [newProject, setNewProject] = useState({
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
    image: null,
    artisan_id: artisanId
  });
  
  // État pour projet en édition
  const [editProject, setEditProject] = useState({
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
    image: null
  });

  // Prévisualisation de l'image
  const [previewImage, setPreviewImage] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);

  // Gère les changements de champs pour nouveau projet
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files[0]) {
      setNewProject({ ...newProject, [name]: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setNewProject({ ...newProject, [name]: value });
    }
  };

  // Gère les changements de champs pour projet en édition
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files[0]) {
      setEditProject({ ...editProject, [name]: files[0] });
      setEditPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setEditProject({ ...editProject, [name]: value });
    }
  };

  // Ajouter un nouveau projet
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newProject.titre.trim()) {
      toast.error("Le titre est requis");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('titre', newProject.titre);
      formData.append('description', newProject.description);
      formData.append('date_debut', newProject.date_debut);
      formData.append('date_fin', newProject.date_fin);
      formData.append('artisan_id', artisanId);
      
      if (newProject.image) {
        formData.append('image', newProject.image);
      }
      
      const response = await api.post('/projets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setData([...data, response.data]);
      setNewProject({
        titre: '',
        description: '',
        date_debut: '',
        date_fin: '',
        image: null,
        artisan_id: artisanId
      });
      setPreviewImage(null);
      setShowForm(false);
      toast.success('Projet ajouté avec succès');
    } catch (error) {
      console.error("Erreur d'ajout:", error);
      toast.error("Erreur lors de l'ajout du projet");
    }
  };

  // Supprimer un projet
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      try {
        await api.delete(`/projets/${id}`);
        setData(data.filter(p => p.id !== id));
        toast.success('Projet supprimé avec succès');
      } catch (error) {
        console.error("Erreur de suppression:", error);
        toast.error("Erreur lors de la suppression du projet");
      }
    }
  };

  // Préparer l'édition
  const startEdit = (project) => {
    setEditingId(project.id);
    setEditProject({
      titre: project.titre,
      description: project.description || '',
      date_debut: project.date_debut || '',
      date_fin: project.date_fin || '',
      image: null
    });
    setEditPreviewImage(project.image ? `http://localhost:8000storage/uploads/project.image}` : null);
  };

  // Mettre à jour un projet
  const handleEdit = async (id) => {
    try {
      const formData = new FormData();
      formData.append('titre', editProject.titre);
      formData.append('description', editProject.description);
      formData.append('date_debut', editProject.date_debut);
      formData.append('date_fin', editProject.date_fin);
      
      if (editProject.image) {
        formData.append('image', editProject.image);
      }
      
      const response = await api.post(`/projets/${id}?_method=PUT`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setData(data.map(p => (p.id === id ? response.data : p)));
      setEditingId(null);
      setEditPreviewImage(null);
      toast.success('Projet mis à jour avec succès');
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
      toast.error("Erreur lors de la mise à jour du projet");
    }
  };

  // Formater la date pour affichage
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Projets réalisés</h2>
      
      {/* Liste des projets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((project) => (
          <div key={project.id} className="border rounded p-4 relative">
            {editingId === project.id ? (
              // Formulaire d'édition
              <form onSubmit={(e) => { e.preventDefault(); handleEdit(project.id); }}>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Titre</label>
                  <input
                    type="text"
                    name="titre"
                    className="w-full border p-2 rounded"
                    value={editProject.titre}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    className="w-full border p-2 rounded"
                    value={editProject.description}
                    onChange={handleEditChange}
                    rows="3"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date début</label>
                    <input
                      type="date"
                      name="date_debut"
                      className="w-full border p-2 rounded"
                      value={editProject.date_debut}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date fin</label>
                    <input
                      type="date"
                      name="date_fin"
                      className="w-full border p-2 rounded"
                      value={editProject.date_fin}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
                
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <input
                    type="file"
                    name="image"
                    className="w-full border p-2 rounded"
                    onChange={handleEditChange}
                    accept="image/jpeg,image/png,image/bmp,image/webp"
                  />
                  {editPreviewImage && (
                    <div className="mt-2">
                      <img 
                        src={editPreviewImage} 
                        alt="Aperçu" 
                        className="h-24 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    type="button"
                    className="px-3 py-1 bg-gray-200 rounded flex items-center gap-1"
                    onClick={() => setEditingId(null)}
                  >
                    <FaTimes /> Annuler
                  </button>
                  <button 
                    type="submit"
                    className="px-3 py-1 bg-green-500 text-white rounded flex items-center gap-1"
                  >
                    <FaSave /> Enregistrer
                  </button>
                </div>
              </form>
            ) : (
              // Affichage du projet
              <>
                {project.image && (
                  <div className="mb-2">
                    <img 
                      src={`http://localhost:8000/storage/uploads/${project.image}`} 
                      alt={project.titre} 
                      className="w-full h-40 object-cover rounded"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-lg">{project.titre}</h3>
                {project.description && (
                  <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                )}
                <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-2">
                  {project.date_debut && (
                    <span>Début: {formatDate(project.date_debut)}</span>
                  )}
                  {project.date_fin && (
                    <span>Fin: {formatDate(project.date_fin)}</span>
                  )}
                </div>
                
                {isOwner && (
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button 
                      onClick={() => startEdit(project)}
                      className="p-1 bg-blue-100 rounded hover:bg-blue-200"
                      title="Modifier"
                    >
                      <FaEdit className="text-blue-600" />
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="p-1 bg-red-100 rounded hover:bg-red-200"
                      title="Supprimer"
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Formulaire d'ajout */}
      {isOwner && !showForm && (
        <div className="mt-4">
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <FaPlus /> Ajouter un nouveau projet
          </button>
        </div>
      )}

      {isOwner && showForm && (
        <div className="mt-4 border p-4 rounded bg-gray-50">
          <h3 className="font-semibold mb-3">Nouveau projet</h3>
          <form onSubmit={handleAdd}>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Titre</label>
              <input
                type="text"
                name="titre"
                className="w-full border p-2 rounded"
                value={newProject.titre}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                className="w-full border p-2 rounded"
                value={newProject.description}
                onChange={handleChange}
                rows="3"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date début</label>
                <input
                  type="date"
                  name="date_debut"
                  className="w-full border p-2 rounded"
                  value={newProject.date_debut}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date fin</label>
                <input
                  type="date"
                  name="date_fin"
                  className="w-full border p-2 rounded"
                  value={newProject.date_fin}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                name="image"
                className="w-full border p-2 rounded"
                onChange={handleChange}
                accept="image/jpeg,image/png,image/bmp,image/webp"
              />
              {previewImage && (
                <div className="mt-2">
                  <img 
                    src={previewImage} 
                    alt="Aperçu" 
                    className="h-24 object-cover rounded"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 mt-2">
              <button 
                type="button"
                className="px-3 py-1 bg-gray-200 rounded flex items-center gap-1"
                onClick={() => {
                  setShowForm(false);
                  setNewProject({
                    titre: '',
                    description: '',
                    date_debut: '',
                    date_fin: '',
                    image: null,
                    artisan_id: artisanId
                  });
                  setPreviewImage(null);
                }}
              >
                <FaTimes /> Annuler
              </button>
              <button 
                type="submit"
                className="px-3 py-1 bg-blue-500 text-white rounded flex items-center gap-1"
              >
                <FaPlus /> Ajouter
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}