import Header from "./Header2";
import Sidebar from "./Sidebar2";

export default function DashboardLayout({ activeContent, setActiveContent, children }) {
  return (
    <div className="flex min-h-screen pt-16"> {/* pt-16 pour laisser de la place au Header fixé */}
      {/* Sidebar à gauche */}
      <div >
        <Sidebar activeContent={activeContent} setActiveContent={setActiveContent} />
      </div>

      {/* Contenu principal à droite avec marge à gauche pour laisser la place à la sidebar */}
      <main className="ml-64 flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}



