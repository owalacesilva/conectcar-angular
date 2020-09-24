import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Rx';

import { ApiResponse } from 'app/models/api-response.model';
import { DialogService } from 'app/services/dialog.service';
import { LoadingService } from 'app/services/loading.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { RecursosService } from 'app/services/recursos.service';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';
import { CustomValidators } from 'app/validators';
import * as localStore from 'store';

@Component({
  selector: 'app-confirmar-placa-adesivo',
  templateUrl: './confirmar-placa-adesivo.component.html',
  styleUrls: ['./confirmar-placa-adesivo.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmarPlacaAdesivoComponent implements OnInit, AfterViewInit {
  @ViewChild('gnplaca') gnplaca;
  placa = localStore.get('ativacao-online-placa') || '';
  tagId = localStore.get('ativacao-online-tagid') || '';
  adesivo = localStore.get('ativacao-online-adesivo') || '';

  constructor(
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private clienteService: ClienteService,
    private R: RecursosService,
    private router: Router,
    private gtmService: GoogleTagManagerService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const placa = this.placa.split('-');
    console.log(placa, this.gnplaca);
    this.gnplaca.plaque1.setValue(placa[0]);
    this.gnplaca.plaque2.setValue(placa[1]);
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
    }

    this.loadingService.show();

    this.clienteService
      .AtivaTag(
        this.placa,
        this.adesivo,
        this.tagId,
      )
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          this.loadingService.destroy();
          this.gtmService.sendPageView('area-logada/ativacao/confirme-placa-adesivo');

          if (!Dados.Ativa) {
            this.dialogService.showAlert({
              title: 'Houve um problema',
              subtitle: 'Placa ou adesivo inválidos'
            });
            return;
          }

          this.router.navigate(['/meu-conect/ativacao-realizada']);
        },
        (err) => this.onError(err)
      );
  }
}
