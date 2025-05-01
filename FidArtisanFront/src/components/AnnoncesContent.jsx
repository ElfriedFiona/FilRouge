import { useEffect, useState } from "react";
import api from "../services/api";
import 'react-toastify/dist/ReactToastify.css'; // Importation des styles
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AnnoncesContent() {
  const [annonces, setAnnonces] = useState([]);
  const [formData, setFormData] = useState({
    titre_annonce: "",
    detail_annonce: "",
    image: null,
  });
  const [editingAnnonce, setEditingAnnonce] = useState(null);

  // Charger les annonces au démarrage
  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const response = await api.get("/annonces");
        setAnnonces(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des annonces", error);
      }
    };

    fetchAnnonces();
  }, []);

  // Gérer les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Gérer l'upload de l'image
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // Fonction pour créer ou modifier une annonce
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("titre_annonce", formData.titre_annonce);
    formDataToSend.append("detail_annonce", formData.detail_annonce);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (editingAnnonce) {
        // Mettre à jour l'annonce
        await api.put(`/annonces/${editingAnnonce.id}`, formDataToSend);
        setAnnonces(
          annonces.map((annonce) =>
            annonce.id === editingAnnonce.id ? { ...annonce, ...formData } : annonce
          )
        );
        toast.success("Annonce modifiée avec succès !"); // Toast de succès
      } else {
        // Créer une nouvelle annonce
        const response = await api.post("/annonces", formDataToSend);
        setAnnonces([...annonces, response.data]);
        toast.success("Annonce créée avec succès !"); // Toast de succès
      }
      setFormData({ titre_annonce: "", detail_annonce: "", image: null });
      setEditingAnnonce(null);
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire", error);
      toast.error("Une erreur est survenue, veuillez réessayer."); // Toast d'erreur
    }
  };

  // Fonction pour modifier une annonce
  const handleEdit = (annonce) => {
    setFormData({
      titre_annonce: annonce.titre_annonce,
      detail_annonce: annonce.detail_annonce,
      image: null, // Optionnel : gérer l'image dans l'interface
    });
    setEditingAnnonce(annonce);
  };

  // Fonction pour supprimer une annonce
  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression de cette annonce ?")) {
      try {
        await api.delete(`/annonces/${id}`);
        setAnnonces(annonces.filter((annonce) => annonce.id !== id));
        toast.success("Annonce supprimée avec succès !"); // Toast de succès
      } catch (error) {
        console.error("Erreur lors de la suppression de l'annonce", error);
        toast.error("Une erreur est survenue lors de la suppression."); // Toast d'erreur
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <h3 className="text-xl font-semibold text-blue-600">Vos Annonces</h3>

      {/* Formulaire pour créer ou modifier une annonce */}
      <form onSubmit={handleSubmit} className="mt-6">
        <input
          type="text"
          name="titre_annonce"
          placeholder="Titre de l'annonce"
          value={formData.titre_annonce}
          onChange={handleChange}
          className="border p-2 rounded mb-4 w-full"
        />
        <textarea
          name="detail_annonce"
          placeholder="Détails de l'annonce"
          value={formData.detail_annonce}
          onChange={handleChange}
          className="border p-2 rounded mb-4 w-full"
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="border p-2 rounded mb-4 w-full"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          {editingAnnonce ? "Modifier l'annonce" : "Créer l'annonce"}
        </button>
      </form>

      {/* Liste des annonces */}
      <div className="mt-6">
        {annonces.length > 0 ? (
          annonces.map((annonce) => (
            <div key={annonce.id} className="bg-gray-100 p-4 rounded shadow mb-4">
              <h4 className="text-lg font-semibold">{annonce.titre_annonce}</h4>
              <p className="mt-2">{annonce.detail_annonce}</p>
              <p className="mt-2 text-sm text-gray-600">
                Publiée par: {annonce.artisan?.user?.name} - {new Date(annonce.published_at).toLocaleDateString()}
              </p>
              {annonce.image_path && (
                <img
                  src={`http://localhost:8000/storage/${annonce.image_path}`}
                  alt="Annonce"
                  className="mt-4 max-w-full h-auto"
                />
              )}
              <button
                onClick={() => handleEdit(annonce)}
                className="mt-2 text-blue-500 hover:text-blue-700"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(annonce.id)}
                className="mt-2 text-red-500 hover:text-red-700 ml-4"
              >
                Supprimer
              </button>
            </div>
          ))
        ) : (
          <p>Aucune annonce disponible.</p>
        )}
      </div>

      {/* Initialisation des toasts */}
      <ToastContainer />
    </div>
  );
}
