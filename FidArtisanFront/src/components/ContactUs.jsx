import React, { useState } from 'react';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTwitter,
  FaFacebook,
  FaInstagram,
} from 'react-icons/fa';
import api from '../services/api';
 
const ContactUs = () => {

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    titre: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get('/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // ou la manière dont tu stockes ton token
        },
      });
      const user = response.data;
  
      const payload = {
        message: formData.message,
        // si le back-end demande user_id, tu peux l'ajouter ici
      };
      await api.post('/contact', formData);
      alert('Message envoyé avec succès.');
    } catch (error) {
      alert('Erreur lors de l’envoi.');
    }
  };
  

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 my-10">
      <h2 className="text-3xl font-bold text-blue-600 mb-2">Contactez Nous</h2>
      <p className="text-gray-500 mb-10 text-center">
        Envoyez nous un message pour n'importe quel question ou problème!
      </p>

      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Coordonnées */}
        <div className="bg-blue-500 text-white md:w-1/3 p-8 flex flex-col justify-between relative">
        <h3 className="text-xl font-semibold text-center mt-8 ">Nos Coordonnées</h3>
          <div className="flex flex-col items-start justify-center text-left mb-10 flex-grow">
            
            <div className="flex items-center gap-3 mb-4">
              <FaPhoneAlt />
              <span>+237 683258643</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <FaEnvelope />
              <span>contact@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt />
              <span>Douala, Cameroun</span>
            </div>
          </div>

          {/* Icônes sociales */}
          <div className="absolute bottom-6 left-8 flex gap-4 text-white text-lg">
            <FaTwitter className="cursor-pointer hover:text-gray-200" />
            <FaFacebook className="cursor-pointer hover:text-gray-200" />
            <FaInstagram className="cursor-pointer hover:text-gray-200" />
          </div>
        </div>

        {/* Formulaire */}
        <div className="md:w-2/3 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium">Nom</label>
                <input
                name='nom'
                  type="text"
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1 mt-4 md:mt-0">
                <label className="block mb-2 text-sm font-medium">Prenom</label>
                <input
                name='prenom'
                  type="text"
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium">Email</label>
                <input
                name='email'
                  type="email"
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1 mt-4 md:mt-0">
                <label className="block mb-2 text-sm font-medium">Numéro de Téléphone</label>
                <input
                name='telephone'
                  type="number"
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Sujet du Message</label>
              <input
              name='titre'
                type="text"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Message</label>
              <textarea
              name='message'
              onChange={handleChange}
                rows="4"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600 transition duration-300"
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
