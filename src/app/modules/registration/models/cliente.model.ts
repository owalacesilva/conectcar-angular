export class Cliente {
  Id?: any;
  ClienteId?: any;

  CPF?: string;
  NomeCompleto: string;
  Email: string;
  DDD?: string;
  DddCelular: string;
  Celular: string;
  DataDeNascimento: string;
  ReceberOfertas?: boolean; // cliente
  Senha?: string; // helper for usuario
  Enderecos?: any;
  NomeDaMae?: string;
}

// ICliente is a clone of Cliente
// with all properties as optional
export interface ICliente {
  ClienteId?: any;
  Id?: any;
  CPF?: string;
  NomeCompleto?: string;
  Email?: string;
  DDD?: string;
  DddCelular?: string;
  Celular?: string;
  DataDeNascimento?: string;
  Senha?: string;
  ReceberOfertas?: boolean; // cliente
}
