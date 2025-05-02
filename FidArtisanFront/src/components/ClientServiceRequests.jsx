import { useEffect, useState } from 'react';
import api from '../services/api';
import { FaEye, FaTimesCircle, FaFilePdf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';
import toast from 'react-hot-toast';

const statusBadge = (status) => {
  const colors = {
    terminé: 'bg-green-100 text-green-700',
    'en attente': 'bg-yellow-100 text-yellow-700',
    refusé: 'bg-red-100 text-red-700',
    'en cours': 'bg-blue-100 text-blue-700',
    annulé: 'bg-red-200 text-red-800',
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const ITEMS_PER_PAGE = 5;

const ClientServiceRequests = () => {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const userId = localStorage.getItem('userId');
  const [avisModal, setAvisModal] = useState(null); // pour afficher l’avis sélectionné

  useEffect(() => {
    fetchServices();
  }, [userId]);

  const fetchServices = () => {
    api.get(`/services/user/${userId}`)
      .then(({ data }) => {
        setServices(data);
        setFiltered(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // Recherche & tri
  const filterData = (searchValue, statusValue) => {
    let data = [...services];
    if (statusValue) {
      data = data.filter(s => s.statut === statusValue);
    }
    if (searchValue) {
      data = data.filter(s =>
        s.type_de_service.toLowerCase().includes(searchValue) ||
        s.artisan?.user?.name.toLowerCase().includes(searchValue) ||
        s.statut.toLowerCase().includes(searchValue)
      );
    }
    setFiltered(data);
  };

  const handleSearch = value => {
    setSearch(value);
    setCurrentPage(1);
    filterData(value.toLowerCase(), sortStatus);
  };

  const handleSort = status => {
    setSortStatus(status);
    setCurrentPage(1);
    filterData(search.toLowerCase(), status);
  };

  // Pagination
  const paginatedData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // Export CSV
  const exportCSV = () => {
    const headers = ['#', 'Type', 'Artisan', 'Budget', 'Date', 'Priorité', 'Statut', 'Réponse'];
    const rows = filtered.map((s, i) => [
      i + 1,
      s.type_de_service,
      s.artisan?.user?.name || 'N/A',
      parseFloat(s.budget).toLocaleString(),
      moment(s.date_limite).format('DD/MM/YYYY'),
      s.priorité,
      s.statut,
      s.message_reponse || '—'
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'demandes.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // Export PDF général
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Mes demandes de service', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['#','Type','Artisan','Budget','Date','Priorité','Statut','Réponse']],
      body: filtered.map((s,i)=>[
        i+1,
        s.type_de_service,
        s.artisan?.user?.name||'N/A',
        `${parseFloat(s.budget).toLocaleString()} FCFA`,
        moment(s.date_limite).format('DD/MM/YYYY'),
        s.priorité,
        s.statut,
        s.statut_artisan||'—'
      ]),
      headStyles: { fillColor: [49,46,129] },
      styles: { fontSize: 8 }
    });
    doc.save('demandes.pdf');
  };

  // Exporter détails d’une demande en PDF
  const exportServiceDetailsPDF = async service => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16).text('Détails de la demande', 14, y); y+=10;

    // Tableau champs/valeurs
    autoTable(doc, {
      startY: y,
      head: [['Champ','Valeur']],
      body: [
        ['Type de service', service.type_de_service],
        ['Artisan', service.artisan?.user?.name || 'N/A'],
        ['Budget', `${parseFloat(service.budget).toLocaleString()} FCFA`],
        ['Date souhaitée', moment(service.date_limite).format('DD/MM/YYYY')],
        ['Priorité', service.priorité],
        ['Statut', service.statut],
        ['Réponse artisan', service.statut_artisan],
        ['Message réponse', service.message_reponse || '—'],
        ['Description', service.description]
      ],
      styles: { fontSize: 11 }
    });

    y = doc.lastAutoTable.finalY + 10;

    // Image jointe
    if (service.image_path) {
      try {
        const img = new Image();
        img.crossOrigin='anonymous';
        img.src = service.image_path.startsWith('http')
          ? service.image_path
          : `http://127.0.0.1:8000/${service.image_path}`;
        await new Promise(resolve => img.onload = resolve);
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        canvas.getContext('2d').drawImage(img,0,0);
        const imgData = canvas.toDataURL('image/jpeg');
        doc.addPage();
        doc.setFontSize(14).text('Image envoyée',14,20);
        doc.addImage(imgData,'JPEG',14,30,160,120);
      } catch {}
    }

    doc.save(`demande-${service.id}.pdf`);
  };

  const StarRating = ({ note }) => {
    return (
      <div className="flex text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <span key={i}>{i < note ? '★' : '☆'}</span>
        ))}
      </div>
    );
  };
  

  if (loading) return <p>Chargement en cours…</p>;

  return (
    <div className="p-4">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:justify-between mb-8 gap-4 mt-8">
        <h2 className="text-2xl font-bold">Mes demandes de service</h2>
        <div className="flex gap-3 items-center">
          <input
            type="text" value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Rechercher..." 
            className="px-3 py-2 border rounded w-full md:w-64"
          />
          <select
            value={sortStatus}
            onChange={e => handleSort(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="">Tous statuts</option>
            <option value="en attente">En attente</option>
            <option value="en cours">En cours</option>
            <option value="terminé">Terminé</option>
            <option value="annulé">Annulé</option>
            <option value="refusé">Refusé</option>
          </select>
          <button
            onClick={exportCSV}
            className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
          >
            Exporter CSV
          </button>
          <button
            onClick={exportPDF}
            className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
          >
            Exporter PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              {['#','Type','Artisan','Budget','Date souhaitée','Priorité','Statut','Réponse','Avis client','Avis Artisan','Actions']
                .map((h,i)=><th key={i} className="p-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length===0 ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  Aucune demande ne correspond à votre recherche.
                </td>
              </tr>
            ) : paginatedData.map((s,idx)=>(
              <tr key={s.id} className="hover:bg-gray-50 border-b">
                <td className="p-3">{(currentPage-1)*ITEMS_PER_PAGE+idx+1}</td>
                <td className="p-3 font-medium">{s.type_de_service}</td>
                <td className="p-3">{s.artisan?.user?.name || '—'}</td>
                <td className="p-3 text-blue-600 font-semibold">
                  {parseFloat(s.budget).toLocaleString()} FCFA
                </td>
                <td className="p-3">
                  {moment(s.date_limite).format('DD/MM/YYYY')}
                </td>
                <td className="p-3 capitalize">{s.priorité}</td>
                <td className="p-3">{statusBadge(s.statut)}</td>
                <td className="p-3">{statusBadge(s.statut_artisan)}</td>
                <td className="p-3 cursor-pointer" onClick={() => s.avis_et_note && setAvisModal(s.avis_et_note)}>
                  {s.avis_et_note ? (
                    <div className="group">
                      <StarRating note={s.avis_et_note.note} />
                      <div className="text-xs text-blue-600 group-hover:underline">
                        Voir avis
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Aucun avis</span>
                  )}
                </td>
                <td className="p-3 cursor-pointer" onClick={() => s.avis_par_artisans && setAvisModal(s.avis_par_artisans)}>
                  {s.avis_par_artisans ? (
                    <div className="group">
                      <StarRating note={s.avis_par_artisans.note} />
                      <div className="text-xs text-blue-600 group-hover:underline">
                        Voir avis
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Aucun avis</span>
                  )}
                </td>

                <td className="p-3 flex justify-center space-x-2">
                  <button
                    onClick={()=>setSelectedService(s)}
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Voir détails"
                  ><FaEye/></button>
                  <button
                    onClick={()=>exportServiceDetailsPDF(s)}
                    className="text-green-600 hover:text-green-800"
                    title="Exporter en PDF"
                  ><FaFilePdf/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i)=>(
          <button
            key={i}
            onClick={()=>setCurrentPage(i+1)}
            className={`px-3 py-1 border rounded ${
              currentPage===i+1 ? 'bg-indigo-600 text-white':'bg-white text-gray-700'
            }`}
          >{i+1}</button>
        ))}
      </div>

      {/* Modal détails */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 mt-16"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{opacity:0}}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative overflow-auto max-h-[80vh]"
              initial={{ scale:0.9,y:50 }} animate={{ scale:1,y:0 }} exit={{scale:0.9,y:50}}
              transition={{ duration:0.3 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
                onClick={()=>setSelectedService(null)}
              ><FaTimesCircle/></button>

              <div className="p-6 space-y-4">
                <button
                  onClick={()=>exportServiceDetailsPDF(selectedService)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <FaFilePdf/> Exporter cette demande
                </button>
                <h3 className="text-2xl font-semibold text-indigo-700">
                  Détails de la demande
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p><strong>Type :</strong> {selectedService.type_de_service}</p>
                  <p><strong>Budget :</strong> {selectedService.budget} FCFA</p>
                  <p><strong>Date souhaitée :</strong> {moment(selectedService.date_limite).format('DD/MM/YYYY')}</p>
                  <p><strong>Priorité :</strong> {selectedService.priorité}</p>
                  <p className="flex items-center gap-1">
                    <strong>Statut :</strong> {statusBadge(selectedService.statut)}
                  </p>
                  <p className="flex items-center gap-1">
                    <strong>Réponse :</strong> {statusBadge(selectedService.statut_artisan)}
                  </p>
                  <p><strong>Message réponse :</strong> {selectedService.message_reponse || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600"><strong>Description :</strong></p>
                  <p className="mt-1 whitespace-pre-wrap bg-gray-50 border rounded p-3 text-gray-800">
                    {selectedService.description}
                  </p>
                </div>
                {selectedService.image_path && (
                  <div>
                    <h4 className="font-semibold">Image envoyée :</h4>
                    <img
                      src={selectedService.image_path.startsWith('http')
                        ? selectedService.image_path
                        : `http://127.0.0.1:8000/${selectedService.image_path}`
                      }
                      alt="Service"
                      className="mt-2 rounded shadow-md max-w-full"
                    />
                  </div>
                )}
                {selectedService.fichiers && (
                  <div>
                    <h4 className="font-semibold">Fichiers joints :</h4>
                    <ul className="mt-2 space-y-1 text-blue-700">
                      {selectedService.fichiers.split(',').map((file, i)=> {
                        const url = file.startsWith('http')
                          ? file
                          : `http://127.0.0.1:8000/${file}`;
                        return (
                          <li key={i}>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              📎 {file.split('/').pop()}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Formulaire d'avis */}
              {selectedService.statut === 'terminé' && !selectedService.avis_et_note && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const note = e.target.note.value;
                    const commentaire = e.target.commentaire.value;
                    console.log(selectedService);
                    api.post('/avis', {
                      service_id: selectedService.id,         // OK
                      note,
                      commentaire,
                      user_id: selectedService.user_id,       // CORRIGÉ : pas .client.id
                      artisan_id: selectedService.artisan.id, // OK
                    })
                    .then(() => {
                      toast.success("Avis envoyé !");
                      setSelectedService(null);
                      fetchServices(); // pour recharger la liste
                    }).catch(err => {
                      console.error(err);
                      if (err.response && err.response.status === 400) {
                        toast.error("Vous avez déjà laissé un avis pour ce service.");
                      } else {
                        toast.error("Erreur lors de l'envoi de l'avis.");
                      }
                    });
                  }}
                  className="mt-6 border-t pt-4"
                >
                  <h3 className="text-lg font-semibold mb-2">Laisser un avis</h3>
                  <div className="mb-3">
                    <label className="block text-sm">Note (1 à 5)</label>
                    <input
                      name="note"
                      type="number"
                      min="1"
                      max="5"
                      required
                      className="border px-3 py-2 rounded w-24"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm">Commentaire</label>
                    <textarea
                      name="commentaire"
                      required
                      className="border px-3 py-2 rounded w-full"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Envoyer
                  </button>
                </form>
              )}

              {/* Affichage de l’avis existant */}
              {selectedService.statut === 'terminé' && selectedService.avis_et_note && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-lg font-semibold mb-2">Avis laissé</h3>
                  <p><strong>Note :</strong> {selectedService.avis_et_note.note}/5</p>
                  <p><strong>Commentaire :</strong> {selectedService.avis_et_note.commentaire}</p>
                </div>
              )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

       {/* modal avis laissé par le client */ }
      <AnimatePresence>
      {avisModal && (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 mt-16"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{opacity:0}}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative overflow-auto max-h-[80vh]"
              initial={{ scale:0.9,y:50 }} animate={{ scale:1,y:0 }} exit={{scale:0.9,y:50}}
              transition={{ duration:0.3 }}
            >
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
        onClick={() => setAvisModal(null)}
      >
        &times;
      </button>
      <h3 className="text-lg font-semibold mb-4">Avis sur le service</h3>
      {/* <div className="mb-3">
        <strong>Par : </strong>
        <p className="mt-1 text-gray-700 italic">{avisModal.user?.name}</p>
      </div> */}
      <div className="mb-3">
        <strong>Note :</strong>
        <StarRating note={avisModal.note} />
      </div>
      <div>
        <strong>Commentaire :</strong>
        <p className="mt-1 text-gray-700 italic">{avisModal.commentaire}</p>
      </div>
    </div>
  </div>
  </motion.div>
          </motion.div>
      )}
      </AnimatePresence>

    </div>
  );
};

export default ClientServiceRequests;
