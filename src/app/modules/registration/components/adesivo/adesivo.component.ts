import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { RegistrationComponent } from './../../registration.component';
import { RecursosService } from 'app/services/recursos.service';
import { DialogService } from 'app/services/dialog.service';
import { LoadingService } from 'app/services/loading.service';
import { AuthenticationService } from 'app/modules/registration/services/authentication.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';

import { Masks } from 'app/masks';
import { ApiResponse } from 'app/models/api-response.model';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import * as localStore from 'store';

@Component({
  selector: 'app-registration-adesivo',
  templateUrl: './adesivo.component.html',
  styleUrls: ['./adesivo.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AdesivoComponent implements OnInit, AfterViewInit {
  @ViewChild('inputAdesivo') inputAdesivo: ElementRef;

  controlAdesivo = new FormControl('', [Validators.required]);
  mask           = [/\d/];

  veiculosTemp: any[];
  veiculo: any = {};

  disabled = true

  /**
   * [constructor description]
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private registration: RegistrationComponent,
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private authenticationService: AuthenticationService,
    private clienteService: ClienteService,
    private routesFlow: RoutesFlowService,
    private R: RecursosService,
  ) {

    this.veiculosTemp = localStore.get('veiculosTemp') || [];
    if (this.veiculosTemp.length ) {
      this.veiculo = this.veiculosTemp[ this.veiculosTemp.length - 1 ];
    }
  }

  ngOnInit() {
    this.registration.bgcontent  = 'image8';
    this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_design_tecnologia') + "</h1><p>" + this.R.R('sidebar_desc_em_alguns_passos') + "</p>";
  }

  ngAfterViewInit() {
    this.inputAdesivo.nativeElement.focus();
  }

  semAdesivo() {
    this.authenticationService.loadLogout();
    this.router.navigate(['/planos']);
  }

  onInput() {
    this.disabled = this.controlAdesivo && this.controlAdesivo.value.trim().length < 1;
  }

  get adesivo(): string {
    return this.controlAdesivo.value;
  }

  onError(err: any, title?: string, retryLabel?: string) {
    let body = null;
    if (err && err.json) {
      try {
        body = <ApiResponse>err.json();
      } catch (e) { console.warn(e); }
    }
    const subtitle = (body && body.Notificacoes && body.Notificacoes.length) ? body.Notificacoes[0] : 'Tente novamente';

    const options: any = { title, subtitle };

    if (err && (err.status === 0 || err.status === 500)) {
      options.title = 'Houve um erro'
      options.retryLabel = retryLabel || this.R.R('alerta_error_cadastro_senha_tente_novamente');
      options.retryAction = () => this.submit();
    }

    this.dialogService.showAlert(options);
    this.loadingService.destroy();
  };

  back(e) {
    e.stopPropagation();
    e.preventDefault();
    history.back();
  }

  submit(e?) {
    if (e) {
      e.preventDefault();
    }

    if (this.disabled) {
      return;
    }

    this.loadingService.show();

    this.veiculo.Adesivo = this.adesivo;

    this.veiculosTemp.find((veiculo) => {
      if (veiculo.Placa === this.veiculo.placa) {
        veiculo.Adesivo = this.veiculo.Adesivo;
      }

      return veiculo;
    });

    localStore.set('veiculosTemp', this.veiculosTemp);

    this
      .clienteService
      .ValidaTagPosto(this.veiculo.Adesivo)
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          this.loadingService.destroy();

          const ativacaoOffline = localStore.get('ativacao-offline');
          if (ativacaoOffline && Dados.Valido) {
            this.routesFlow.go();
            return;
          }

          this.onError(null, 'Placa ou adesivo inválido');
        },
        err => this.onError(err, 'Entendi')
      );
  }
}
