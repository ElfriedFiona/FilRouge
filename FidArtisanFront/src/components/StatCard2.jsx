import React from 'react'

function StatCard({ title, white }) {
    return (
      <div
        className={`p-6 rounded-lg shadow-md ${
          white ? "bg-white text-blue-600" : "bg-blue-500 text-white"
        }`}
      >
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <button
          className={`mt-2 font-semibold flex items-center gap-2 ${
            white ? "text-blue-600" : "text-white"
          }`}
        >
          Plus d’infos {/* <FaArrowRight /> */}
        </button>
      </div>
    );
  }

export default StatCard