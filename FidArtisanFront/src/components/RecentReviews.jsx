import React from 'react'
import { FaStar } from 'react-icons/fa';

function RecentReviews() {
    const reviewers = [
      { name: "Jane Cooper", image: "https://i.pravatar.cc/100?img=1" },
      { name: "Cameron Williamson", image: "https://i.pravatar.cc/100?img=2" },
      { name: "Leslie Alexander", image: "https://i.pravatar.cc/100?img=3" },
    ];
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-blue-600 mb-4">Les Avis Récents</h3>
        <div className="flex justify-around items-center">
          {reviewers.map((user, idx) => (
            <div key={idx} className="text-center">
              <img
                src={user.image}
                alt={user.name}
                className="w-16 h-16 rounded-full mx-auto mb-2"
              />
              <div className="flex justify-center text-blue-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="font-semibold">{user.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

export default RecentReviews