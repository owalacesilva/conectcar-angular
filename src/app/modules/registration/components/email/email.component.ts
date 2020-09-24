import { Component, AfterViewInit, OnInit, Input } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { RecursosService } from 'app/services/recursos.service';
import { CustomValidators } from 'app/validators';

import { ApiResponse } from 'app/models/api-response.model';

import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { UsuarioService } from 'app/modules/registration/services/usuario.service';
import { PlacaService } from 'app/modules/registration/services/placa.service';
import { PedidoService } from 'app//services/pedido.service';
import { DialogService } from 'app/services/dialog.service';
import { LoadingService } from 'app/services/loading.service';
import { RegistrationComponent } from './../../registration.component';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';

import * as store from 'store';

@Component({
  selector: 'app-registration-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.less']
})
export class EmailComponent implements AfterViewInit, OnInit {
  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('ofertasInput') ofertasInput: ElementRef;

  @Input('bgcontent') bgcontent;

  email = new FormControl('', [CustomValidators.email]);
  ofertas = new FormControl('');

  showValidation = false
  disabled = true
  fromOverview = false

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private plaqueService: PlacaService,
    private registration: RegistrationComponent,
    private routesFlow: RoutesFlowService,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService
  ) {
    this.route.queryParams.subscribe(params => {
      this.fromOverview = params.r === '' || !!params.r;
    });

    const email = this.clienteService.getCache('Email');
    this.disabled = !email.length;
    this.email.setValue(email);
  }

  ngOnInit() {
    this.registration.bgcontent  = 'image4';
    this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_queremos_te_conhecer') + "</h1><p>" + this.R.R('sidebar_desc_queremos_te_conhecer') + "</p>";
  }

  ngAfterViewInit() {
    this.emailInput.nativeElement.focus();
    this.gtmService.sendPageView('compra/email');
    this.gtmService.emitEvent('compra/email', 'click-opt-out');
  }

  back(e) {
    history.back();
    e.stopPropagation();
    e.preventDefault();
  }

  submit(e?) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!this.email.valid) {
      return;
    }

    const ReceberOfertas = (
      this.ofertasInput.nativeElement &&
      this.ofertasInput.nativeElement.checked
    );

    this
      .clienteService
      .AtualizaOuCache({
        Email: this.email.value,
        ReceberOfertas,
      });

    this
      .pedidoService
      .Cria({
        Cliente: this.clienteService.getCache()
      });

    this.routesFlow.go(this.fromOverview);
  }
}
