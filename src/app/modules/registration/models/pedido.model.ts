export class Produto {
  Id: number;
  Titulo: string;
  Descricao: string;
  Valor: number;
  Recarga: {
    Codigo: string;
    Valor: number;
  };
  Device: {
    Codigo: string;
    ValorAquisicao: number;
  }
}

export class Endereco {
  EnderecoId?: number;
  CEP: string;
  Logradouro: string;
  Numero: string;
  Complemento?: string;
  Bairro: string;
  TipoEndereco?: string;
  Estado?: string;
  Cidade?: string;
  NomeCidade?: string;
  IBGE?: string;
  CodigoIBGE?: string;
  ClienteId?: number;
  Tipo?: string;
  Sigla?: string;
}

export class Cliente {
  Id?: any;
  ClienteId?: any;

  CPF?: string;
  NomeCompleto: string;
  Email: string;
  Celular: string;
  DataDeNascimento: string;
  NomeDaMae?: string;

  DDD?: string;
  DddCelular?: string;
  Enderecos?: any;
}

export class Usuario {
  Id: string;
  CPF: string;
  Senha: string;
}

export class FormaDeEnvio {
  OperadorId?: number;
  ValorDoFrete?: number;
  PrazoDeEntrega?: number;
  EhAgendado: boolean;
  Agendamento?: {
    Id?: number;
    DataDeEntrega: string;
    PeriodoDeEntrega: string;
  }
}

export class CartaoDeCredito {
  Numero: string;
  Nome: string;
  MesDeVencimento: number;
  AnoDeVencimento: number;
  CVV: string;
  Bandeira: string;
  BinCartao: string;
}

export class Pagamento {
  Tipo: string;
  CartaoDeCredito?: CartaoDeCredito;
  TokenCartao?: string;
}

export class Veiculo  {
  Id: number;
  Placa: string;
  Categoria: {
    Id: number;
    Nome?: string;
    Rodagem?: string;
    Eixos?: number;
    TipoVeiculo?: string;
  }
}

export class TipoConta {
  Codigo: string;
}

export class Pedido {
  Id?: number;
  IdPedidoSession?: number;
  Produtos?: Produto[];
  Produto?: Produto;
  Enderecos?: Endereco[];
  Cliente?: Cliente;
  Usuario?: Usuario;
  FormaDeEnvio?: FormaDeEnvio;
  Pagamento?: Pagamento;
  Veiculos?: Veiculo[];
  DeviceFingerPrint?: string;
  TipoConta?: TipoConta;
  CodigoCupom?: string;
}
