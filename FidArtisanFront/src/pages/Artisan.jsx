import { useState } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaEnvelopeOpenText,
  FaBullhorn,
  FaCreditCard,
  FaStar,
  FaSignOutAlt,
  // FaBell,
  // FaChevronDown,
  // FaArrowRight,
  // FaSearch,
  // FaSlidersH,
} from "react-icons/fa";
import DashboardLayout from "../components/DashboardLayout";

import DashboardContent from "../components/DashboardContent";
import UtilisateurContent from "../components/UtilisateurContent";
import CalendrierContent from "../components/CalendrierContent";
import DemandesContent from "../components/DemandesContent";
import AnnoncesContent from "../components/AnnoncesContent";
import PaiementsContent from "../components/PaiementsContent";
import AvisNotesContent from "../components/AvisNotesContent";
import Header from "../components/Header2";
import ArtisanProfile from "./ArtisanProfileDash";
// import ResponsiveSidebar from "../components/ResponsiveSidebar";

export default function ArtisanDashboard() {
  const [activeContent, setActiveContent] = useState("Dashboard");

  const renderContent = () => {
    switch (activeContent) {
      case "Dashboard":
        return <DashboardContent />;
      case "Utilisateur":
        return <ArtisanProfile />;
      case "Calendrier":
        return <CalendrierContent />;
      case "Demandes":
        return <DemandesContent />;
      case "Annonces":
        return <AnnoncesContent />;
      case "Paiements et Abonnements":
        return <PaiementsContent />;
      case "Avis et Notes":
        return <AvisNotesContent />;
      default:
        return <div>Contenu non disponible</div>;
    }
  };

  return (
    <> 
    <Header setActiveContent={setActiveContent}/>
    <DashboardLayout activeContent={activeContent} setActiveContent={setActiveContent}>
    {renderContent()}
    <footer className="mt-10 text-center text-sm text-gray-500 ">
    Copyright © 2025 Fid’Artisan. All rights reserved.
  </footer>
  </DashboardLayout>
  </>
  );
}

// Optional: simple icon placeholder
// function FaUserIcon({ className = "" }) {
//   return (
//     <svg
//       className={`w-4 h-4 ${className}`}
//       fill="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
//     </svg>
//   );
// }

// function NavItem({ icon, label, active, onClick }) {
//   return (
//     <div
//       className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-white ${
//         active ? "bg-white shadow-md border-l-4 border-blue-500" : ""
//       }`}
//       onClick={onClick}
//     >
//       <span className="text-blue-600">{icon}</span>
//       <span className="font-medium">{label}</span>
//     </div>
//   );
// }


// function ChartCard() {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h3 className="text-md font-medium mb-4">Graph Du Nombres De Clients</h3>
//       <div className="w-full h-48 bg-blue-200 rounded-md flex items-center justify-center text-sm text-gray-600">
//         {/* Placeholder for chart */}Graph Placeholder
//       </div>
//     </div>
//   );
// }