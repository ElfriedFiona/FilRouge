import { useState } from 'react';
import {
  FaUser,
  FaCalendarAlt,
  FaEnvelopeOpenText,
  FaBullhorn,
  FaCreditCard,
  FaStar,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

function NavItem({ icon, label, active }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition ${active ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>
      <span className="text-lg text-gray-700">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
}

function SidebarContent() {
  return (
<aside className="w-64 bg-gray-100 shadow-lg p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-6">Fid’Artisan</h1>
          <div className="flex flex-col items-center text-center mb-6">
            
            <p className="mt-2 font-medium">Artisan</p>
            <p className="text-sm text-gray-500">Nom</p>
          </div>
          <nav className="space-y-3">
            <NavItem icon={<FaUser />} label="Dashboard" active />
            <NavItem icon={<FaCalendarAlt />} label="Utilisateur" />
            <NavItem icon={<FaEnvelopeOpenText />} label="Calendrier" />
            <NavItem icon={<FaBullhorn />} label="Demandes" />
            <NavItem icon={<FaCreditCard />} label="Annonces" />
            <NavItem icon={<FaStar />} label="Paiements et Abonnements" />
            <NavItem icon={<FaStar />} label="Avis et Notes" />
          </nav>
        </div>
        <button className="text-red-600 flex items-center gap-2 mt-4">
          <FaSignOutAlt /> LOGOUT
        </button>
      </aside>
  );
}

export default function ResponsiveSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bouton Hamburger - visible sur mobile */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md"
      >
        <FaBars className="text-blue-600 text-xl" />
      </button>

      {/* Sidebar Desktop */}
      <aside className="hidden md:block fixed top-0 left-0 h-screen w-64 bg-gray-100 shadow-lg p-4 flex flex-col justify-between z-40">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile (Drawer) */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="fixed top-0 left-0 w-64 h-full bg-gray-100 shadow-lg p-4 flex flex-col justify-between">
            <div className="flex justify-end mb-4">
              <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-gray-200">
                <FaTimes className="text-gray-700 text-xl" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}