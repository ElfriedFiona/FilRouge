import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaUser, FaQuoteLeft, FaClock, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import api from '../services/api';

export default function AvisNotesContent() {
  const [artisanId, setArtisanId] = useState(null);
  const [avisRecus, setAvisRecus] = useState([]);
  const [avisDonnes, setAvisDonnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [editAvisId, setEditAvisId] = useState(null);
  const [editData, setEditData] = useState({ note: '', commentaire: '' });

  useEffect(() => {
    const fetchProfileAndAvis = async () => {
      try {
        const profileRes = await api.get('/profile');
        const id = profileRes.data.artisan?.id;
        if (!id) {
          setErreur("Impossible de récupérer l'identifiant de l'artisan.");
          return;
        }
        setArtisanId(id);

        const [recusRes, donnesRes] = await Promise.all([
          api.get(`/avis-et-notes/artisan/${id}`),
          api.get(`/avis-artisan-clients/artisan/${id}`),
        ]);

        setAvisRecus(recusRes.data);
        setAvisDonnes(donnesRes.data);
      } catch (error) {
        console.error(error);
        setErreur("Erreur lors du chargement des avis.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndAvis();
  }, []);

  const getNoteColor = (note) => {
    if (note >= 4) return 'text-green-600';
    if (note >= 2) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const handleEditClick = (avis) => {
    setEditAvisId(avis.id);
    setEditData({ note: avis.note, commentaire: avis.commentaire });
  };

  const handleCancelEdit = () => {
    setEditAvisId(null);
    setEditData({ note: '', commentaire: '' });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (avisId) => {
    try {
      await api.put(`/avis-artisan-clients/${avisId}`, editData);
      const updated = avisDonnes.map((a) => (a.id === avisId ? { ...a, ...editData } : a));
      setAvisDonnes(updated);
      handleCancelEdit();
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
    }
  };

  const handleDelete = async (avisId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet avis ?')) return;

    try {
      await api.delete(`/avis-artisan-clients/${avisId}`);
      setAvisDonnes(avisDonnes.filter((a) => a.id !== avisId));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  if (loading) return <div className="text-center py-6">Chargement des avis...</div>;
  if (erreur) return <div className="text-red-600 text-center py-6">{erreur}</div>;

  return (
    <div className="p-4 space-y-8">
      {/* Avis reçus */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Avis reçus des clients</h2>
        {avisRecus.length === 0 ? (
          <p className="text-gray-500">Aucun avis reçu pour le moment.</p>
        ) : (
          <div className="grid gap-4">
            {avisRecus.map((avis) => (
              <div key={avis.id} className="bg-white p-4 rounded-2xl shadow flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-gray-500" />
                    <span className="font-semibold">{avis.user?.name || 'Client inconnu'}</span>
                  </div>
                  <div className={`font-bold ${getNoteColor(avis.note)} flex items-center gap-1`}>
                    <FaStar /> {avis.note}/5
                  </div>
                </div>
                <p className="text-gray-700 flex items-center gap-2"><FaQuoteLeft /> {avis.commentaire}</p>
                <div className="text-sm text-gray-400 flex items-center gap-1"><FaClock /> {formatDate(avis.created_at)}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Avis donnés */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Avis donnés aux clients</h2>
        {avisDonnes.length === 0 ? (
          <p className="text-gray-500">Aucun avis donné pour le moment.</p>
        ) : (
          <div className="grid gap-4">
            {avisDonnes.map((avis) => (
              <div key={avis.id} className="bg-gray-50 p-4 rounded-2xl shadow flex flex-col gap-2 relative">
                {editAvisId === avis.id ? (
                  <>
                    <div className="flex items-center gap-2">
                      <label className="w-20">Note :</label>
                      <input
                        type="number"
                        name="note"
                        min="1"
                        max="5"
                        value={editData.note}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-16"
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <label className="w-20">Commentaire :</label>
                      <textarea
                        name="commentaire"
                        value={editData.commentaire}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditSubmit(avis.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                      >
                        <FaSave /> Enregistrer
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 flex items-center gap-1"
                      >
                        <FaTimes /> Annuler
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-500" />
                        <span className="font-semibold">{avis.artisan?.user?.name || 'Client inconnu'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditClick(avis)} className="text-blue-600 hover:text-blue-800">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(avis.id)} className="text-red-600 hover:text-red-800">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className={`font-bold ${getNoteColor(avis.note)} flex items-center gap-1`}>
                      <FaStar /> {avis.note}/5
                    </div>
                    <p className="text-gray-700 flex items-center gap-2"><FaQuoteLeft /> {avis.commentaire}</p>
                    <div className="text-sm text-gray-400 flex items-center gap-1"><FaClock /> {formatDate(avis.created_at)}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
