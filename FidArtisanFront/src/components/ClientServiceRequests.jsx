import { useEffect, useState } from 'react';
import api from '../services/api';
import { FaEye, FaTimesCircle, FaFilePdf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';
import user1 from '../assets/images/user1.jpg'

const statusBadge = (status) => {
  const colors = {
    terminé: 'bg-green-100 text-green-700',
    'en attente': 'bg-yellow-100 text-yellow-700',
    refusé: 'bg-red-100 text-red-700',
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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get(`/services/user/${userId}`);
        setServices(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Erreur chargement services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [userId]);

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
    const lower = value.toLowerCase();
    filterData(lower, sortStatus);
  };

  const handleSort = (status) => {
    setSortStatus(status);
    setCurrentPage(1);
    filterData(search.toLowerCase(), status);
  };

  const filterData = (searchValue, statusValue) => {
    let data = [...services];
    if (statusValue) {
      data = data.filter((s) => s.statut === statusValue);
    }
    if (searchValue) {
      data = data.filter(
        (s) =>
          s.type_de_service.toLowerCase().includes(searchValue) ||
          s.artisan?.user?.name?.toLowerCase().includes(searchValue) ||
          s.statut.toLowerCase().includes(searchValue)
      );
    }
    setFiltered(data);
  };

  const paginatedData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const exportCSV = () => {
    const headers = ['Type', 'Artisan', 'Budget', 'Date', 'Priorité', 'Statut'];
    const rows = filtered.map(s => [
      s.type_de_service,
      s.artisan?.user?.name || 'N/A',
      s.budget,
      moment(s.date_limite).format('DD/MM/YYYY'),
      s.priorité,
      s.statut,
    ]);
    const csv = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'demandes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const title = 'Mes demandes de service';
    const headers = [['#', 'Type', 'Artisan', 'Budget', 'Date', 'Priorité', 'Statut']];
    const rows = filtered.map((s, idx) => [
      idx + 1,
      s.type_de_service,
      s.artisan?.user?.name || 'N/A',
      `${parseFloat(s.budget).toLocaleString()} FCFA`,
      moment(s.date_limite).format('DD/MM/YYYY'),
      s.priorité,
      s.statut,
    ]);
    doc.text(title, 14, 15);
    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [49, 46, 129] },
    });
    doc.save('demandes.pdf');
  };

  // const ajouterFichiersJoints = (doc, service, startY) => {
  //   const files = service.fichiers ? service.fichiers.split(',') : [];
  //   let y = startY;

  //   if (files.length > 0) {
  //     doc.setFontSize(12);
  //     doc.setTextColor(0, 0, 0);
  //     doc.text('Fichiers joints :', 14, y);
  //     y += 6;
  //     files.forEach((file, index) => {
  //       const fileName = file.split('/').pop();
  //       const fileUrl = `http://localhost:8000/${file}`;
  //       doc.setTextColor(0, 0, 200);
  //       doc.textWithLink(`${index + 1}. ${fileName}`, 20, y, { url: fileUrl });
  //       y += 6;
  //     });
  //   }
  //   doc.save(`demande-${service.id}.pdf`);
  // };

  // Fonction pour charger une image et la convertir en DataURL

  const loadImageAsDataURL = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL('image/jpeg');
      resolve(imgData);
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
};

