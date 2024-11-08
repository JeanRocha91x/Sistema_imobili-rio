import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { db } from '../lib/db';

export default function NovoCliente() {
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dataContato = formData.get('dataContato') as string;
    
    try {
      await db.clientes.add({
        nomeCompleto: formData.get('nomeCompleto') as string,
        email: formData.get('email') as string,
        telefone: formData.get('telefone') as string,
        regiao: formData.get('regiao') as 'Norte' | 'Sul',
        tipoDocumento: formData.get('tipoDocumento') as 'Residência' | 'Passaporte',
        valorEntrada: Number(formData.get('valorEntrada')),
        valorImovel: Number(formData.get('valorImovel')),
        dataRegistro: new Date(formData.get('dataRegistro') as string),
        status: 'Em Atendimento',
        observacao: formData.get('observacao') as string,
        primeiraCasa: formData.get('primeiraCasa') === 'true',
        dataContato: dataContato ? new Date(dataContato) : new Date(),
      });
      
      toast.success('Cliente cadastrado com sucesso!');
      navigate('/clientes');
    } catch (error) {
      toast.error('Erro ao cadastrar cliente');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Cadastrar Novo Cliente</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    name="nomeCompleto"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    <input
                      type="tel"
                      name="telefone"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes do Imóvel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Região</label>
                  <select
                    name="regiao"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Norte">Norte</option>
                    <option value="Sul">Sul</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                  <select
                    name="tipoDocumento"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Residência">Residência</option>
                    <option value="Passaporte">Passaporte</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor de Entrada (€)</label>
                  <input
                    type="number"
                    name="valorEntrada"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor do Imóvel (€)</label>
                  <input
                    type="number"
                    name="valorImovel"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Adicionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Registro</label>
                  <input
                    type="date"
                    name="dataRegistro"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Próximo Contato (Opcional)</label>
                  <input
                    type="date"
                    name="dataContato"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primeira Casa?</label>
                  <select
                    name="primeiraCasa"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  name="observacao"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Cadastrar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}