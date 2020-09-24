export class TarifaValor {
  Valor: number;
  Descricao: string;
}

export class Tarifa {
  Codigo: string;
  De: TarifaValor;
  Por: TarifaValor;
}

export class Campanha {
  CodigoCampanha: string;
  CampanhaId: string;
}

export class Recarga {
  Codigo: string;
  ValorMinimo: number[];
  ValorAquisicao: number;
  Padrao: string;
}

export class BandeiraCartao {
  Bandeira: string;
  RegexInstituicao: string;
}

export class FormaDePagamento {
  TipoFormaPagamento: string;
  BandeirasCartoes: BandeiraCartao[];
}

export class Produto {
  Ativacao: boolean;
  Beneficios: string[];
  Campanha: Campanha;
  Descricao: string;
  DiasVencimento: number[];
  FormasDePagamento: FormaDePagamento[];
  Id: string;
  Locais: string[];
  Recargas: Recarga[];
  Tarifas: Tarifa[];
  TipoProduto: string;
  Titulo: string;

  // helpers
  Mensalidade?: number;
  MensalidadePor?: number;
  MensalidadeDesconto?: number;

  MensalidadeSplit?: string[];
  DescontoPorcentagem?: number;
  BeneficiosNormalizado?: string[];
  TarifasNormalizado?: TarifaValor[];
  CreditoAutomatico?: number;
}
