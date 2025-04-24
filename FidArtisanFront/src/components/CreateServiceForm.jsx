import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isFuture, parseISO } from 'date-fns';
import api from '../services/api';
import MapPicker from './MapPicker'; 

const CreateServiceForm = ({ userId, artisanId, onSuccess  }) => {
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

  const [preview, setPreview] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [fileNames, setFileNames] = useState([]);

  const validate = () => {
    const newErrors = {};

    if (!formData.description.trim()) newErrors.description = 'Description obligatoire';
    if (!formData.budget || isNaN(formData.budget)) {
      newErrors.budget = 'Budget invalide';
    } else if (formData.budget < 10 || formData.budget > 10000) {
      newErrors.budget = 'Budget entre 10 et 10 000 €';
    }

    if (formData.date_limite && !isFuture(parseISO(formData.date_limite))) {
      newErrors.date_limite = 'Date limite doit être dans le futur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setPreview(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Un seul fichier
    if (file) {
      setFormData(prev => ({ ...prev, image_path: file }));
      setImagePreviews([URL.createObjectURL(file)]);
    }
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Un seul fichier
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
        data.append(key, value); // un seul fichier
      } else {
        data.append(key, value);
      }
    });
  
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
      setImagePreviews([]);
      setFileNames([]);
      setPreview({});
    } catch (err) {
      console.error(err);
      setErrors(err.response?.data?.errors || {});
    }
  };
  

  return (
<div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
  <h2 className="text-2xl font-bold mb-6">Créer un service</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Formulaire */}
    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block font-medium">Type de service</label>
          <select
            name="type_de_service"
            value={formData.type_de_service}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="standard">Standard</option>
            <option value="urgent">Urgent</option>
            <option value="planifié">Planifié</option>
          </select>
        </div>

        <div className="w-1/2">
          <label className="block font-medium">Priorité</label>
          <select
            name="priorité"
            value={formData.priorité}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="basse">Basse</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block font-medium">Budget (€)</label>
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}
      </div>

      <div>
        <label className="block font-medium">Date limite</label>
        <input
          type="date"
          name="date_limite"
          value={formData.date_limite}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        {errors.date_limite && <p className="text-red-500 text-sm">{errors.date_limite}</p>}
      </div>

      <div>
        <label className="block font-medium">Adresse</label>
        <input
          type="text"
          name="adresse_details"
          value={formData.adresse_details}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Cliquez sur la carte ou saisissez manuellement"
        />
      </div>

      <MapPicker
        onSelect={(adresse) => {
          setFormData(prev => ({ ...prev, adresse_details: adresse }));
          setPreview(prev => ({ ...prev, adresse_details: adresse }));
        }}
      />

      <div>
        <label className="block font-medium">Image (facultatif)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
        {imagePreviews.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {imagePreviews.map((src, index) => (
              <img key={index} src={src} alt="preview" className="h-24 w-auto rounded shadow" />
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block font-medium">Fichier (facultatif)</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full"
        />
        {fileNames.length > 0 && (
          <ul className="mt-2 text-sm text-gray-700 space-y-1">
            {fileNames.map((name, idx) => (
              <li key={idx}>📎 {name}</li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Envoyer la demande
      </button>

      {success && <p className="text-green-600 font-semibold mt-2">Service créé avec succès !</p>}
    </form>

    {/* Aperçu à droite */}
    {Object.keys(preview).length > 0 && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
      >
        <h3 className="text-lg font-semibold mb-4">Aperçu</h3>
        <ul className="text-sm space-y-2">
          <li><strong>Description:</strong> {preview.description}</li>
          <li><strong>Type:</strong> {preview.type_de_service}</li>
          <li><strong>Priorité:</strong> {preview.priorité}</li>
          <li><strong>Budget:</strong> {preview.budget} €</li>
          <li><strong>Date limite:</strong> {preview.date_limite && format(parseISO(preview.date_limite), 'dd/MM/yyyy')}</li>
          <li><strong>Adresse:</strong> {preview.adresse_details}</li>
        </ul>
      </motion.div>
    )}
  </div>
</div>

  );
};

export default CreateServiceForm;
