import { Component, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { HttpError } from 'app/services/http.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { RecursosService } from 'app/services/recursos.service';
import { LoadingService } from 'app/services/loading.service';
import { ApiResponse } from 'app/models/api-response.model';
import { CustomValidators } from 'app/validators';
import * as store from 'store';

@Component({
  selector: 'app-alterar-senha-nova',
  templateUrl: './alterar-senha-nova.component.html',
  styleUrls: ['./alterar-senha-nova.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AlterarSenhaNovaComponent implements AfterViewInit {
  @ViewChild('passwordInput') passwordInput: ElementRef;
  password = new FormControl('', [Validators.required, CustomValidators.password]);
  passwordType = 'password'
  disabled = true

  constructor(
    private R: RecursosService,
    private router: Router,
    private clienteService: ClienteService,
    private loadingService: LoadingService,
    private httpError: HttpError,
  ) {}

  ngAfterViewInit() {
    this.passwordInput.nativeElement.focus();
  }

  passwordToggle() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
  }

  submit(e?) {
    if (e) {
      e.preventDefault();
    }

    if (this.disabled) {
      return;
    }

    this.loadingService.show();
    this
      .clienteService
      .AtualizaSenha(
        store.get('oldpass'),
        this.password.value,
      )
      .map(data => <ApiResponse>data.json())
      .subscribe(
        (res: ApiResponse) => {
          if (res.Dados && res.Dados.Sucesso) {
            store.remove('oldpass');
            store.set('token', res.Dados.Token);
            this.router.navigate(['/meu-conect/senha-alterada']);
            this.loadingService.destroy();
            return;
          }

          let subtitle = null;
          if (res.Notificacoes && res.Notificacoes.length) {
            subtitle = res.Notificacoes[0];
          }

          this.httpError.run(null, { subtitle });
        },
        err => {
          this.loadingService.destroy();
          this.httpError.run(err);
        }
      );
  }
}
