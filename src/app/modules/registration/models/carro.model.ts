export class Tag {
  TagId: number;
  Status: string;
  Numero: string;
}

export class Categoria {
  Id?: number;
  CategoriaVeiculoId?: number;
  Nome: string;
  Rodagem: string[];
  Eixos: number;
  TipoVeiculo: string;
}

export class Carro {
  Id?: string;
  UsuarioId: string;
  Placa: string;
  Categoria: Categoria;
  Marca: string;
  Modelo: string;
  Ano: number;
  Tag?: Tag;

  // helper
  MesmoUsuario?: boolean
}
