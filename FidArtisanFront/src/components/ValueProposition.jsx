import { CheckCircleIcon, ShieldCheckIcon, ThumbsUpIcon } from 'lucide-react';
const ValuePropositionSection = () => {
  return <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4 ">
          Pourquoi FidArtisan est la solution fiable
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          FidArtisan réunit des artisans fiables qui font partie de notre réseau
          d'experts. Nous vérifions les compétences et les qualifications pour
          vous garantir un service de qualité.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4 md:mb-0 md:mr-4">
              <CheckCircleIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Les artisans dont vous avez besoin
              </h3>
              <p className="text-gray-600">
                Accédez aux artisans disposant des compétences spécifiques à
                votre besoin. Nos artisans sont des professionnels expérimentés
                qui vous garantissent un travail bien fait.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4 md:mb-0 md:mr-4">
              <ThumbsUpIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                De véritables avis clients
              </h3>
              <p className="text-gray-600">
                Grâce à notre système d'évaluation, vous avez accès à de
                véritables avis clients qui vous permettent de faire le meilleur
                choix pour votre projet.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4 md:mb-0 md:mr-4">
              <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Vous avez le contrôle
              </h3>
              <p className="text-gray-600">
                Comparez les offres, choisissez l'artisan qui vous convient le
                mieux et suivez l'avancement de votre projet en toute
                simplicité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ValuePropositionSection;