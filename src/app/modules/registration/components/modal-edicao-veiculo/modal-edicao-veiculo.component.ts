import { Component, Input, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';

import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { TypeVehicle } from 'app/modules/registration/models/type-vehicle';
import { Carro, Categoria } from 'app/modules/registration/models/carro.model';
import { UPDATE } from 'app/modules/registration/reducers/placa.reducer';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatureToggleService } from 'app/services/featureToggle.service';
import { CustomValidators } from 'app/validators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import ProdutoMock from 'app/mocks/veiculos';
import eixosSvg from 'app/mocks/car-categories';
import * as localStore from 'store';

@Component({
  selector: 'cc-modal-edicao-veiculo',
  templateUrl: './modal-edicao-veiculo.component.html',
  styleUrls: ['./modal-edicao-veiculo.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalEdicaoVeiculoComponent implements AfterViewInit {

  @Input() close: Function;

  modalAxle = new FormControl('');
  axles = this.categorias.map(data => data.CategoriaVeiculoId);
  selected = null;
  disabled = true

  veiculos = [];
  veiculo: any = {};

  constructor(
    private _activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private router: Router,
    private store: Store<Carro>,
    private ft: FeatureToggleService,
  ) {
    ft.Check('Compra', 'EditarNumeroDeEixos');
    this.veiculo.Placa = localStore.get('veiculoSelecionado');
  }

  get categorias(): Categoria[] {
    return localStore.get('categorias') || [];
  }

  categoria(id: number): Categoria {
    return this.categorias.find(cat => cat.CategoriaVeiculoId === id)
  }

  getAxleTitle(id): string {
    return this.categoria(id).Nome;
  }

  getAxleDescription(id) {
    return this.categoria(id).Rodagem;
  }

  ngAfterViewInit() {}

  changeAxle(CategoriaId) {
    if (this.veiculo) {
      this.veiculo.CategoriaId = CategoriaId;
      this.disabled = false;
    }
  }

  isSelected(id) {
    return (
      this.veiculo &&
      this.veiculo.CategoriaId === id
    );
  }

  savePlaque() {
    const veiculo = localStore.get('veiculo-atual');
    veiculo.CategoriaId = this.veiculo.CategoriaId;
    localStore.set('veiculo-atual', veiculo);
    this._activeModal.close()
  }
}
