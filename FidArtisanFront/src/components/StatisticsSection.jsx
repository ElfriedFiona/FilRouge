// import React from 'react';
import { Users2Icon, GridIcon, MessageSquareIcon } from 'lucide-react';
const StatisticsSection = () => {
  return <section className="w-full bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 group">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Users2Icon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-blue-500 transition-colors duration-300">
              38965
            </div>
            <div className="text-sm text-gray-600">artisans qualifiés</div>
          </div>
          <div className="text-center p-6 group">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                <GridIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-blue-500 transition-colors duration-300">
              + de 30
            </div>
            <div className="text-sm text-gray-600">catégories métiers</div>
          </div>
          <div className="text-center p-6 group">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                <MessageSquareIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-blue-500 transition-colors duration-300">
              164582
            </div>
            <div className="text-sm text-gray-600">avis clients vérifiés</div>
          </div>
        </div>
      </div>
    </section>;
};
export default StatisticsSection;