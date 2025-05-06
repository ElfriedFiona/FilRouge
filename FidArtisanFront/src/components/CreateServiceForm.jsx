import { useState } from 'react';
import { motion } from 'framer-motion';
import { isFuture, parseISO } from 'date-fns';
import api from '../services/api';
import MapPicker from './MapPicker';

const CreateServiceForm = ({ userId, artisanId, onSuccess }) => {
  const [formData, setFormData] = useState({
    description: '',
    type_de_service: 'standard',
    budget: '',
    date_limite: '',
    priorité: 'moyenne',
    adresse_details: '',
    image_path: '',
    fichiers: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [fileNames, setFileNames] = useState([]);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.description.trim()) newErrors.description = 'Description obligatoire';
    if (!formData.budget || isNaN(formData.budget)) {
      newErrors.budget = 'Budget invalide';
    }

    if (formData.date_limite && !isFuture(parseISO(formData.date_limite))) {
      newErrors.date_limite = 'La date de début doit être dans le futur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image_path: file }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, fichiers: file }));
      setFileNames([file.name]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append('user_id', userId);
    data.append('artisan_id', artisanId);

    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        data.append(key, value);
      } else {
        data.append(key, value);
      }
    });

    setLoading(true);
    try {
      await api.post('/services', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
      if (onSuccess) onSuccess();
      setFormData({
        description: '',
        type_de_service: 'standard',
        budget: '',
        date_limite: '',
        priorité: 'moyenne',
        adresse_details: '',
        image_path: '',
        fichiers: '',
      });
      setFileNames([]);
    } catch (err) {
      console.error(err);
      setErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg overflow-y-auto max-h-[90vh]">
      <h2 className="text-2xl font-bold mb-6">Créer un service</h2>

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="description" className="block font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows="3"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type_de_service" className="block font-medium text-gray-700">Type de service</label>
              <select
                id="type_de_service"
                name="type_de_service"
                value={formData.type_de_service}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="standard">Standard</option>
                <option value="urgent">Urgent</option>
                <option value="planifié">Planifié</option>
              </select>
            </div>

            <div>
              <label htmlFor="priorité" className="block font-medium text-gray-700">Priorité</label>
              <select
                id="priorité"
                name="priorité"
                value={formData.priorité}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="basse">Basse</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="budget" className="block font-medium text-gray-700">Budget (FCFA)</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
          </div>

          <div>
            <label htmlFor="date_limite" className="block font-medium text-gray-700">Date début</label>
            <input
              type="date"
              id="date_limite"
              name="date_limite"
              value={formData.date_limite}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.date_limite && <p className="text-red-500 text-sm mt-1">{errors.date_limite}</p>}
          </div>

          <div>
            <label htmlFor="adresse_details" className="block font-medium text-gray-700">Adresse</label>
            <input
              type="text"
              id="adresse_details"
              name="adresse_details"
              value={formData.adresse_details}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Cliquez sur la carte ou saisissez manuellement"
            />
          </div>

          <div>
            <MapPicker
              onSelect={(adresse) => {
                setFormData(prev => ({ ...prev, adresse_details: adresse }));
              }}
            />
          </div>

          <div>
            <label htmlFor="image_path" className="block font-medium text-gray-700">Image (facultatif)</label>
            <input
              type="file"
              id="image_path"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 w-full"
            />
          </div>

          <div>
            <label htmlFor="fichiers" className="block font-medium text-gray-700">Fichier (facultatif)</label>
            <input
              type="file"
              id="fichiers"
              onChange={handleFileChange}
              className="mt-1 w-full"
            />
            {fileNames.length > 0 && (
              <ul className="mt-2 text-sm text-gray-700 space-y-1">
                {fileNames.map((name, idx) => (
                  <li key={idx}>📎 {name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
        </button>

        {success && <p className="text-green-600 font-semibold mt-3">Service créé avec succès !</p>}
      </form>
    </div>
  );
};

export default CreateServiceForm;