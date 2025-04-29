import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; 
import { toast } from "react-toastify";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";

const AuthForm = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "client", // valeur par défaut
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  
  const navigate = useNavigate();
 
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", form);
      toast.success("Inscription réussie. Vérifiez votre email.");
  
      // On repasse à l'état de connexion 
      setIsActive(false); 
    } catch (err) {
      console.error("Erreur inscription:", err.response);
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        "Erreur lors de l'inscription"
      );
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", loginForm);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      const { token, user } = res.data;
  
      // Stocker le token
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // optionnel
  
      toast.success("Connexion réussie !");
      
      // Redirection selon le rôle
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "client") {
        navigate("/client");
      } else {
        navigate(`/artisandash/${user.artisan.id}`);
      }
    } catch (err) {
      console.error("Erreur login:", err.response);
      toast.error(
        err.response?.data?.message ||
        "Identifiants incorrects ou problème serveur"
      );
    }
  };
  

  return (
   
    <>
    
    <div className="min-h-screen flex items-center justify-center bg-white font-['Montserrat']">
      <div
        className={`relative overflow-hidden w-full max-w-[768px] min-h-[480px] bg-white rounded-xl shadow-[0_8px_24px_rgba(0,32,63,0.45),0_8px_8px_rgba(0,32,63,0.45)] transition-all duration-500`}
      >
        {/* Formulaire inscription */}
        {(!isMobile || isActive) && (
          <div
            className={`absolute top-0 h-full w-full md:w-1/2 transition-all duration-500 ${
              isActive
                ? isMobile
                  ? "z-50"
                  : "translate-x-0 md:translate-x-full opacity-100 z-50 animate-fadeIn"
                : isMobile
                ? "hidden"
                : "opacity-0 z-10 translate-x-full"
            }`}
          >
            <form onSubmit={handleRegister} className="bg-white h-full flex flex-col justify-center items-center px-6 sm:px-8 text-center">
              <h1 className="text-xl sm:text-2xl font-bold mb-2 text-[#00203f]">Créer Un Compte</h1>
              <div className="flex gap-2 my-2">
                <SocialIcon icon={<FaFacebookF />} />
                <SocialIcon icon={<FaGooglePlusG />} />
                <SocialIcon icon={<FaLinkedinIn />} />
              </div>
              <Input name="name" placeholder="Nom" value={form.name} onChange={handleChange} />
      <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <Input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} />
      <Input name="password_confirmation" type="password" placeholder="Confirmer Mot de passe" value={form.password_confirmation} onChange={handleChange} />
              {/* Sélection rôle */}
      <div className="flex gap-4 my-2 text-sm text-[#00203f]">
        <label>
          <input
            type="radio"
            name="role"
            value="client"
            checked={form.role === "client"}
            onChange={handleChange}
            className="mr-1"
          />
          Client
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="artisan"
            checked={form.role === "artisan"}
            onChange={handleChange}
            className="mr-1"
          />
          Artisan
        </label>
      </div>
              <AuthButton>Créer le Compte</AuthButton>
              <p className="text-sm mt-4 md:hidden">
                Déjà un compte ?{" "}
                <button
                  type="button"
                  className="text-[#00203f] underline font-semibold"
                  onClick={() => setIsActive(false)}
                >
                  Se connecter
                </button>
              </p>
            </form>
          </div>
        )}

        {/* Formulaire connexion */}
        {(!isMobile || !isActive) && (
          <div
            className={`absolute top-0 h-full w-full md:w-1/2 transition-all duration-500 ${
              isActive
                ? isMobile
                  ? "hidden"
                  : "translate-x-full"
                : isMobile
                ? "z-50"
                : "translate-x-0 z-50"
            }`}
          >
            <form  onSubmit={handleLogin} className="bg-white h-full flex flex-col justify-center items-center px-6 sm:px-8 text-center">
              <h1 className="text-xl sm:text-2xl font-bold mb-2 text-[#00203f]">Se Connecter</h1>
              <span className="text-sm">Continuer avec</span>
              <div className="flex gap-2 my-2">
                <SocialIcon icon={<FaFacebookF />} />
                <SocialIcon icon={<FaGooglePlusG />} />
                <SocialIcon icon={<FaLinkedinIn />} />
              </div>
              <Input
    name="email"
    type="email"
    placeholder="Email"
    value={loginForm.email}
    onChange={handleLoginChange}
  />
  <Input
    name="password"
    type="password"
    placeholder="Mot de passe"
    value={loginForm.password}
    onChange={handleLoginChange}
  />
              <AuthButton>Se connecter</AuthButton>
              <p className="text-sm mt-4 md:hidden">
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  className="text-[#00203f] underline font-semibold"
                  onClick={() => setIsActive(true)}
                >
                  Créer un compte
                </button>
              </p>
            </form>
          </div>
        )}

        {/* Overlay desktop */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden z-40 transition-transform duration-500 hidden md:block ${
            isActive ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <div
            className={`bg-[#adf0d1] text-[#00203f] absolute left-[-100%] h-full w-[200%] flex transition-transform duration-500 ${
              isActive ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            <div className="w-1/2 flex flex-col justify-center items-center px-6 text-center">
              <h1 className="text-lg sm:text-xl font-bold">Déjà un compte ?</h1>
              <p className="text-sm leading-5 tracking-wider my-4">
                Connecte-toi pour accéder à ton espace personnel.
              </p>
              <AuthButton ghost onClick={() => setIsActive(false)}>
                Se Connecter
              </AuthButton>
            </div>
            <div className="w-1/2 flex flex-col justify-center items-center px-6 text-center">
              <h1 className="text-lg sm:text-xl font-bold">Nouveau ici ?</h1>
              <p className="text-sm leading-5 tracking-wider my-4">
                Crée un compte pour profiter de tous les services.
              </p>
              <AuthButton ghost onClick={() => setIsActive(true)}>
                Créer Un Compte
              </AuthButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

// Composants réutilisables
const SocialIcon = ({ icon }) => (
  <a
    href="#"
    className="flex justify-center items-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#adf0d1] border border-[#00203f73] text-[#00203f] text-sm"
  >
    {icon}
  </a>
);

const Input = ({ name, type = "text", placeholder, value, onChange }) => (
  <input
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="bg-[#adf0d1] text-[#00203f] border-none px-3 py-2 my-1 w-full max-w-xs rounded-md text-sm"
    required
  />
);

const AuthButton = ({ children, ghost = false, ...props }) => (
  <button
    {...props}
    className={`font-semibold py-2 px-4 mt-3 rounded-full text-sm transition duration-200 active:scale-95 ${
      ghost
        ? "bg-transparent border border-[#00203f] text-[#00203f] hover:bg-[#00203f] hover:text-[#adf0d1]"
        : "bg-[#adf0d1] text-[#00203f] border border-[#00203f73] hover:bg-[#00203f] hover:text-[#adf0d1]"
    }`}
  >
    {children}
  </button>
);

export default AuthForm;
