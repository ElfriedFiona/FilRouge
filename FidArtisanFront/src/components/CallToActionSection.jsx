import React from 'react';
const CallToActionSection = () => {
  return <section className="w-full bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Prêt à engager un artisan ?
          </h2>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md text-sm font-medium transition duration-150">
            Rechercher Un Artisan
          </button>
        </div>
        <div className="mt-16 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-4">
                À la recherche de plus d'Affaires?
              </h3>
              <h4 className="text-lg font-medium mb-6">
                Développez votre activité avec FidArtisan
              </h4>
              <p className="text-gray-600 mb-6">
                Quelque soit votre travail, votre localisation, les artisans
                camerounais peuvent rejoindre notre plateforme et développer
                leur activité.
              </p>
              <button className="bg-transparent hover:bg-blue-50 text-blue-500 border border-blue-500 px-6 py-2 rounded-md text-sm font-medium transition duration-150 self-start">
                Professionnels, inscrivez vous gratuitement
              </button>
            </div>
            <div className="hidden md:block">
              <img src="https://images.unsplash.com/photo-1556760544-74068565f05c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Artisan camerounais au travail" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CallToActionSection;