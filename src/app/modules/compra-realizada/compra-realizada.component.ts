import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { RecursosService } from 'app/services/recursos.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';
import * as store from 'store';

@Component({
  selector: 'app-compra-realizada',
  templateUrl: './compra-realizada.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./compra-realizada.component.less']
})
export class CompraRealizadaComponent implements AfterViewInit {
  private temAgendamento: boolean;
  private numeroDoPedido: number;
  private dataDeEntrega: string;
  private periodo: string;

  constructor(private R: RecursosService, private gtmService: GoogleTagManagerService) {
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

  ngAfterViewInit() {
  	this.gtmService.sendPageView('compra/compra-finalizada');
  	this.gtmService.emitEvent('compra-pedido-finalizado', 'click-acompanhar-pedido');
  }
}
