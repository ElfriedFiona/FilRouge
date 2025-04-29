import React from 'react';
import { SofaIcon, SnowflakeIcon, ZapIcon } from 'lucide-react';
import menuisier_ebeniste from '../assets/images/menuisier_ebeniste.jpeg';
import rotin from "../assets/images/fabricant_rotin.jpeg";
import sculpteur from "../assets/images/sculpteur.jpeg";

const PopularServicesSection = () => {
  const services = [{
    src: menuisier_ebeniste,
        title: 'Ébénisterie',
        alt: 'Ébéniste travaillant le bois',
    icon: <SofaIcon className="h-6 w-6" />,
    count: '2,839'
  }, {
    src: rotin,
        title: 'fabricant_rotin',
        alt: 'fabricant_rotin',
        icon: <SnowflakeIcon className="h-6 w-6" />,
    count: '1,547'
  }, {
    src: sculpteur,
        title: 'Sculpteur',
        alt: 'sculpteur',
        icon: <ZapIcon className="h-6 w-6" />,
    count: '3,234'
  }];
  return <section className="w-full bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          Travaux Populaires
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => <div key={index} className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={service.src} alt={service.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white flex items-center">
                  <div className="bg-blue-500 p-2 rounded-full mr-2">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4">
                  {service.alt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {service.count} artisans disponibles
                  </div>
                  <a href="#" className="text-blue-500 hover:text-blue-600 text-sm font-medium group-hover:underline">
                    Voir Plus
                  </a>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default PopularServicesSection;