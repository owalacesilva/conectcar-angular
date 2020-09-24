export class Usuario {
  CPF: string;
  Nome: string;
  Email: string;
  Senha: string;
  ClientId: number;
}

// IUsuario is a clone of Usuario
// with all properties as optional
export interface IUsuario {
  CPF?: string;
  Nome?: string;
  Email?: string;
  Senha?: string;
  ClientId?: number;
}
