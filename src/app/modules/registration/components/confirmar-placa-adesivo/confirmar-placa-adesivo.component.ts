import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Rx';

import { ApiResponse } from 'app/models/api-response.model';
import { DialogService } from 'app/services/dialog.service';
import { LoadingService } from 'app/services/loading.service';
import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { PlacaService } from 'app/modules/registration/services/placa.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { Carro, Categoria } from 'app/modules/registration/models/carro.model';
import { RegistrationComponent } from './../../registration.component';
import { RecursosService } from 'app/services/recursos.service';
import { ModalEdicaoVeiculoComponent } from './../modal-edicao-veiculo/modal-edicao-veiculo.component';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import { CustomValidators } from 'app/validators';
import Routes from 'app/configs/routes';
import * as localStore from 'store';

@Component({
  selector: 'app-registration-confirmar-placa-adesivo',
  templateUrl: './confirmar-placa-adesivo.component.html',
  styleUrls: ['./confirmar-placa-adesivo.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmarPlacaAdesivoComponent implements OnInit {
  @ViewChild('adesivoInput') adesivoInput: ElementRef;
  adesivo = new FormControl('', [Validators.required]);

  fromOverview = false
  veiculosTemp: any[]
  veiculo: any = {};
  adicionaMais = false;

  categorias: any[];
  categoriaSelecionada: any;

  /**
   * [constructor description]
   *
   * @param {Router}                private router         [description]
   * @param {ActivatedRoute}        private route          [description]
   * @param {Store<Carro>}          private store          [description]
   * @param {DialogService}         private dialogService  [description]
   * @param {LoadingService}        private loadingService [description]
   * @param {PlacaService}          private plaqueService  [description]
   * @param {RegistrationComponent} private registration   [description]
   * @param {RecursosService}       private R              [description]
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<Carro>,
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private plaqueService: PlacaService,
    private registration: RegistrationComponent,
    private routesFlow: RoutesFlowService,
    private clienteService: ClienteService,
    private R: RecursosService,
  ) {
    this.route.queryParams.subscribe(params => {
      this.fromOverview = params.r === '' || !!params.r;
    });

    this.veiculosTemp = localStore.get('veiculosTemp') || [];
    if (this.veiculosTemp.length) {
      this.veiculo = this.veiculosTemp[ this.veiculosTemp.length - 1 ];
    }
  }

  ngOnInit() {
    const cli = localStore.get('cliente') || {};
    this.adicionaMais = cli.Tags && (cli.Tags.length < this.veiculosTemp.length);
    this.registration.bgcontent  = 'image8';
    this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_design_tecnologia') + "</h1><p>" + this.R.R('sidebar_desc_em_alguns_passos') + "</p>";
    if (this.adesivoInput && this.adesivoInput.nativeElement) {
      this.adesivoInput.nativeElement.focus();
    }
  }

  back(e) {
    e.preventDefault();
    e.stopPropagation();
    history.back();
  }

  ativarMais(e) {
    e.preventDefault();
    this.routesFlow.go(false, Routes.ativarPlacaEixo);
  }

  submit(e) {
    e.preventDefault();
    this.clienteService.loadPorCpf();
    this.routesFlow.go();
  }
}
