import { useEffect, useState } from "react";
import { FaUser, FaHome, FaCalendar, FaSpeakerDeck, FaCreditCard, FaStar, FaBars, FaTimes } from "react-icons/fa";
import { FileText, Speaker } from "lucide-react";
import api from "../services/api";

export default function Sidebar({ activeContent, setActiveContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const menuItems = [
    { label: "Dashboard", icon: <FaHome className="w-5 h-5 text-blue-500" /> },
    { label: "Mon Profil", icon: <FaUser className="w-5 h-5 text-blue-500" /> },
    { label: "Calendrier", icon: <FaCalendar className="w-5 h-5 text-blue-500" /> },
    { label: "Demandes", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { label: "Annonces", icon: <Speaker className="w-5 h-5 text-blue-500" /> },
    { label: "Paiements", icon: <FaCreditCard className="w-5 h-5 text-blue-500" /> },
    { label: "Avis et Notes", icon: <FaStar className="w-5 h-5 text-blue-500" /> },
  ];

  useEffect(() => {
    api.get("/profile")
      .then(res => setProfile(res.data))
      .catch(err => console.error("Erreur lors de la récupération du profil :", err));
  }, []);

  return (
    <>
      {/* Bouton Burger Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
      >
        <FaBars className="w-6 h-6 text-blue-600" />
      </button>

      {/* Sidebar Desktop + Mobile */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-gray-100 border-r overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:top-16
        `}
      >
        {/* Close Button for Mobile */}
        <div className="flex justify-between items-center p-4 md:hidden">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <FaTimes className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col items-center pt-8 mb-2">
          <p className="font-medium">Artisan</p>
          <p className="text-sm text-gray-500">{profile?.name || "Nom"}</p>
        </div>

        <ul className="space-y-2 pl-8 pb-8">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => {
                  setActiveContent(item.label);
                  setIsOpen(false); // Fermer sur mobile
                }}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-white w-full text-left
                  ${activeContent === item.label ? "bg-white shadow-md border-l-4 border-blue-500" : ""}
                `}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Overlay when menu is open on mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
        />
      )}
    </>
  );
}
