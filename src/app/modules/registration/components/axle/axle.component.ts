import { Component, ViewEncapsulation, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { RecursosService } from 'app/services/recursos.service';

import { PedidoService } from 'app/services/pedido.service';
import { PlacaService } from 'app/modules/registration/services/placa.service';
import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { Carro, Categoria } from 'app/modules/registration/models/carro.model';
import { RegistrationComponent } from './../../registration.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalExclusaoVeiculoComponent } from './../modal-exclusao-veiculo/modal-exclusao-veiculo.component';
import { ModalEdicaoVeiculoComponent } from './../modal-edicao-veiculo/modal-edicao-veiculo.component';

import { RoutesFlowService } from 'app/services/routes-flow.service';
import { CustomValidators } from 'app/validators';

import ProdutoMock from 'app/mocks/veiculos';
import eixosSvg from 'app/mocks/car-categories';
import * as localStore from 'store';

@Component({
  selector: 'app-registration-axle',
  templateUrl: './axle.component.html',
  styleUrls: ['./axle.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [ NgbModal ]
})
export class AxleComponent implements OnInit {
  disabled = true;
  axle = new FormControl('');
  fromOverview = false;

  veiculos: any[];
  veiculo: any;

  /**
   * Referenci do Object Modal
   */
  private modalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<Carro>,
    private pedidoService: PedidoService,
    private plaqueService: PlacaService,
    private registration: RegistrationComponent,
    private routesFlow: RoutesFlowService,
    private R: RecursosService,
  ) {
    this.plaqueService.loadCategorias();

    const pedido  = localStore.get('pedido') || {};
    this.veiculos = localStore.get('veiculos') || pedido.Veiculos || [];
    this.veiculo  = localStore.get('veiculo-atual');

    if (this.veiculos.length > 0) {
      this.disabled = false;
    }

    this.route.queryParams.subscribe(params => {
      this.fromOverview = params.r === '' || !!params.r;
    });
  }

  ngOnInit() {
    this.registration.bgcontent  = 'image4';
    this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_queremos_te_conhecer') + "</h1><p>" + this.R.R('sidebar_desc_queremos_te_conhecer') + "</p>";
    this.resize();
  }

  get categorias(): Categoria[] {
    return localStore.get('categorias') || [];
  }

  categoria(id: number): Categoria {
    return this.categorias.find(cat => cat.CategoriaVeiculoId === id)
  }

  getAxleImage(id) {
    return encodeURI(`~assets/svg/axle/1/${eixosSvg[Number(id)]}.svg`)
  }

  getAxleTitle(id) {
    return this.categoria(id).Nome;
  }

  getAxleDescription(id) {
    return this.categoria(id).Rodagem;
  }

  resize() {
    setTimeout(() => this.registration.adjustHeight(), 10);
  }

  open(content) {
    this.modalService.open(content);
  }

  selected(placa: string) {
    localStore.set('veiculoSelecionado', placa);
  }

  openEdicaoVeiculo(placa: string) {
    this.selected(placa);

    this.modalRef = this.modalService.open(ModalEdicaoVeiculoComponent, {
      windowClass: 'modal-expandido modal-edicao-veiculo',
      size: 'lg'
    });

    this.modalRef.result.then(() => {
      this.veiculo = localStore.get('veiculo-atual');
      this.veiculos = this.veiculos.map(veiculo => {
        if (veiculo.Placa === this.veiculo.Placa) {
          return this.veiculo;
        }
        return veiculo;
      });
      localStore.set('veiculos', this.veiculos);
      this.resize();
    });
  }

  openExclusaoVeiculo(placa: string) {
    this.selected(placa);

    this.modalRef = this.modalService.open(ModalExclusaoVeiculoComponent, {
      windowClass: 'modal-expandido modal-exclusao-veiculo',
      size: 'lg'
    });

    this.modalRef.result.then(() => {
      this.veiculos = localStore.get('veiculos')
      this.resize();
    });
  }

  save(to: string = null) {
    const veiculos = localStore.get('veiculos') || [];

    this.pedidoService.AtualizaVeiculos(veiculos);

    const addNew = to === '/comprar/placa';
    localStore.set('veiculo-novo', addNew);
    if (addNew) {
      localStore.remove('veiculo-atual');
    }

    const url = !to && this.fromOverview ? '/comprar/resumo' : to;
    this.routesFlow.go(false, url);
  }

  add(e) {
    e.preventDefault();
    this.save('/comprar/placa');
  }

  submit(e) {
    e.preventDefault();
    this.save();
  }
}
