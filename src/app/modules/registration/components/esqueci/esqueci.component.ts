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
import { AuthenticationService } from 'app/modules/registration/services/authentication.service';
import { RegistrationComponent } from 'app/modules/registration/registration.component';
import { ApiResponse } from 'app/models/api-response.model';
import { RecursosService } from 'app/services/recursos.service';
import { FeatureToggleService } from 'app/services/featureToggle.service';

import * as store from 'store';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci.component.html',
  styleUrls: ['./esqueci.component.less']
})
export class EsqueciSenhaComponent implements AfterViewInit {
  @ViewChild('emailInput') emailInput: ElementRef;
  email = new FormControl('', [Validators.required, Validators.email]);
  cpf = store.get('CPF');
  disabled = true;
  sent = false;
  token: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private clienteService: ClienteService,
    private pedidoService: PedidoService,
    private authenticationService: AuthenticationService,
    private registration: RegistrationComponent,
    private ft: FeatureToggleService,
    private R: RecursosService,
  ) {
    if (ft.Check('Login', 'RecuperacaoDeSenhaEmail')) {
      return;
    }

    this.registration.visible = false;
    this.registration.full = true;

    if (this.email.value && this.email.valid) {
      this.disabled = false;
    }
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
  };

  submit(e?) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.loadingService.show();
    this.authenticationService.SalvarFormaRecebimentoSenha()
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          this.token = Dados;
          this.sent = true;
        },
        err => null,
        () => this.loadingService.destroy(),
      )
  }

  ngAfterViewInit() {
    this.emailInput.nativeElement.focus();
  }
}
