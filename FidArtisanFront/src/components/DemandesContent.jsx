import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { CSVLink } from 'react-csv';
import { FaEye, FaCheck, FaTimes, FaFilePdf, FaSearch, FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DemandesContent = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const itemsPerPage = 10;
  const user = JSON.parse(localStorage.getItem('user'));
  const artisanId = user?.artisan?.id;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get(`/services/artisan/${artisanId}`);
      setRequests(res.data);
    } catch (err) {
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, action) => {
    try {
      if (action === 'accept') {
        await api.post(`/services/accept/${id}`);
        toast.success('Demande acceptée');
      } else if (action === 'refuse') {
        await api.post(`/services/refuserequest/${id}`);
        toast.success('Demande refusée');
      }
      fetchRequests();
    } catch {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleTerminer = async (id) => {
    try {
      const response = await api.post(`/services/terminer/${id}`);
      toast.success('Service marqué comme terminé');
      fetchDemandes(); // Recharger les données
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour.');
    }
  };
  

  const extractCityFromAddress = (address) => {
    if (!address) return '—';
    const parts = address.split(',');
    return parts.length >= 3 ? parts[parts.length - 5].trim() : parts[parts.length - 1].trim();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const rows = requests.map((req, index) => [
      index + 1,
      req.user?.name,
      req.client?.user?.ville || extractCityFromAddress(req.adresse_details),
      new Date(req.date_limite).toLocaleDateString(),
      req.budget,
      req.statut,
      req.statut_artisan,  // Ajout de statut_artisan dans le PDF
    ]);
    autoTable(doc, {
      head: [['#', 'Nom', 'Ville', 'Date', 'Budget', 'Statut', 'Statut Artisan']],
      body: rows,
    });
    doc.save('demandes.pdf');
  };

  const exportRequestPDF = (req) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Détail de la demande de service', 14, 20);
    autoTable(doc, {
      startY: 30,
      body: [
        ['Nom du client', req.user?.name],
        ['Email', req.user?.email],
        ['Ville', req.client?.user?.ville || extractCityFromAddress(req.adresse_details)],
        ['Date limite', new Date(req.date_limite).toLocaleDateString()],
        ['Budget', `${req.budget} FCFA`],
        ['Statut', req.statut],
        ['Statut Artisan', req.statut_artisan],  // Ajout de statut_artisan dans le détail PDF
        ['Type de service', req.type_de_service],
        ['Priorité', req.priorité],
        ['Adresse', req.adresse_details],
        ['Description', req.description],
        ['Image Profil', req.user?.image_path ? `<img src="http://localhost:8000/storage/uploads/${req.user.image_path}" />` : 'Aucune image'],  // Ajout de l'image du client
        // ['Lien Profil', `http://localhost:8000/client/${req.user?.id}`],  // Lien vers le profil client
      ],
      theme: 'striped',
    });
    doc.save(`demande_${req.id}.pdf`);
  };

  const statusBadge = (statut) => {
    const base = 'px-2 py-1 rounded-full text-xs font-bold';
    switch (statut) {
      case 'en attente': return <span className={`${base} bg-yellow-100 text-yellow-800`}>En attente</span>;
      case 'en cours': return <span className={`${base} bg-blue-100 text-blue-800`}>En cours</span>;
      case 'terminé': return <span className={`${base} bg-green-100 text-green-800`}>Terminé</span>;
      case 'annulé': return <span className={`${base} bg-red-100 text-red-800`}>Annulé</span>;
      default: return statut;
    }
  };

  const filtered = requests.filter(req => {
    const matchSearch =
      req.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.client?.user?.ville || extractCityFromAddress(req.adresse_details))?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus ? req.statut === filterStatus : true;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const pageCount = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-bold">Demandes reçues</h2>
        <div className="flex gap-2">
          <CSVLink
            data={requests}
            headers={[ 
              { label: "Nom Client", key: "user.name" },
              { label: "Ville", key: "client.user.ville" },
              { label: "Email", key: "user.email" },
              { label: "Date souhaitée", key: "date_limite" },
              { label: "Budget", key: "budget" },
              { label: "Statut", key: "statut" },
              { label: "Statut Artisan", key: "statut_artisan" },
            ]}
            filename="demandes.csv"
            className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            Export CSV
          </CSVLink>
          <button onClick={exportPDF} className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1">
            <FaFilePdf /> PDF
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2 border px-3 py-1 rounded">
          <FaSearch />
          <input
            type="text"
            placeholder="Recherche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="">Tous les statuts</option>
          <option value="en attente">En attente</option>
          <option value="en cours">En cours</option>
          <option value="terminé">Terminé</option>
          <option value="annulé">Annulé</option>
        </select>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">Aucune demande trouvée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">#</th>
                <th className="p-2">Client</th>
                <th className="p-2">Ville</th>
                <th className="p-2">Date</th>
                <th className="p-2">Budget</th>
                <th className="p-2">Statut</th>
                <th className="p-2">Statut Artisan</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((req, index) => (
                <motion.tr 
                  key={req.id}>
                  <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-2">{req.user?.name}</td>
                  <td className="p-2">{req.client?.user?.ville || extractCityFromAddress(req.adresse_details)}</td>
                  <td className="p-2">{new Date(req.date_limite).toLocaleDateString()}</td>
                  <td className="p-2">{req.budget} FCFA</td>
                  <td className="p-2">{statusBadge(req.statut)}</td>
                  <td className="p-2">{statusBadge(req.statut_artisan)}</td>
                  <td className="p-2">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleStatusChange(req.id, 'accept')}
                      className="text-green-500 hover:text-green-700 ml-2"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => handleStatusChange(req.id, 'refuse')}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <FaTimes />
                    </button>
                    
                    {req.statut === 'en cours' && (
                      <button
                        onClick={() => handleTerminer(req.id)}
                        className="text-sm text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded ml-2"
                      >
                        Terminer
                      </button>
                    )}

                    <button
                      onClick={() => exportRequestPDF(req)}
                      className="text-gray-500 hover:text-gray-700 ml-2"
                    >
                      <FaDownload />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="text-sm bg-gray-300 px-3 py-1 rounded"
        >
          Précédent
        </button>
        <span>
              Page {currentPage} sur {pageCount}
            </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(pageCount, prev + 1))}
          disabled={currentPage === pageCount}
          className="text-sm bg-gray-300 px-3 py-1 rounded"
        >
          Suivant
        </button>
      </div>

      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl max-h-screen overflow-y-auto relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedRequest(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                ×
              </button>

              <h3 className="text-2xl font-semibold mb-4 text-center">Détails de la demande</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p><strong>Nom du client:</strong> {selectedRequest.user?.name}</p>
                <p><strong>Email:</strong> {selectedRequest.user?.email}</p>
                <p><strong>Adresse:</strong> {selectedRequest.adresse_details}</p>
                <p><strong>Date souhaitée:</strong> {new Date(selectedRequest.date_limite).toLocaleDateString()}</p>
                <p><strong>Budget:</strong> {selectedRequest.budget} FCFA</p>
                <p><strong>Priorité:</strong> {selectedRequest.priorité}</p>
                <p><strong>Type de service:</strong> {selectedRequest.type_de_service}</p>
                <p><strong>Statut:</strong> {statusBadge(selectedRequest.statut)}</p>
                <p className="md:col-span-2"><strong>Description:</strong> {selectedRequest.description}</p>
                {selectedRequest.fichiers && (
                  <p className="md:col-span-2">
                    <strong>Fichier joint:</strong>{' '}
                    <a href={`http://localhost:8000/${selectedRequest.fichiers}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      Télécharger
                    </a>
                  </p>
                )}
                {selectedRequest.image_path && (
                  <div className="md:col-span-2">
                    <strong>Image associée:</strong>
                    <img
                      src={`http://localhost:8000/${selectedRequest.image_path}`}
                      alt="Image du service"
                      className="mt-2 max-h-64 object-contain border rounded"
                    />
                  </div>
                )}
              </div>
              <button
                className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-2"
                onClick={() => exportRequestPDF(selectedRequest)}
              >
                <FaDownload /> Exporter en PDF
              </button>
              <div className="mt-6 text-right">
                <a
                  href={`/client/${selectedRequest.user?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fixed bottom-6  bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg"
                >
                  Voir profil client
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DemandesContent;
