import React from 'react';
import { ArrowRight } from 'lucide-react';

const ListCard = ({ title, users = [] }) => {
    return (
        <div className="rounded-md border">
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <div className="space-y-4">
                    {users.map((user, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative rounded-full overflow-hidden h-9 w-9">
                                    <img src={user.image || "/placeholder-avatar.jpg"} alt={user.name} className="object-cover h-full w-full" />
                                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-600">
                                            {(user.name?.substring(0, 1) || "?").toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-semibold">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.role}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${user.status === 'Active' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                                    {user.status}
                                </span>
                                <button className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline">
                                    Voir Plus <ArrowRight className="ml-1 h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default ListCard;