import { FaUser, FaHome, FaSignOutAlt, FaToolbox } from 'react-icons/fa';

const handleLogout = () => {
      // Implemente ta logique de déconnexion ici (vider le localStorage, etc.)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      // Rediriger vers la page de connexion
      window.location.href = '/login';
    };
    
const Sidebar = () => (
  <div className="bg-white w-64 h-screen shadow-md p-4 flex flex-col justify-between">
    <div>
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Fid'Artisan</h1>
      <ul className="space-y-4">
        <li className="text-blue-700 font-medium flex items-center gap-2"><FaHome /> Tableau de bord</li>
        <li className="flex items-center gap-2"><FaUser /> Utilisateurs</li>
        <li className="flex items-center gap-2"><FaToolbox /> Artisans</li>
      </ul>
    </div>
    <button onClick={handleLogout} className="text-red-600 flex items-center gap-2"><FaSignOutAlt /> Se déconnecter</button>
  </div>
);
export default Sidebar;
