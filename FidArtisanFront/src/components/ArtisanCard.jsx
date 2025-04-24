import { FaStar, FaRegStar, FaMapMarkerAlt, FaCommentDots, FaMugHot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ArtisanCard = ({ artisan }) => {
  const navigate = useNavigate();
  const { name, image, jobsCount, rating, reviews, location, description, id } = artisan;

  const handleViewProfile = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/artisan/${id}`);
    }
  };

  // Construction dynamique de l'URL (ajout du dossier "uploads")
  // const imageUrl = `http://localhost:8000/storage/uploads/${image}`;

  return (
    <div className="bg-gray-300 shadow-md rounded-lg p-6 mb-6 flex flex-col md:flex-row justify-between md:items-start gap-4">
      <div className="flex flex-col sm:flex-row gap-6 flex-1">
        <img src={image} alt={name} className="w-24 h-24 rounded-full object-cover mx-auto sm:mx-0" />
        <div>
          <h2 className="text-xl font-bold">{name}</h2>

          {/* Jobs */}
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <FaMugHot className="mr-1 text-gray-700" />
            <span>{jobsCount} job{jobsCount > 1 && "s"} sur Fid’Artisan</span>
          </div>

          {/* Étoiles */}
          <div className="flex items-center mt-2">
            <span className="text-blue-600 font-semibold mr-1">{rating.toFixed(1)}</span>
            {[...Array(5)].map((_, i) =>
              i < rating ? (
                <FaStar key={i} className="text-blue-500" />
              ) : (
                <FaRegStar key={i} className="text-blue-300" />
              )
            )}
            <span className="ml-2 text-sm text-gray-500">({reviews})</span>
          </div>

          {/* Localisation */}
          <div className="flex items-center text-sm text-gray-700 mt-2">
            <FaMapMarkerAlt className="mr-1" />
            <span>{location}</span>
          </div>

          {/* Description */}
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

export default ArtisanCard;
