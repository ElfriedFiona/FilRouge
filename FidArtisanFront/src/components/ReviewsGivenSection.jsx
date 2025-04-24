// import React from 'react';
import { Star } from 'lucide-react';

export function ReviewsGivenSection({ isEditing }) {
  const reviews = [{
    artisan: 'Samuel Mbarga',
    service: "Fabrication d'une Table sur Mesure",
    rating: 5,
    date: '15 Oct 2023',
    comment: 'Excellent travail, exactement ce que je voulais. Très professionnel et ponctuel.'
  }, {
    artisan: 'Marie Ekomo',
    service: "Rénovation d'une Armoire Ancienne",
    rating: 5,
    date: '2 Sept 2023',
    comment: 'Service impeccable, la restauration est magnifique. Je recommande vivement.'
  }];

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow mb-5 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Mes Avis</h2>
      </div>
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex flex-col">
              <div>
                <h3 className="font-semibold">{review.service}</h3>
                <p className="text-sm text-gray-600">Par {review.artisan}</p>
              </div>
              <div className="flex items-center mt-2">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="ml-2 text-sm text-gray-500">
                  {review.date}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}