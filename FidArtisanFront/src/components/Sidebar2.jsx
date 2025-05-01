import { Home, User, Calendar, FileText, Speaker, CreditCard, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { FaUser,FaHome,FaCalendar,FaSpeakerDeck,FaCreditCard,FaStar } from "react-icons/fa";
import api from "../services/api";

export default function Sidebar({ activeContent, setActiveContent }) {
  const menuItems = [
    { label: "Dashboard", icon: <FaHome className="w-5 h-5 text-blue-500 " /> },
    { label: "Utilisateur", icon: <FaUser className="w-5 h-5 text-blue-500" /> },
    { label: "Calendrier", icon: <FaCalendar className="w-5 h-5 text-blue-500" /> },
    { label: "Demandes", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { label: "Annonces", icon: <Speaker className="w-5 h-5 text-blue-500" /> },
    { label: "Paiements", icon: <FaCreditCard className="w-5 h-5 text-blue-500" /> },
    { label: "Avis et Notes", icon: <FaStar className="w-5 h-5 text-blue-500" /> },
  ];
  const [profile, setProfile] = useState(null);

  useEffect(()=> {
    api.get('/profile')
    .then(res => setProfile(res.data))
    .catch(err => console.error("Erreur lors de la recuperation du profil :",er));
  }, []);

  return (
    <aside  className=" w-64 fixed top-16 bottom-0 left-0 z-40 bg-gray-100 border-r overflow-y-auto ">
              {/* <h2 className="text-xl font-semibold mb-4 mt-12">Tableau de Bord</h2> */}
        
                <div className="flex flex-col items-center pt-8  mb-2">
            <p className=" font-medium">Artisan</p>
            <p className="text-sm text-gray-500">{profile?.name || "Nom"}</p>
          </div>
      <ul className="space-y-2 pl-8">
        {menuItems.map((item) => (
          <li key={item.label}>
            <button
              onClick={() => setActiveContent(item.label)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-white ${
                activeContent === item.label
                  ? "bg-white shadow-md border-l-4 border-blue-500"
                  : ""
              }`}
              >
              {item.icon}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