// Fonction principale
const exportServiceDetailsPDF = async (service) => {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(16);
  doc.text('Détails de la demande de service', 14, y);
  y += 10;

  const data = [
    ['Type de service', service.type_de_service || 'N/A'],
    ['Artisan', service.artisan?.user?.name || 'N/A'],
    ['Budget', `${parseFloat(service.budget || 0).toLocaleString()} FCFA`],
    ['Date limite', service.date_limite ? moment(service.date_limite).format('DD/MM/YYYY') : 'N/A'],
    ['Priorité', service.priorité || 'N/A'],
    ['Statut', service.statut || 'N/A'],
    ['Réponse artisan', service.statut_artisan || 'N/A'],
    ['Description', service.description || 'N/A'],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Champ', 'Valeur']],
    body: data,
    styles: { fontSize: 11 },
  });

  if (service.image_path) {
    try {
      const imageUrl = `http://localhost:8000/${service.image_path}`;
      const imgData = await loadImageAsDataURL(imageUrl);
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Image envoyée', 14, 20);
      doc.addImage(imgData, 'JPEG', 14, 30, 160, 120); // ajuste largeur/hauteur
    } catch (error) {
      console.error('Erreur chargement image pour PDF:', error);
    }
  }
  

  y = doc.lastAutoTable.finalY + 10;

  try {
    // Charger l'image principale si elle existe
    if (service.image_path) {
      const imgURL = `http://127.0.0.1:8000/${service.image_path}`;
      const imgData = await loadImageAsDataURL(imgURL);

      doc.setFontSize(14);
      doc.text('Image du service :', 14, y);
      doc.addImage(imgData, 'JPEG', 14, y + 5, 60, 60); // Taille 60x60 pour mieux s'adapter
      y += 70; // Décaler après l'image
    }

    // Charger d'autres fichiers joints s'ils existent
    if (service.fichiers && Array.isArray(service.fichiers) && service.fichiers.length > 0) {
      doc.setFontSize(14);
      doc.text('Fichiers joints :', 14, y);
      y += 8;

      for (const fichier of service.fichiers) {
        const fichierURL = `http://127.0.0.1:8000/${fichier}`;

        try {
          const fichierImgData = await loadImageAsDataURL(fichierURL);
          doc.addImage(fichierImgData, 'JPEG', 14, y, 50, 50);
          y += 55; // Décalage après chaque fichier
        } catch (error) {
          console.error('Erreur chargement fichier joint', fichierURL, error);
          // En cas d'erreur sur un fichier, on continue sans bloquer le reste
          y += 10;
          doc.setFontSize(10);
          doc.text(`Erreur chargement : ${fichier}`, 14, y);
          y += 5;
        }
      }
    }

    // Enfin, sauvegarder
    doc.save(`service-${service.id || 'details'}.pdf`);
  } catch (error) {
    console.error('Erreur export PDF:', error);
    doc.save(`service-${service.id || 'details'}-sans-images.pdf`);
  }
};


    // const generatePDF = async () => {
    //   const doc = new jsPDF();
  
    //   doc.setFontSize(18);
    //   doc.text('Exemple PDF - Service avec Image', 14, 20);
  
    //   autoTable(doc, {
    //     startY: 30,
    //     head: [['Champ', 'Valeur']],
    //     body: [
    //       ['Type de service', 'Plomberie'],
    //       ['Artisan', 'Jean Dupont'],
    //       ['Budget', '100 000 FCFA'],
    //       ['Date limite', '01/05/2025'],
    //       ['Priorité', 'Haute'],
    //       ['Statut', 'En attente'],
    //       ['Description', 'Réparer une fuite d\'eau dans la cuisine.'],
    //     ],
    //     styles: { fontSize: 12 },
    //   });
  
    //   let y = doc.lastAutoTable.finalY + 10;
  
    //   // Exemple d'image URL
    //   const imageUrl = user1; // <- remplace par ton URL réelle
  
    //   // On charge l'image
    //   const img = new Image();
    //   img.crossOrigin = 'anonymous'; // Important si ton image vient d'un autre domaine
    //   img.src = imageUrl;
  
    //   img.onload = () => {
    //     const canvas = document.createElement('canvas');
    //     canvas.width = img.width;
    //     canvas.height = img.height;
    //     const ctx = canvas.getContext('2d');
    //     ctx.drawImage(img, 0, 0);
  
    //     const imgData = canvas.toDataURL('image/jpeg');
  
    //     doc.setFontSize(14);
    //     doc.text('Image liée au service :', 14, y);
  
    //     doc.addImage(imgData, 'JPEG', 14, y + 5, 50, 50);
  
    //     doc.save('service-details-with-image.pdf');
    //   };
  
    //   img.onerror = () => {
    //     console.error('Erreur chargement image');
    //     doc.save('service-details-without-image.pdf');
    //   };
    // };

  if (loading) return <p>Chargement en cours...</p>;

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold">Mes demandes de service</h2>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Rechercher..."
            className="px-3 py-2 border rounded w-full md:w-64"
          />
          <select
            className="px-3 py-2 border rounded"
            value={sortStatus}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="">Trier par statut</option>
            <option value="en attente">En attente</option>
            <option value="refusé">Refusé</option>
            <option value="terminé">Terminé</option>
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
        {/* <div className="flex items-center justify-center h-screen">
      <button
        onClick={generatePDF}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Exporter PDF
      </button>
    </div> */}
        </div>
      </div>

      <div className="relative overflow-x-auto border rounded shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Type</th>
              <th className="p-3">Artisan</th>
              <th className="p-3">Budget</th>
              <th className="p-3">Date limite</th>
              <th className="p-3">Priorité</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Réponse</th>
              <th className="p-3 text-center">Voir</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  Aucune demande ne correspond à votre recherche.
                </td>
              </tr>
            ) : (
              paginatedData.map((s, idx) => (
                <tr key={s.id} className="hover:bg-gray-50 border-b">
                  <td className="p-3">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                  <td className="p-3 font-medium">{s.type_de_service}</td>
                  <td className="p-3">{s.artisan?.user?.name || 'N/A'}</td>
                  <td className="p-3 text-blue-600 font-semibold">{parseFloat(s.budget).toLocaleString()} FCFA</td>
                  <td className="p-3">{moment(s.date_limite).format('DD/MM/YYYY')}</td>
                  <td className="p-3 capitalize">{s.priorité}</td>
                  <td className="p-3">{statusBadge(s.statut)}</td>
                  <td className="p-3">{statusBadge(s.statut_artisan)}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedService(s)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Voir les détails"
                    >
                      <FaEye />
                    </button>
                    <button
  onClick={() => exportServiceDetailsPDF(s)}
  className="text-green-600 hover:text-green-800 ml-2"
  title="Exporter en PDF"
>
  <FaFilePdf />
</button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedService && (

          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            
            <motion.div
              className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative overflow-hidden"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
            >
                
              <button
                className="absolute top-10 right-3 text-gray-500 hover:text-red-500 text-xl"
                onClick={() => setSelectedService(null)}
              >
                <FaTimesCircle />
              </button>
              
        <div className="max-h-[75vh] overflow-y-auto pr-2">
        <button
          onClick={() => exportServiceDetailsPDF(selectedService)}
          className="bg-green-600 top-20 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <FaFilePdf />
        </button>
                <h3 className="text-2xl font-semibold text-indigo-700">Détails de la demande</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  
                  <p><strong>Type :</strong> {selectedService.type_de_service}</p>
                  <p><strong>Budget :</strong> {selectedService.budget} FCFA</p>
                  <p><strong>Date limite :</strong> {moment(selectedService.date_limite).format('DD/MM/YYYY')}</p>
                  <p><strong>Priorité :</strong> {selectedService.priorité}</p>
                  <p className="flex items-center gap-1"><strong>Statut :</strong> {statusBadge(selectedService.statut)}</p>
                  <p className="flex items-center gap-1"><strong>Réponse :</strong> {statusBadge(selectedService.statut_artisan)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600"><strong>Description :</strong></p>
                  <p className="bg-gray-50 border rounded p-3 text-gray-800 mt-1 whitespace-pre-wrap">{selectedService.description}</p>
                </div>
                {selectedService?.image_path && (
  <div className="mt-4">
    <h4 className="font-semibold">Image envoyée :</h4>
    {console.log("Image path récupéré :", selectedService.image_path)}
    <img
      src={selectedService.image_path.startsWith('http') 
        ? selectedService.image_path 
        : `http://127.0.0.1:8000/${selectedService.image_path}`
      }
      alt="Service"
      className="mt-2 rounded shadow-md w-64"
    />
  </div>
)}

{selectedService?.fichiers && (
  <div className="mt-4">
    <h4 className="font-semibold">Fichiers joints :</h4>
    {console.log("Fichiers récupérés (string) :", selectedService.fichiers)}
    <ul className="mt-2 text-sm text-blue-700 space-y-1">
      {selectedService.fichiers.split(',').map((file, idx) => {
        const fileUrl = file.startsWith('http') 
          ? file 
          : `http://127.0.0.1:8000/${file}`;
        console.log(`Fichier [${idx}] :`, file, "URL finale :", fileUrl);
        return (
          <li key={idx}>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              📎 {file.split('/').pop()}
            </a>
          </li>
        );
      })}
    </ul>
  </div>
)}


              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientServiceRequests;
