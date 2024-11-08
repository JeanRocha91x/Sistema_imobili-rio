import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { db } from '../lib/db';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Dashboard() {
  const clientes = useLiveQuery(() => db.clientes.toArray());
  
  const statusCount = clientes?.reduce((acc, cliente) => {
    acc[cliente.status] = (acc[cliente.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const regiaoCount = clientes?.reduce((acc, cliente) => {
    acc[cliente.regiao] = (acc[cliente.regiao] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyRegistrations = clientes?.reduce((acc, cliente) => {
    const month = new Date(cliente.dataRegistro).toLocaleString('pt-BR', { month: 'long' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCount || {}).map(([name, value]) => ({
    name,
    value
  }));

  const regiaoData = Object.entries(regiaoCount || {}).map(([name, value]) => ({
    name,
    value
  }));

  const monthlyData = Object.entries(monthlyRegistrations || {}).map(([name, value]) => ({
    name,
    value
  }));

  const totalClientes = clientes?.length || 0;
  const totalValorImoveis = clientes?.reduce((acc, cliente) => acc + cliente.valorImovel, 0) || 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Total de Clientes</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">{totalClientes}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Valor Total de Imóveis</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">
            {totalValorImoveis.toLocaleString('pt-PT')}€
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status dos Clientes</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Clientes por Região</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regiaoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Registros Mensais</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}