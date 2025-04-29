// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import {Accueil}  from "./pages/Accueil";
import {Client}  from "./pages/Client";
import Login  from "./pages/AuthPage";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/Admin";
import PrivateRoute from "./routes/PrivateRoute";
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';
import ArtisanList from "./pages/ArtisanList";
import  ArtisanProfile  from "./pages/ProfileArtisan";
import RequestServicePage from "./pages/RequestServicePage";
import ArtisanDashboard from "./pages/Artisan";

function App() {
  return (
<> 
<Toaster position="top-right" />

  <Router>
      <Routes>
        
        <Route path="*" element={<div>Page non trouvée</div>} />

        <Route path="/" element={<Accueil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resultats" element={<ArtisanList/>} />
        <Route path="/artisan/:id" element={<ArtisanProfile/>} />
        <Route path="/serviceclient" element={<RequestServicePage/>} />
        <Route path="artisandash/:id" element={<ArtisanDashboard/>} />
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/client"
          element={
            <PrivateRoute roles={['client']}>
              <Client />
            </PrivateRoute>
          }
        />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="*" element={<NotFoundPage />} />
         
      </Routes>
    </Router>
  <ToastContainer position="top-center" autoClose={5000} />
   </>
  );
}

export default App;
