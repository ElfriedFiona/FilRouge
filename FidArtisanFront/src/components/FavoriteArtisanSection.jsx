import React from 'react';
import { Star, MapPin } from 'lucide-react';

export function FavoriteArtisansSection({ isEditing }) {
  const artisans = [{
    name: 'Samuel Mbarga',
    profession: 'Menuisier',
    location: 'Douala, Cameroun',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    specialty: 'Meubles traditionnels'
  }, {
    name: 'Marie Ekomo',
    profession: 'Ébéniste',
    location: 'Yaoundé, Cameroun',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    specialty: 'Restauration de meubles'
  }];

  return (
    <div className="bg-white rounded-lg shadow mb-5 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Artisans Favoris</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {artisans.map((artisan, index) => (
          <div key={index} className="border rounded-lg p-4 flex items-start">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-semibold">{artisan.name}</h3>
              <p className="text-sm text-gray-600">{artisan.profession}</p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin size={14} className="mr-1" />
                <span>{artisan.location}</span>
              </div>
              <div className="flex items-center mt-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm ml-1">{artisan.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}