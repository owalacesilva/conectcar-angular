import { Component, AfterViewInit, OnInit, ViewEncapsulation } from '@angular/core';
import { RecursosService } from 'app/services/recursos.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { LoadingService } from 'app/services/loading.service';
import { RegistrationComponent } from './../../registration.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import { ApiResponse } from 'app/models/api-response.model';
import * as store from 'store';

@Component({
  selector: 'app-registration-chamada-ativacao',
  templateUrl: './chamada-ativacao.component.html',
  styleUrls: ['./chamada-ativacao.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ChamadaAtivacaoComponent implements OnInit {
  private isLogin = false;
  private countLabel = '0 adesivos';
  private count = 0;
  private path = '';

  /**
   * [constructor description]
   *
   * @param {RecursosService} private R [description]
   */
  constructor(
    private loadingService: LoadingService,
    private R: RecursosService,
    private registration: RegistrationComponent,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private routesFlow: RoutesFlowService,
  ) {
    this.route.url.subscribe(url => {
      this.path                 = url[0].path;
      this.isLogin              = this.path === 'login'
      this.registration.visible = !this.isLogin;
    });
  }

  setData(data = store.get('cliente') || {}) {
    this.loadingService.destroy();

    if (!data.Tags || data.Tags.length === 0) {
      return;
    }

    const tags = data.Tags.filter(tag => tag.Status === 'Pendente')
    this.count = tags.length;
    this.countLabel = tags.length > 1 ? `${tags.length} adesivos` : '1 adesivo';
  }

  ngOnInit() {
    if (this.isLogin) {
      this.registration.bgcontent  = 'image7';
      this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_bem_vindo_de_volta') + "</h1><p>" + this.R.R('sidebar_desc_acesse_seu_extrato_simplificado') + "</p>";
    } else {
      this.registration.bgcontent  = 'image5';
      this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_seja_bem_vindo_conectcar') + "</h1><p>" + this.R.R('sidebar_desc_em_alguns_passos') + "</p>";
    }

    const cli = store.get('cliente') || {};
    this.setData();

    this
      .clienteService
      .PorCpf(cli.CPF || store.get('cpf'))
      .map(data => <ApiResponse>data.json())
      .subscribe(({ Dados }: ApiResponse) =>
        this.setData(Dados))
  }
}
