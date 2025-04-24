// src/components/artisan/ReviewsSection.jsx
import React from 'react';
import { Star, Plus, Pencil } from 'lucide-react';

export default function ReviewsSection({ reviews, isEditing }) {
  const avg = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const renderStars = (n) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < n ? 'text-yellow-400' : 'text-gray-300'}
      />
    ));

  return (
    <div className="bg-white rounded-lg shadow mb-5 p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Avis et notations</h2>
          <div className="flex items-center mt-1">
            <div className="flex">{renderStars(Math.round(avg))}</div>
            <span className="ml-2 text-gray-600">{avg.toFixed(1)}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">{reviews.length} avis</span>
          </div>
        </div>
        {isEditing && (
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full flex items-center">
              <Plus size={18} className="mr-1" /> Ajouter
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Pencil size={18} />
            </button>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500">Aucun avis pour le moment.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="mb-6 relative">
            {isEditing && (
              <button className="absolute top-0 right-0 p-2 hover:bg-gray-100 rounded-full">
                <Pencil size={18} />
              </button>
            )}
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {review.author.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-medium">{review.author}</p>
                <div className="flex items-center">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <hr className="my-4" />
          </div>
        ))
      )}
    </div>
  );
}