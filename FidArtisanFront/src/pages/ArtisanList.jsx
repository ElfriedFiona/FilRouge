import ArtisanCard from "../components/ArtisanCard";
import Layout from "./Layout";
import { useLocation } from "react-router-dom";

export default function ArtisanList() {
  const location = useLocation();
  const artisansData = location.state?.artisans || []; // Renommer pour clarté

  return (
    <Layout>
      <div className="max-w-5xl mx-auto mt-10">
        {artisansData.length > 0 ? (
          artisansData.map((artisan, index) => (
            <ArtisanCard
              key={index}
              artisanData={{ artisan }} // Passer l'objet artisan directement
            />
          ))
        ) : (
          <p className="text-center text-gray-500">Aucun artisan trouvé.</p>
        )}
      </div>
    </Layout>
  );
}