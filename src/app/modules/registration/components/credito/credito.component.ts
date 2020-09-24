import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PedidoService } from 'app/services/pedido.service';
import { ModalComoFuncionaComponent } from 'app/components/modal-como-funciona/modal-como-funciona.component';
import { ElementRef, ViewChild } from '@angular/core';
import { RecursosService } from 'app/services/recursos.service';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';
import * as store from 'store';

@Component({
  selector: 'app-registration-credit',
  templateUrl: './credito.component.html',
  styleUrls: ['./credito.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [ NgbModal ]
})
export class CreditoComponent implements AfterViewInit {
  /**
   * Referenci do Object Modal
   */
  private modalRef: NgbModalRef;
  private pedido = null;
  public selected = 'CR100';
  public amounts = [];

  constructor(
    private pedidoService: PedidoService,
    private router: Router,
    private _modalService: NgbModal,
    private routesFlow: RoutesFlowService,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService
  ) {
    this.pedido = store.get('planoSelecionado') || {};
    this.amounts = this.pedido.Recargas;
  }

  ngAfterViewInit() {
    document.body.classList.remove('inputActive');
    this.gtmService.sendPageView('compra/credito-automatico');
  }

  submit(e) {
    store.set('creditoSelecionado', this.selected);
    const amount = this.amounts.find(a => a.Codigo === this.selected);
    const Produto: any = {
      Id: this.pedido.Id,
      Titulo: this.pedido.Titulo,
      Descricao: this.pedido.Descricao,
      Valor: this.pedido.Mensalidade,
      Device: this.pedido.Device,

      // default values
      Recarga: {
        Codigo: amount.Codigo,
        Valor: amount.ValorAquisicao,
      }
    }

    if (this.pedido.Campanha && this.pedido.Campanha.CodigoCampanha) {
      Produto.CodigoCampanha = this.pedido.Campanha.CodigoCampanha;
    }

    const Cliente: any = store.get('cliente');
    if (!Cliente.Id) {
      Cliente.Id = store.get('clienteId');
    }

    const data: any = {
      Produto,
      Cliente,
      DiasVencimento: this.pedido.DiasVencimento[0],
    }

    this.gtmService.emitEvent('compra-credito-automatico', 'click-valor-sugerido');

    this.pedidoService.Atualiza(data);
    this.routesFlow.go();
  }

  openModalComoFuncionam(): void {
    this.modalRef = this._modalService.open(ModalComoFuncionaComponent, {
      windowClass: 'modal-expandido modal-como-funciona',
      size: 'lg'
    });
  }
}
