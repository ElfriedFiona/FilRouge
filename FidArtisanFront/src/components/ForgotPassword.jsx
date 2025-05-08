import { useState } from "react";
import api from "../services/api2";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/forgot-password", { email });
      toast.success("Lien de réinitialisation envoyé. Vérifiez votre email.");
    } catch (err) {
      toast.error("Erreur lors de l'envoi de l'email.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl mb-4">Réinitialiser le mot de passe</h2>
        <input
          type="email"
          name="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <button type="submit" className="w-full bg-[#00203f] text-white p-2 rounded">
          Envoyer le lien
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
