import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Calendar, Phone, Mail, AlertCircle } from 'lucide-react';
import { db } from '../lib/db';
import { format, isTomorrow, isToday, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProximosContatos() {
  const clientes = useLiveQuery(() => 
    db.clientes
      .where('dataContato')
      .above(new Date())
      .toArray()
      .then(clients => 
        clients.sort((a, b) => 
          new Date(a.dataContato).getTime() - new Date(b.dataContato).getTime()
        )
      )
  );

  const getStatusColor = (date: Date) => {
    if (isToday(date)) return 'bg-red-100 text-red-800 border-red-200';
    if (isTomorrow(date)) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getStatusText = (date: Date) => {
    if (isToday(date)) return 'Hoje';
    if (isTomorrow(date)) return 'Amanhã';
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Próximos Contatos</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clientes?.map((cliente) => (
          <div
            key={cliente.id}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {cliente.nomeCompleto}
                </h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Mail className="w-4 h-4 mr-2" />
                  {cliente.email}
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Phone className="w-4 h-4 mr-2" />
                  {cliente.telefone}
                </div>
              </div>
              {isTomorrow(new Date(cliente.dataContato)) && (
                <div className="flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">Data do Contato</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getStatusColor(new Date(cliente.dataContato))
                  }`}
                >
                  {getStatusText(new Date(cliente.dataContato))}
                </span>
              </div>
            </div>
          </div>
        ))}

        {clientes?.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Sem contatos próximos</h3>
            <p className="mt-1 text-sm text-gray-500">
              Não há contatos agendados para os próximos dias.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}