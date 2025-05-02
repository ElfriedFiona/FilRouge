import Header from "./Header2";
import Sidebar from "./Sidebar2";

export default function DashboardLayout({ activeContent, setActiveContent, children }) {
  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar */}
      <Sidebar activeContent={activeContent} setActiveContent={setActiveContent} />

      {/* Contenu principal */}
      <main className="flex-1 p-6 overflow-y-auto md:ml-64"> {/* ml-64 à partir de md */}
        {children}
      </main>
    </div>
  );
}
