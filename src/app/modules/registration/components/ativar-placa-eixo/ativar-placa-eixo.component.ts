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
import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { PlacaService } from 'app/modules/registration/services/placa.service';
import { Carro, Categoria } from 'app/modules/registration/models/carro.model';
import { RegistrationComponent } from './../../registration.component';
import { RecursosService } from 'app/services/recursos.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalEdicaoVeiculoComponent } from './../modal-edicao-veiculo/modal-edicao-veiculo.component';
import { CustomValidators } from 'app/validators';
import { Masks } from 'app/masks';
import eixosSvg from 'app/mocks/car-categories';

import { ADD, REMOVE } from 'app/modules/registration/reducers/placa.reducer';
import * as localStore from 'store';

import { RoutesFlowService } from 'app/services/routes-flow.service';

@Component({
  selector: 'app-registration-ativar-placa-eixo',
  templateUrl: './ativar-placa-eixo.component.html',
  styleUrls: ['./ativar-placa-eixo.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [ NgbModal ]
})
export class AtivarPlacaEixoComponent implements OnInit, AfterViewInit {
  @ViewChild('gnplaca') gnplaca;
  fromOverview = false
  veiculos: any[]

  categorias: any[];
  categoriaSelecionada: any = {};

  /**
   * Referenci do Object Modal
   */
  private modalRef: NgbModalRef;

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
    private modalService: NgbModal,
    private registration: RegistrationComponent,
    private routesFlow: RoutesFlowService,
    private R: RecursosService,
  ) {
    this.route.queryParams.subscribe(params => {
      this.fromOverview = params.r === '' || !!params.r;
    });
  }

  ngOnInit() {
    this.store.select('placa').subscribe(
      (data: any) => {
        if (data && data.length) {
          this.categoriaSelecionada = this.categorias.find(cat => cat.CategoriaVeiculoId === data[0].CategoriaId);
        }
      }
    );

    // Carrega todas as categorias da API
    this
      .plaqueService
      .Categorias()
      .map(cars => <ApiResponse>cars.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          localStore.set('categorias', Dados);
          this.categorias = Dados;

          // Define a primeira categoria como a default
          this.categoriaSelecionada = Dados.length ? Dados[0] : {};
          this.loadingService.destroy();
        },
        err => this.loadingService.destroy()
      );

    this.registration.bgcontent  = 'image8';
    this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_design_tecnologia') + "</h1><p>" + this.R.R('sidebar_desc_em_alguns_passos') + "</p>";

    // Define a primeira categoria como a default
    this.categorias = localStore.get('categorias');

    if (this.categorias && this.categorias.length) {
      this.categoriaSelecionada = this.categorias[0];
    } else {
      this.loadingService.show();
    }

    const veiculoSelecionado = localStore.get('veiculoSelecionado') || {};

    if (veiculoSelecionado) {
      this.gnplaca.plaque1.setValue(veiculoSelecionado.split('-')[0]);
      this.gnplaca.plaque2.setValue(veiculoSelecionado.split('-')[1]);
      this.gnplaca.disabled = false;
    }
  }

  ngAfterViewInit() {
  }

  back(e) {
    e.preventDefault();
    e.stopPropagation();
    history.back();
  }

  get placa(): string {
    return `${this.gnplaca.plaque1.value}-${this.gnplaca.plaque2.value}`
  }

  selected(placa: string) {
    localStore.set('veiculoSelecionado', placa);
  }

  openEdicaoVeiculo() {
    if (this.gnplaca.disabled ) {
      return;
    }

    this.selected( this.placa );

    this.modalRef = this.modalService.open(ModalEdicaoVeiculoComponent, {
      windowClass: 'modal-expandido modal-edicao-veiculo',
      size: 'lg'
    });
  }

  submit(e) {
    e.preventDefault();

    if (this.gnplaca.disabled ) {
      return;
    }

    this.loadingService.show();
    const veiculosTemp = localStore.get('veiculosTemp') || [];

    // already added
    if (veiculosTemp.find(data => data.Placa === this.placa)) {
      this.dialogService.showAlert({
        title: this.R.R('alerta_error_placa_carro_ja_associado'),
        subtitle: this.R.R('alerta_error_placa_escolha_outra')
      });
      setTimeout(() => this.loadingService.destroy(), 10);
      return;
    }

    this.plaqueService
      .porPlaca(this.placa)
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          this.gnplaca.disabled = false;

          if (this.gnplaca.disabled) {
            return this.dialogService.showAlert({
              title: this.R.R('alerta_error_placa_ja_associada'),
              subtitle: this.R.R('alerta_error_placa_entre_contato')
            });
          }

          veiculosTemp.push({
            CategoriaId: this.categoriaSelecionada.CategoriaVeiculoId,
            Placa      : this.placa
          });

          localStore.set('veiculosTemp', veiculosTemp);
          this.routesFlow.go();
        },
        (err) => {
          console.log(err)
          this.loadingService.destroy();
        },
        () => this.loadingService.destroy()
      );
  }
}
