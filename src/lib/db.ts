import Dexie, { type Table } from 'dexie';

export interface Cliente {
  id?: number;
  nomeCompleto: string;
  email: string;
  telefone: string;
  regiao: 'Norte' | 'Sul';
  tipoDocumento: 'Residência' | 'Passaporte';
  valorEntrada: number;
  valorImovel: number;
  dataRegistro: Date;
  status: 'Em Atendimento' | 'A Enviar' | 'Em Analise' | 'Aprovado' | 'Financiado';
  observacao: string;
  primeiraCasa: boolean;
  dataContato: Date;
}

export class ClienteDB extends Dexie {
  clientes!: Table<Cliente>;

  constructor() {
    super('clienteDB');
    this.version(1).stores({
      clientes: '++id, nomeCompleto, telefone, email, status, dataRegistro, dataContato'
    });
  }
}

export const db = new ClienteDB();