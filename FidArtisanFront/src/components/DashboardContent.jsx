import { useEffect, useState } from "react";
import StatCard from "./StatCard2";
import RecentReviews from "./RecentReviews";
import ClientsChart from "./ClientsChart";
import { format, parseISO } from "date-fns";
import fr from "date-fns/locale/fr";
import api from "../services/api";

export default function DashboardContent() {
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem('user');

  useEffect(() => {
    api.get("/profile").then((res) => {
      setArtisan(res.data.artisan);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (!artisan) return <div>Erreur de chargement du profil</div>;

  const profileViews = Math.floor(Math.random() * 500) + 50;
  const newClients = Math.floor(Math.random() * 10) + 1;

  const getMonthlyData = (annonces) => {
    const counts = {};
    for (let i = 0; i < 12; i++) {
      const mois = format(new Date(2025, i, 1), "MMM", { locale: fr });
      counts[mois] = 0;
    }
    annonces.forEach((annonce) => {
      const mois = format(parseISO(annonce.created_at), "MMM", { locale: fr });
      if (counts[mois] !== undefined) {
        counts[mois]++;
      }
    });
    return Object.entries(counts).map(([mois, total]) => ({ mois, total }));
  };

  const chartData = getMonthlyData(artisan.annonces);

  return (
    <>
      <h2 className="text-2xl font-semibold mt-9 mb-6">Bienvenue {user?.name || "Artisan"}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <StatCard title={`${newClients} NOUVEAUX CLIENTS`} />
        <StatCard title={`${profileViews} VUES DU PROFIL`} white />
        <StatCard title={`${artisan.competences.length} COMPÉTENCES`} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentReviews />
        <ClientsChart data={chartData} />
      </div>
    </>
  );
}
