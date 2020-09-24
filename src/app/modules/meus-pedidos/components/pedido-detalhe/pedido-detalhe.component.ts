import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RecursosService } from 'app/services/recursos.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';

import { PedidoService } from 'app/services/pedido.service';
import { ApiResponse } from 'app/models/api-response.model';
import { ModalPoliticaEntregaComponent } from '../modal-politica-entrega/modal-politica-entrega.component';
import * as store from 'store';

@Component({
  selector: 'app-pedido-detalhe',
  templateUrl: './pedido-detalhe.component.html',
  styleUrls: ['./pedido-detalhe.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PedidoDetalheComponent implements AfterViewInit{
  private id;
  private pedido;
  private pedidos = [];
  private enderecos: any = { cobranca: {}, entrega: {} };
  private cartaoCredito: any = {};
  private finalCredito: any;
  private status: string;

  private error = false;

  private steps = [
    { label: 'Pedido', done: false },
    { label: 'Pagamento', done: false },
    { label: 'Entrega', done: false },
    { label: 'Recebimento', done: false },
  ]

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: PedidoService,
    private modalService: NgbModal,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService

  ) {
    this.id = String(this.activatedRoute.snapshot.params.id);
    this.pedidos = store.get('clientePedidos') || [];
    this.getPedidos();
  }

  ngAfterViewInit() {
    this.gtmService.sendPageView('area-logada/status-pedido/' + this.id);
  }

  getPedido() {
    if (this.pedidos.length > 0) {
      this.pedido = this.pedidos.find(pedido =>
        String(pedido.NumeroPedido).toLowerCase().indexOf(this.id) > -1);

      if (!this.pedido || !this.pedido.Status) {
        return;
      }

      this.status = 'Esperando aprovação';
      switch (this.pedido.Status) {
        case 'SaiuParaEntrega':
          this.status = 'Saiu para entrega';
          break;
        case 'PedidoRealizado':
          this.status = 'Pedido realizado';
          break;
        case 'PagamentoAprovado':
          this.status = 'Pagamento aprovado';
          break;
        case 'Entregue':
          this.status = 'Entregue';
          break;
        case 'EsperandoAprovacao':
          this.status = 'Esperando aprovação';
          break;
      }

      this.enderecos = {
        entrega:  this.pedido.Enderecos.find(e => e && e.Tipo === 'Entrega'),
        cobranca: this.pedido.Enderecos.find(e => e && e.Tipo === 'Cobranca'),
      };

      this.cartaoCredito = this.pedido.Pagamento.CartaoDeCredito;

      this.finalCredito = this.cartaoCredito.Numero.split(' ');
      this.finalCredito = this.finalCredito[this.finalCredito.length - 1];

      let doneAt = -1;
      this.steps.forEach((step, i) => {
        if (step.label.toLowerCase() === String(this.pedido.Status).toLowerCase() ||
          (step.label === 'Pedido' && this.pedido.Status === 'PedidoRealizado') ||
          (step.label === 'Pedido' && this.pedido.Status === 'PagamentoAprovado') ||
          (step.label === 'Entrega' && this.pedido.Status === 'SaiuParaEntrega') ||
          (step.label === 'Recebimento' && this.pedido.Status === 'Entregue')) {
          doneAt = i;
        }
      });

      this.steps.forEach((step, i) => {
        if (i <= doneAt) {
          step.done = true;
        }
      });
    }
  }

  getPedidos() {
    this.getPedido();
    this.orderService.Lista()
      .map(a => a.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          store.set('clientePedidos', Dados);
          this.pedidos = Dados;
          this.getPedido();
        })
  }

  openModal(a) {
    this.modalService.open(a, {
      windowClass: 'modal-expandido modal-como-funciona',
      size: 'lg'
    });
  }

  comprar() {
    this.pedido.failedPreviously = true;
    store.set('pedido', this.pedido);
    this.router.navigate(['/comprar/pagamento']);
  }
}
