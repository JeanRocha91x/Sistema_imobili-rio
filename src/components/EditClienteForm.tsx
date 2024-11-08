import React from 'react';
import { toast } from 'react-hot-toast';
import { db, type Cliente } from '../lib/db';

interface EditClienteFormProps {
  cliente: Cliente;
  onClose: () => void;
}

export default function EditClienteForm({ cliente, onClose }: EditClienteFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await db.clientes.update(cliente.id!, {
        nomeCompleto: formData.get('nomeCompleto') as string,
        email: formData.get('email') as string,
        telefone: formData.get('telefone') as string,
        regiao: formData.get('regiao') as 'Norte' | 'Sul',
        tipoDocumento: formData.get('tipoDocumento') as 'Residência' | 'Passaporte',
        valorEntrada: Number(formData.get('valorEntrada')),
        valorImovel: Number(formData.get('valorImovel')),
        status: formData.get('status') as Cliente['status'],
        observacao: formData.get('observacao') as string,
        primeiraCasa: formData.get('primeiraCasa') === 'true',
        dataContato: formData.get('dataContato') ? new Date(formData.get('dataContato') as string) : cliente.dataContato
      });
      
      toast.success('Cliente atualizado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao atualizar cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            name="nomeCompleto"
            defaultValue={cliente.nomeCompleto}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            defaultValue={cliente.email}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            name="telefone"
            defaultValue={cliente.telefone}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Região
          </label>
          <select
            name="regiao"
            defaultValue={cliente.regiao}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Norte">Norte</option>
            <option value="Sul">Sul</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            defaultValue={cliente.status}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Em Atendimento">Em Atendimento</option>
            <option value="A Enviar">A Enviar</option>
            <option value="Em Analise">Em Analise</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Financiado">Financiado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Documento
          </label>
          <select
            name="tipoDocumento"
            defaultValue={cliente.tipoDocumento}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Residência">Residência</option>
            <option value="Passaporte">Passaporte</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor de Entrada (€)
          </label>
          <input
            type="number"
            name="valorEntrada"
            defaultValue={cliente.valorEntrada}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor do Imóvel (€)
          </label>
          <input
            type="number"
            name="valorImovel"
            defaultValue={cliente.valorImovel}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Próximo Contato
          </label>
          <input
            type="date"
            name="dataContato"
            defaultValue={cliente.dataContato ? new Date(cliente.dataContato).toISOString().split('T')[0] : ''}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primeira Casa?
          </label>
          <select
            name="primeiraCasa"
            defaultValue={cliente.primeiraCasa.toString()}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observações
        </label>
        <textarea
          name="observacao"
          defaultValue={cliente.observacao}
          rows={4}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Salvar Alterações
        </button>
      </div>
    </form>
  );
}