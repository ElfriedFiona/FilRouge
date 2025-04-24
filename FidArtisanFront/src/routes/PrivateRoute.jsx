// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userRole = user?.role;

  // Si aucun token n'est présent, redirige vers la page de connexion
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si des rôles sont spécifiés pour cette route
  if (roles && roles.length > 0) {
    // Vérifie si le rôle de l'utilisateur actuel existe et est inclus dans les rôles autorisés
    if (userRole && roles.includes(userRole)) {
      return children; // L'utilisateur a le rôle requis, autorise l'accès
    } else {
      // L'utilisateur n'a pas le rôle requis, redirige vers une page d'erreur
      return <Navigate to="/unauthorized" />;
    }
  }

  // Si aucun rôle spécifique n'est requis pour cette route, autorise l'accès si le token existe
  return children;
};

export default PrivateRoute;