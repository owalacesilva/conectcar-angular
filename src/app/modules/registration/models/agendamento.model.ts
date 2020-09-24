export class OperadorAgendamentos {
  Data: string;
  Periodos: string[];
}

export class Operador {
  Id?: number;
  OperadorId: number;
  PrazoDeEntrega: number;
  ValorDoFrete: number;
  EhAgendado: boolean;
  Agendamento?: {
    Id?: number;
    DataDeEntrega: string;
    PeriodoDeEntrega: string;
  };
  Agendamentos?: OperadorAgendamentos[];
}

export class Agendamento {
  OperadorId: number;
  Periodo: string;
  Data: string;
  Operador?: Operador;
}

export class Operadores {
  Operadores: Operador[];
}
