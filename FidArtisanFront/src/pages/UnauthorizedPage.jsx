import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-24 w-auto"
            src="https://img.icons8.com/fluency/96/000000/do-not-enter.png" // Remplace par ta propre icône/image
            alt="Non autorisé"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Accès Non Autorisé
          </h2>
          <p className="mt-2 text-center text-md text-gray-600">
            Vous n'avez pas la permission d'accéder à cette page.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <Link
            to="/"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;