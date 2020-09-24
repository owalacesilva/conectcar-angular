import { Component, ViewEncapsulation } from '@angular/core';
import { RecursosService } from 'app/services/recursos.service';
import * as store from 'store';

@Component({
  selector: 'app-ativacao-realizada',
  templateUrl: './ativacao-realizada.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./ativacao-realizada.component.less']
})
export class AtivacaoRealizadaComponent {
  private temAgendamento: boolean;
  private numeroDoPedido: number;
  private dataDeEntrega: string;
  private periodo: string;

  constructor(private R: RecursosService) {
    store.remove('pedidoEnviado');
    this.numeroDoPedido = store.get('numeroPedido');
    const pedido = store.get('pedido') || {};
    const envio = pedido.FormaDeEnvio;

    if (envio) {
      this.temAgendamento = envio.EhAgendado || false;

      if (this.temAgendamento) {
        this.periodo = envio.Agendamento.PeriodoDeEntrega;
        this.dataDeEntrega = envio.Agendamento.DataDeEntrega;
      }
    }
  }
}
