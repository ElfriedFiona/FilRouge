import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import UserTable from "../components/UserTable";
import { FaUsers, FaHammer, FaClipboardList } from "react-icons/fa";

const AdminDashboard = () => {
  const stats = [
    { title: "Clients", value: 1000, icon: <FaUsers />, bgColor: "bg-blue-500" },
    { title: "Artisans", value: 1000, icon: <FaHammer />, bgColor: "bg-blue-700" },
    { title: "Demandes de service", value: 500, icon: <FaClipboardList />, bgColor: "bg-blue-900" },
  ];

  const users = [{ name: "Jean Dupont", email: "jean@mail.com" }, { name: "Sophie Martin", email: "sophie@mail.com" }];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h2 className="text-xl font-semibold mb-4">Bienvenue Admin</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UserTable title="Derniers clients inscrits" data={users} />
          <UserTable title="Derniers artisans inscrits" data={users} />
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
