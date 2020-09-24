import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from 'app/services/pedido.service';
import { LoadingService } from 'app/services/loading.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { ApiResponse } from 'app/models/api-response.model';
import { RecursosService } from 'app/services/recursos.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';
import { FeatureToggleService } from 'app/services/featureToggle.service';

import * as store from 'store';

@Component({
  selector: 'app-ativacao',
  templateUrl: './ativacao.component.html',
  styleUrls: ['./ativacao.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AtivacaoComponent implements AfterViewInit {
  private countLabel = '0 adesivos';
  private count = 0;

  constructor(
    private loadingService: LoadingService,
    private orderService: PedidoService,
    private router: Router,
    private clienteService: ClienteService,
    private ft: FeatureToggleService,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService
  ) {
    this.ft.Check('Ativacao', 'ChaveAtivacaoOnline');
  }

  ngAfterViewInit() {
    const cli = store.get('cliente') || {};

    if (!cli.TagsPreLiberacao || cli.TagsPreLiberacao.length === 0) {
      return;
    }

    const tags = cli.TagsPreLiberacao.filter(tag => tag.Status === 'Pendente')
    this.countLabel = tags.length > 1 ? `${tags.length} adesivos` : '1 adesivo';
    this.count = tags.length;

    this.gtmService.sendPageView();
  }
}
