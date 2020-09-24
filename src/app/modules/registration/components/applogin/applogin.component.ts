import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiResponse } from 'app/models/api-response.model';
import { LoadingService } from 'app/services/loading.service';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { AuthenticationService } from 'app/modules/registration/services/authentication.service';

import * as store from 'store';

@Component({ selector: 'app-applogin', template: '' })
export class AppLoginComponent implements OnInit {
  private token: string;
  private cpf: string;

  constructor(
    private authenticationService: AuthenticationService,
    private clienteService: ClienteService,
    private loadingService: LoadingService,
    private routesFlow: RoutesFlowService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(params => {
      if (!params.token || !params.cpf) {
        return router.navigate(['/planos']);
      }
      this.token = params.token;
      this.cpf = (params.cpf || '').replace(/\D*/g, '');
    });
  }

  onError(err?) {
    this.loadingService.destroy();
    this.router.navigate(['/planos'])
  }

  onReauth(newToken: string) {
    store.set('token', newToken);
    this
      .clienteService
      .PorCpf(this.cpf)
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          store.set('cpf', this.cpf);
          store.set('cliente', Dados);
          store.set('clienteId', Dados.ClienteId)
          store.set('cpf-status', 'login-via-app');
          this.routesFlow.go();
          this.loadingService.destroy();
        },
        err => this.onError(err)
      );
  }

  reauth() {
    this
      .authenticationService
      .RevalidarToken(this.token)
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => this.onReauth(Dados.TokenDeSeguranca),
        err => this.onError(err),
      );
  }

  ngOnInit() {
    this.loadingService.show();
    this.reauth();
  }
}
