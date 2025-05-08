import React from 'react';

const UserTable = ({ users, handleChangeStatus }) => {
    return (
        <div className="rounded-md border">
            <div className="p-6">
                <table className="w-full">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:first-child]:pl-0 [&:last-child]:pr-0">Nom</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:first-child]:pl-0 [&:last-child]:pr-0">Role</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:first-child]:pl-0 [&:last-child]:pr-0">Email</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:first-child]:pl-0 [&:last-child]:pr-0">Status</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:first-child]:pl-0 [&:last-child]:pr-0">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr]:border-b">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="p-4 align-middle font-medium [&:first-child]:pl-0 [&:last-child]:pr-0">{user.name}</td>
                                <td className="p-4 align-middle [&:first-child]:pl-0 [&:last-child]:pr-0">{user.role}</td>
                                <td className="p-4 align-middle [&:first-child]:pl-0 [&:last-child]:pr-0">{user.email}</td>
                                <td className="p-4 align-middle [&:first-child]:pl-0 [&:last-child]:pr-0">
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${user.etat === 'actif' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                                        {user.etat}
                                    </span>
                                </td>
                                <td className="p-4 align-middle [&:first-child]:pl-0 [&:last-child]:pr-0">
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => handleChangeStatus(user.id, user.etat === 'actif' ? 'inactif' : 'actif')}
                                            className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 
                                            ${user.etat === 'actif' 
                                                ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                                : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                                        >
                                            {user.etat === 'actif' ? 'Désactiver' : 'Activer'}
                                        </button>
                                        <button 
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
                                        >
                                            Voir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;