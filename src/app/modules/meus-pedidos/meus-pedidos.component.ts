import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from 'app/services/pedido.service';
import { LoadingService } from 'app/services/loading.service';
import { ApiResponse } from 'app/models/api-response.model';
import { RecursosService } from 'app/services/recursos.service';
import { FeatureToggleService } from 'app/services/featureToggle.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';

import * as store from 'store';

/*  PagamentoAprovado = 1,
    EsperandoAprovacao = 2,
    PedidoRealizado = 3,
    SaiuParaEntrega = 4,
    Entregue = 5, */

@Component({
  selector: 'app-meus-pedidos',
  templateUrl: './meus-pedidos.component.html',
  styleUrls: ['./meus-pedidos.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class MeusPedidosComponent implements AfterViewInit {
  private pedidos: any[] = [];
  private filteredPedidos: any[] = [];

  constructor(
    private loadingService: LoadingService,
    private orderService: PedidoService,
    private router: Router,
    private R: RecursosService,
    private ft: FeatureToggleService,
    private gtmService: GoogleTagManagerService
  ) {
    if (this.ft.Check('Home', 'AcompanhamentoDeEntrega')) {
      return;
    }

    this.pedidos = store.get('clientePedidos') || [];
    this.filteredPedidos = this.pedidos;
    this.loadingService.show();

    this.orderService.Lista()
      .map(a => a.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          this.pedidos = Dados;
          this.filteredPedidos = Dados;
          store.set('clientePedidos', Dados);
        },
        () => this.loadingService.destroy(),
        () => this.loadingService.destroy(),
      )
  }

  ngAfterViewInit() {
    const placeholder = document.querySelector('.placeholder-label');
    placeholder.classList.remove('active');

    this.gtmService.sendPageView('area-logada/meus-pedidos');
  }

  normalizeStatus(status: string): string {
    switch (status) {
      case 'SaiuParaEntrega':
        return 'Saiu para entrega';
      case 'PedidoRealizado':
        return 'Pedido realizado';
      case 'PagamentoAprovado':
        return 'Pagamento aprovado';
      case 'Entregue':
        return 'Entregue';
      default:
        return 'Esperando aprovação';
    }
  }

  onFilter(e) {
    const value = (e.target.value || '').toLowerCase();

    if (value.trim().length === 0) {
      this.filteredPedidos = this.pedidos;
      return;
    }
    this.filteredPedidos = this.pedidos.filter(pedido =>
      String(pedido.NumeroPedido).toLowerCase().indexOf(value) > -1 ||
      String(pedido.Status).toLowerCase().indexOf(value) > -1
    )
  }
}
