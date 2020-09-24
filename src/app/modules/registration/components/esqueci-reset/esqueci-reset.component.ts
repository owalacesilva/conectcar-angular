import { Component, AfterViewInit } from '@angular/core';
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
import { CustomValidators } from 'app/validators';

import * as store from 'store';

@Component({
  selector: 'app-esqueci-senha-reset',
  templateUrl: './esqueci-reset.component.html',
  styleUrls: ['./esqueci-reset.component.less']
})
export class EsqueciSenhaResetComponent implements AfterViewInit {
  @ViewChild('passwordInput') passwordInput: ElementRef;

  password = new FormControl('', [Validators.required, CustomValidators.password]);
  passwordType = 'password'

  cpf = store.get('CPF');
  disabled = true;
  token: string;
  sent: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private clienteService: ClienteService,
    private pedidoService: PedidoService,
    private authenticationService: AuthenticationService,
    private registration: RegistrationComponent,
    private R: RecursosService) {

    this.route.params.subscribe(params => {
      if (!params.token) {
        this.router.navigate(['/esqueci']);
        return;
      }

      this.token = params.token;
    });

    this.registration.visible = false;
    this.registration.full = true;

    if (this.password.value && this.password.valid) {
      this.disabled = false;
    }
  }

  back(e) {
    e.preventDefault();
    e.stopPropagation();
    history.back();
  }

  onError(err: any, title?: string, retryLabel?: string) {
    let body = err;
    if (typeof err.json === 'function') {
      body = <ApiResponse>err.json();
    }
    console.log('->', body);
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
    }

    if (!this.password.valid) {
      return;
    }

    this.loadingService.show();

    this.authenticationService.AlterarSenha(store.get('cpf'), this.token, this.password.value)
      .map(data => <ApiResponse>data.json())
      .subscribe(
        (data: any) => this.onAlterarSenha(data),
        err => this.onError(err),
      )
  }

  onAlterarSenha(data: any) {
    if (!data.Sucesso) {
      return this.onError(data);
    }

    this.loadingService.destroy();
    this.sent = true;
  }

  ngAfterViewInit() {
    this.passwordInput.nativeElement.focus();
  }

  passwordToggle() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
  }
}
