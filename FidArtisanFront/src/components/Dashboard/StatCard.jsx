import React from 'react';
import { ArrowRight } from 'lucide-react';

const StatCard = ({ title, value, icon }) => {
    return (
        <div className="rounded-md bg-blue-500 text-white p-6">
            <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium uppercase">{title}</h3>
                {icon && icon}
            </div>
            <div className="text-2xl font-bold">{value}</div>
            <button className="inline-flex items-center text-sm font-medium text-blue-100 hover:underline mt-2">
                Plus d'infos <ArrowRight className="ml-1 h-4 w-4" />
            </button>
        </div>
    );
};

export default StatCard;