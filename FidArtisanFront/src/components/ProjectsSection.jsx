import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

export function ProjectsSection({ projects, isOwner }) {
  const [data, setData] = useState(projects || []);
  const [newProject, setNewProject] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAdd = async () => {
    if (!newProject.trim()) return;
    try {
      const { data: created } = await api.post('/projects', { titre: newProject });
      setData([...data, created]);
      setNewProject('');
      toast.success('Projet ajouté');
    } catch {
      toast.error("Erreur d'ajout");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setData(data.filter(p => p.id !== id));
      toast.success('Projet supprimé');
    } catch {
      toast.error("Erreur de suppression");
    }
  };

  const handleEdit = async (id) => {
    try {
      const { data: updated } = await api.put(`/projects/${id}`, { titre: editText });
      setData(data.map(p => (p.id === id ? updated : p)));
      setEditingId(null);
      toast.success('Projet mis à jour');
    } catch {
      toast.error("Erreur de mise à jour");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Projets réalisés</h2>
      {data.map((project) => (
        <div key={project.id} className="flex items-center justify-between mb-2">
          {editingId === project.id ? (
            <>
              <input
                className="border p-1 flex-1"
                value={editText}
                onChange={e => setEditText(e.target.value)}
              />
              <button onClick={() => handleEdit(project.id)} className="text-green-600 px-2">💾</button>
              <button onClick={() => setEditingId(null)} className="text-gray-500">❌</button>
            </>
          ) : (
            <>
              <span>{project.titre}</span>
              <span>{project.description}</span>
              <span>{project.date_debut}</span>
              <span>{project.date_fin}</span>
              <img src="http:localhost:8000/storage/uploads/{project.image}" alt="" />
              {/* <span>{project.image}</span> */}
              {isOwner && (
                <div className="space-x-2">
                  <button onClick={() => { setEditingId(project.id); setEditText(project.titre); }}>✏</button>
                  <button onClick={() => handleDelete(project.id)} className="text-red-600">🗑</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {isOwner && (
        <div className="mt-4 flex items-center space-x-2">
          <input
            className="border p-1 flex-1"
            value={newProject}
            onChange={e => setNewProject(e.target.value)}
            placeholder="Nouveau projet"
          />
          <button onClick={handleAdd} className="bg-blue-500 text-white px-2 py-1 rounded">Ajouter</button>
        </div>
      )}
    </div>
  );
}
