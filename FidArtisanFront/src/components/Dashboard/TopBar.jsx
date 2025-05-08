import React, { useState } from 'react';
import { User, Search } from 'lucide-react';

const TopBar = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // Ici vous pourriez appeler une fonction pour rechercher des utilisateurs
        console.log(`Recherche pour: ${searchQuery}`);
    };

    return (
        <header className="flex items-center justify-between mb-8">
            {/* User Info */}
            <div className="flex items-center">
                <User className="mr-2 h-8 w-8 text-gray-700" />
                <span className="text-xl font-semibold">Admin</span>
                <span className="text-gray-500 ml-1">fiona</span>
            </div>
            
            {/* Search Bar and Profile */}
            <div className="flex items-center gap-4">
                <form onSubmit={handleSearch} className="flex items-center">
                    <input
                        type="text"
                        placeholder="Rechercher des utilisateurs"
                        className="w-64 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button 
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4"
                    >
                        <Search className="h-5 w-5" />
                    </button>
                </form>
                
                {/* Profile Avatar */}
                <div className="relative rounded-full overflow-hidden h-9 w-9">
                    <img src="/placeholder-avatar.jpg" alt="Admin" className="object-cover h-full w-full" />
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600">F</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;