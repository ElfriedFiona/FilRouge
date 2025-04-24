import React from 'react';
import { Pencil } from 'lucide-react';

export function ProfileSection({ title, content, isEditing }) {
  return (
    <div className="bg-white rounded-lg shadow mb-5 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {isEditing && (
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Pencil size={18} className="text-gray-500" />
          </button>
        )}
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
    </div>
  );
}