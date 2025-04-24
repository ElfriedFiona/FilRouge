import React from 'react';
import { Pencil, Calendar, Clock } from 'lucide-react';

export function OrdersSection({ isEditing }) {
  const orders = [{
    orderNumber: 'CMD-2023-001',
    artisan: 'Samuel Mbarga',
    service: 'Fabrication de Meubles sur Mesure',
    status: 'En cours',
    date: '15 Nov 2023',
    price: '250 000 FCFA',
    progress: 70
  }, {
    orderNumber: 'CMD-2023-002',
    artisan: 'Marie Ekomo',
    service: 'Rénovation de Table',
    status: 'Terminé',
    date: '2 Oct 2023',
    price: '75 000 FCFA',
    progress: 100
  }];

  return (
    <div className="bg-white rounded-lg shadow mb-5 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Mes Commandes</h2>
      </div>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <h3 className="font-semibold">{order.service}</h3>
                  <span className={`ml-3 px-2 py-1 text-xs rounded-full ${order.status === 'En cours' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Par {order.artisan}
                </p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar size={14} className="mr-1" />
                  <span>{order.date}</span>
                  <span className="mx-2">•</span>
                  <span>{order.orderNumber}</span>
                </div>
              </div>
              <span className="font-medium text-blue-600">{order.price}</span>
            </div>
            {order.status === 'En cours' && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progression</span>
                  <span className="text-gray-600">{order.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                    style={{
                      width: `${order.progress}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}