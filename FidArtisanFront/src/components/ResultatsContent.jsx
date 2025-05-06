import { FaStar, FaRegStar, FaMapMarkerAlt, FaCommentDots, FaMugHot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ResultatsContent({ resultats }) { // Récupérer les résultats via la prop
  const navigate = useNavigate();

  const ArtisanCard = ({ artisan }) => { // `artisan` directement comme prop
    const name = artisan?.user?.name || "Nom non défini";
    const image = artisan?.photo
      ? `http://localhost:8000/storage/uploads/${artisan.photo}`
      : "https://via.placeholder.com/150";
    const location = artisan?.ville?.nom || "Ville non définie";
    const description = artisan?.description || "Aucune description disponible";
    const professionName = artisan?.profession?.nom || "Profession non définie";
    const id = artisan?.id;
    const reviews = artisan?.avis?.length || 0;
    const jobsCount = artisan?.services?.length || 0;

    const totalNotes = artisan?.avis?.reduce((sum, avis) => sum + avis.note, 0) || 0;
    const rating = reviews > 0 ? totalNotes / reviews : 0;

    const handleViewProfile = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/login");
      } else {
        navigate(`/artisan/${id}`);
      }
    };

    return (
      <div className="bg-gray-300 shadow-md rounded-lg p-6 mb-6 flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div className="flex flex-col sm:flex-row gap-6 flex-1">
          <img
            src={image}
            alt={name}
            className="w-24 h-24 rounded-full object-cover mx-auto sm:mx-0"
          />
          <div>
            <h2 className="text-xl font-bold">{name}</h2>
            <h3 className="text-lg text-gray-700">{professionName}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <FaMugHot className="mr-1 text-gray-700" />
              <span>{jobsCount} job{jobsCount > 1 && "s"} sur Fid’Artisan</span>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-blue-600 font-semibold mr-1">{rating > 0 ? rating.toFixed(1) : ''}</span>
              {reviews > 0 ? (
                [...Array(5)].map((_, i) =>
                  i < rating ? (
                    <FaStar key={i} className="text-blue-500" />
                  ) : (
                    <FaRegStar key={i} className="text-blue-300" />
                  )
                )
              ) : (
                <span className="text-sm text-gray-500">(0 avis)</span>
              )}
              {reviews > 0 && <span className="ml-2 text-sm text-gray-500">({reviews} avis)</span>}
            </div>
            <div className="flex items-center text-sm text-gray-700 mt-2">
              <FaMapMarkerAlt className="mr-1" />
              <span>{location}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2 max-w-md">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end justify-between gap-4 mt-4 md:mt-0">
          <div className="flex items-center text-sm text-gray-600">
            <FaCommentDots className="text-xl mr-2" />
            <span>contacter pour avoir un devis</span>
          </div>
          <button
            onClick={handleViewProfile}
            className="bg-blue-600 mt-20 text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
          >
            Voir le Profil
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      {resultats && resultats.length > 0 ? ( // Utiliser la prop `resultats`
        resultats.map((artisan, index) => (
          <ArtisanCard
            key={index}
            artisan={artisan} // Passer l'artisan directement à ArtisanCard
          />
        ))
      ) : (
        <p className="text-center text-gray-500">Aucun artisan trouvé.</p>
      )}
    </div>
  );
}