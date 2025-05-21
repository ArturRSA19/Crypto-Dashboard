import React from "react";

interface CardProps {
    title: string;
    value: string;
    trend: 'up' | 'down' | 'flat';
  }
  
  export default function DashboardCard({ title, value, trend }: CardProps) {
    const color = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-300';
  
    return (
      <div className="bg-gray-800 p-4 rounded-2xl shadow hover:shadow-lg transition-all">
        <h2 className="text-lg font-semibold mb-1">{title}</h2>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </div>
    );
  }