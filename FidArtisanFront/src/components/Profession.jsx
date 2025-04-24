import React from 'react';
import {
  SofaIcon,
  ShirtIcon,
  ShapesIcon,
  PaletteIcon,
  GemIcon,
  FlameIcon,
  PencilIcon,
  SprayCanIcon,
  ScissorsIcon,
  BriefcaseIcon,
  TruckIcon,
  CarIcon,
  ZapIcon,
  SnowflakeIcon,
  HammerIcon,
  LaptopIcon,
  WrenchIcon,
  HeartIcon,
} from 'lucide-react'; // Assurez-vous que le chemin d'importation est correct

const Profession = () => {
  const metiersArt = [{
      name: 'Bijoutier-joaillier',
      icon: <GemIcon className="h-4 w-4" />
  }, {
      name: 'Peintre-décorateur / portraitiste',
      icon: <PaletteIcon className="h-4 w-4" /> // Vous pouvez choisir une icône plus appropriée
  }, {
      name: 'Fleuriste',
      icon: <div className="h-4 w-4" /> // Pas d'icône correspondante directe, vous pouvez en ajouter une
  }, {
      name: 'Sculpteur / décorateur sur tous matériaux',
      icon: <ShapesIcon className="h-4 w-4" />
  }, {
      name: 'Ceramiste (Potier)',
      icon: <PaletteIcon className="h-4 w-4" />
  }, {
      name: 'Ferronnier art',
      icon: <FlameIcon className="h-4 w-4" />
  }, {
      name: 'Paysagiste / Créateur d espaces verts',
      icon: <div className="h-4 w-4" /> // Pas d'icône correspondante directe
  }, {
      name: 'Brodeur',
      icon: <ShirtIcon className="h-4 w-4" /> // Une icône de vêtement pourrait convenir
  }];

  const metiersProduction = [{
      name: 'Maroquinier',
      icon: <BriefcaseIcon className="h-4 w-4" />
  }, {
      name: 'Forgeron',
      icon: <HammerIcon className="h-4 w-4" />
  }, {
      name: 'Ebéniste',
      icon: <SofaIcon className="h-4 w-4" />
  }, {
      name: 'Fabricant objets en bambou',
      icon: <div className="h-4 w-4" /> // Pas d'icône correspondante directe
  }, {
      name: 'Vannier / Spartier',
      icon: <ScissorsIcon className="h-4 w-4" /> // Peut-être une icône de tissage serait mieux
  }, {
      name: 'Tôlier',
      icon: <div className="h-4 w-4" /> // Pas d'icône correspondante directe
  }, {
      name: 'Soudeur',
      icon: <FlameIcon className="h-4 w-4" /> // Utilisation de l'icône de flamme
  }, {
      name: 'Charpentier',
      icon: <div className="h-4 w-4" /> // Pas d'icône correspondante directe
  }, {
      name: 'Menuisier-agenceur',
      icon: <SofaIcon className="h-4 w-4" /> // Utilisation de l'icône de meuble
  }, {
      name: 'Fabricant de bougies',
      icon: <div className="h-4 w-4" /> // Pas d'icône correspondante directe
  }, {
      name: 'Fabricant objets en plastique',
      icon: <div className="h-4 w-4" /> // Pas d'icône correspondante directe
  }, {
      name: 'Fabricant de rotin',
      icon: <div className="h-4 w-4" /> // Pas d'icône correspondante directe
  }, {
      name: 'Fabricant de pavés',
      icon: <div className="h-4 w-4" /> // Pas d'icône correspondante directe
  }, {
      name: 'Menuisier',
      icon: <SofaIcon className="h-4 w-4" /> // Utilisation de l'icône de meuble
  }];

  const metiersService = [{
      name: 'Canalisateur',
      icon: <div className="h-4 w-4" />
  }, {
      name: 'Foreur / installateur de puits d’eau',
      icon: <div className="h-4 w-4" />
  }, {
      name: 'Électricien bâtiment',
      icon: <ZapIcon className="h-4 w-4" />
  }, {
      name: 'Plombier (installateur sanitaire)',
      icon: <WrenchIcon className="h-4 w-4" />
  }, {
      name: 'Spécialiste de froid et climatisation',
      icon: <SnowflakeIcon className="h-4 w-4" />
  }, {
      name: 'Tresseur',
      icon: <ScissorsIcon className="h-4 w-4" /> // Peut-être une icône différente serait mieux
  }, {
      name: 'Mécanicien engins agricoles',
      icon: <TruckIcon className="h-4 w-4" />
  }];
  return <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-[500px] max-w-[calc(100vw-200px)] max-h-60 overflow-y-auto">
      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8 lg:grid-cols-3">
          {/* Métiers d'Art */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-2 flex items-center">
              <PaletteIcon className="h-5 w-5 mr-2 text-blue-500" />
              Métiers d'Art 🎨
            </h3>
            <ul className="space-y-2">
              {metiersArt.map((metier, index) => <li key={index}>
                  <a href="#" className="flex items-center p-1 rounded-md hover:bg-blue-50 transition-colors duration-150">
                    <span className="text-blue-500 mr-2">{metier.icon}</span>
                    <span className="text-sm text-gray-700">{metier.name}</span>
                  </a>
                </li>)}
            </ul>
          </div>
          {/* Métiers de Production */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-2 flex items-center">
              <HammerIcon className="h-5 w-5 mr-2 text-blue-500" />
              Métiers de Production 🏭
            </h3>
            <ul className="space-y-2">
              {metiersProduction.map((metier, index) => <li key={index}>
                  <a href="#" className="flex items-center p-1 rounded-md hover:bg-blue-50 transition-colors duration-150">
                    <span className="text-blue-500 mr-2">{metier.icon}</span>
                    <span className="text-sm text-gray-700">{metier.name}</span>
                  </a>
                </li>)}
            </ul>
          </div>
          {/* Métiers de Service */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-2 flex items-center">
              <WrenchIcon className="h-5 w-5 mr-2 text-blue-500" />
              Métiers de Service 🛠️
            </h3>
            <ul className="space-y-2">
              {metiersService.map((metier, index) => <li key={index}>
                  <a href="#" className="flex items-center p-1 rounded-md hover:bg-blue-50 transition-colors duration-150">
                    <span className="text-blue-500 mr-2">{metier.icon}</span>
                    <span className="text-sm text-gray-700">{metier.name}</span>
                  </a>
                </li>)}
            </ul>
          </div>
        </div>
      </div>
      <style >{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>;
};
export default Profession;