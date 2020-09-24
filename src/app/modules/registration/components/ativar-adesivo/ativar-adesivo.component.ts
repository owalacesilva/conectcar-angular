import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { DialogService } from 'app/services/dialog.service';
import { LoadingService } from 'app/services/loading.service';
import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { PedidoService } from 'app/services/pedido.service';
import { PlacaService } from 'app/modules/registration/services/placa.service';
import { AuthenticationService } from 'app/modules/registration/services/authentication.service';
import { RegistrationComponent } from './../../registration.component';
import { ApiResponse } from 'app/models/api-response.model';
import { CustomValidators } from 'app/validators';
import { RecursosService } from 'app/services/recursos.service';
import { RoutesFlowService } from 'app/services/routes-flow.service';

import * as store from 'store';

@Component({
  selector: 'app-ativar-adesivo',
  templateUrl: './ativar-adesivo.component.html',
  styleUrls: ['./ativar-adesivo.component.less']
})
export class AtivarAdesivoComponent implements AfterViewInit, OnInit {
  toLogin: boolean;

  @ViewChild('adesivoInput') adesivoInput: ElementRef;

  adesivo = new FormControl('', [Validators.required]);
  placa = store.get('ativar-placa');
  disabled = true

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private clienteService: ClienteService,
    private pedidoService: PedidoService,
    private placaService: PlacaService,
    private authenticationService: AuthenticationService,
    private registration: RegistrationComponent,
    private routesFlow: RoutesFlowService,
    private R: RecursosService,
  ) {
    this.registration.visible = false;
    this.toLogin = this.toLogin || store.get('cpf-status') === 'login';

    if (this.adesivo.value && this.adesivo.valid) {
      this.disabled = false;
    }
  }

  ngOnInit() {
    this.registration.bgcontent  = 'image7';
    this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_bem_vindo_de_volta') + "</h1><p>" + this.R.R('sidebar_desc_acesse_seu_extrato_simplificado') + "</p>";
  }

  back(e) {
    e.preventDefault();
    e.stopPropagation();
    history.back();
  }

  onError(err: any, title?: string, retryLabel?: string) {
    const body = <ApiResponse>err.json();
    const msg = (body && body.Notificacoes && body.Notificacoes.length) ? body.Notificacoes[0] : 'Tente novamente';

    const options: any = {
      title: title || this.R.R('alerta_error_cadastro_senha_titulo'),
      subtitle: msg
    };

    if (err.status === 0 || err.status === 500) {
      options.retryLabel = retryLabel || this.R.R('alerta_error_cadastro_senha_tente_novamente');
      options.retryAction = () => this.submit();
    }

    this.dialogService.showAlert(options);
    this.loadingService.destroy();
  }

  submit(e?) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.loadingService.show();
    store.set('ativar-adesivo', this.adesivo.value);

    return this.clienteService
      .ValidaTagAtiva(
        store.get('ativar-placa'),
        this.adesivo.value,
      )
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          this.loadingService.destroy();
          if (!Dados.Ativo) {
            this.dialogService.showAlert({
              title: 'Houve um problema',
              subtitle: 'Placa ou adesivo inválidos'
            });
            return;
          }

          store.set('clienteId', Dados.ClienteId);
          this.routesFlow.go();
        },
        (err) => this.onError(err)
      );
  }

  ngAfterViewInit() {
    this.adesivoInput.nativeElement.focus();
  }
}
