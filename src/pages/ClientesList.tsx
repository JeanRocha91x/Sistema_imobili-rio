import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Calendar, Download, FileText, Mail, MessageCircle, Pencil, StickyNote, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { db } from '../lib/db';
import Modal from '../components/Modal';
import EditClienteForm from '../components/EditClienteForm';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ClientesList() {
  const [editingCliente, setEditingCliente] = useState(null);
  const clientes = useLiveQuery(() => db.clientes.toArray());

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await db.clientes.delete(id);
        toast.success('Cliente excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir cliente');
      }
    }
  };

  const handleWhatsApp = (telefone: string) => {
    // Remove non-numeric characters and ensure it starts with country code
    const formattedNumber = telefone.replace(/\D/g, '');
    const whatsappNumber = formattedNumber.startsWith('351') ? formattedNumber : `351${formattedNumber}`;
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const exportToExcel = () => {
    if (!clientes?.length) return;

    const worksheet = XLSX.utils.json_to_sheet(
      clientes.map(cliente => ({
        'Nome Completo': cliente.nomeCompleto,
        'Email': cliente.email,
        'Telefone': cliente.telefone,
        'Região': cliente.regiao,
        'Status': cliente.status,
        'Valor Entrada': cliente.valorEntrada,
        'Valor Imóvel': cliente.valorImovel,
        'Data Registro': new Date(cliente.dataRegistro).toLocaleDateString(),
        'Observação': cliente.observacao
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
    XLSX.writeFile(workbook, 'clientes.xlsx');
  };

  const exportToPDF = () => {
    if (!clientes?.length) return;

    const doc = new jsPDF();
    
    doc.text('Lista de Clientes', 14, 15);
    
    autoTable(doc, {
      head: [['Nome', 'Email', 'Telefone', 'Região', 'Status', 'Valor Imóvel', 'Data Registro', 'Observação']],
      body: clientes.map(cliente => [
        cliente.nomeCompleto,
        cliente.email,
        cliente.telefone,
        cliente.regiao,
        cliente.status,
        `€${cliente.valorImovel.toLocaleString()}`,
        new Date(cliente.dataRegistro).toLocaleDateString(),
        cliente.observacao
      ]),
      startY: 20
    });

    doc.save('clientes.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Lista de Clientes</h2>
        <div className="flex gap-4">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <FileText className="w-4 h-4" />
            Exportar Excel
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observação
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes?.map((cliente) => (
                <tr key={cliente.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {cliente.nomeCompleto}
                      </div>
                      <div className="text-sm text-gray-500">{cliente.email}</div>
                      <div className="text-sm text-gray-500">{cliente.telefone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(cliente.dataRegistro).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEmail(cliente.email)}
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                        title="Enviar Email"
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleWhatsApp(cliente.telefone)}
                        className="text-gray-600 hover:text-green-600 transition-colors"
                        title="Enviar WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        {
                          'Em Atendimento': 'bg-yellow-100 text-yellow-800',
                          'A Enviar': 'bg-blue-100 text-blue-800',
                          'Em Analise': 'bg-purple-100 text-purple-800',
                          'Aprovado': 'bg-green-100 text-green-800',
                          'Financiado': 'bg-indigo-100 text-indigo-800'
                        }[cliente.status]
                      }
                    `}>
                      {cliente.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>Entrada: €{cliente.valorEntrada.toLocaleString()}</div>
                      <div>Imóvel: €{cliente.valorImovel.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start max-w-xs">
                      <StickyNote className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 truncate">
                        {cliente.observacao || 'Sem observações'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => setEditingCliente(cliente)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cliente.id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!editingCliente}
        onClose={() => setEditingCliente(null)}
        title="Editar Cliente"
      >
        {editingCliente && (
          <EditClienteForm
            cliente={editingCliente}
            onClose={() => setEditingCliente(null)}
          />
        )}
      </Modal>
    </div>
  );
}