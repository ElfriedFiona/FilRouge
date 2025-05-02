import ArtisanCard from "./ArtisanCard";
import { useLocation } from "react-router-dom";

export default function ResultatsContent({ resultats }) {
    const location = useLocation();
    const artisans = location.state?.artisans || [];
    return (
        <div className="max-w-5xl mx-auto mt-10">
        {artisans.length > 0 ? (
          artisans.map((artisan, index) => {
            const photo = artisan?.photo;
            const imageUrl = photo
              ? `http://localhost:8000/storage/uploads/${photo}`
              : "https://via.placeholder.com/150";

            return (
              <ArtisanCard
                key={index}
                artisan={{
                  id: artisan.id,
                  name: artisan.user?.name || "Nom non défini",
                  image: imageUrl,
                  jobsCount: artisan.jobs_count || 0,
                  rating: artisan.rating || 5,
                  reviews: artisan.reviews || 1,
                  location: artisan.ville?.nom || "Ville non définie",
                  description: artisan.description || "Aucune description disponible"
                }}
              />
            );
          })
        ) : (
          <p className="text-center text-gray-500">Aucun artisan trouvé.</p>
        )}
      </div>
    );
  }
  