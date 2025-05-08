import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    token: searchParams.get('token') || '',
    password: '',
    password_confirmation: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/reset-password', formData);
      setMessage('Mot de passe réinitialisé avec succès !');
      setTimeout(() => navigate('/login'), 2000); // redirige vers login
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Une erreur est survenue.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Réinitialiser votre mot de passe</h2>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="email" value={formData.email} />
        <input type="hidden" name="token" value={formData.token} />

        <div className="mb-4">
          <label className="block mb-1">Nouveau mot de passe</label>
          <input
            type="password"
            name="password"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Confirmer le mot de passe</label>
          <input
            type="password"
            name="password_confirmation"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Réinitialiser
        </button>
      </form>
    </div>
  );
}
