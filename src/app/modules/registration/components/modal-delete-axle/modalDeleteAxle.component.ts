import { Component, Input } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';

import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { TypeVehicle } from 'app/modules/registration/models/type-vehicle';
import { Carro, Categoria } from 'app/modules/registration/models/carro.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { REMOVE } from 'app/modules/registration/reducers/placa.reducer';

import { CustomValidators } from 'app/validators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import ProdutoMock from 'app/mocks/veiculos';
import eixosSvg from 'app/mocks/car-categories';
import * as localStore from 'store';

@Component({
  selector: 'app-registration-delete-modal-axle',
  templateUrl: './modalDeleteAxle.component.html',
  styleUrls: ['./modalDeleteAxle.component.less']
})
export class ModalDeleteAxleComponent {
  @Input() close: Function;

  axles = this.categorias.map(data => data.Id);
  veiculos = [];
  veiculo = null;

  constructor(
    private _activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private router: Router,
    private store: Store<Carro>,
  ) {
      this.veiculos = localStore.get('veiculos') || [];
      this.veiculo = this.veiculos.find(v => v.Placa === localStore.get('veiculoSelecionado'));
    }

  get categorias(): Categoria[] {
    return localStore.get('categorias') || [];
  }

  categoria(id: number): Categoria {
    return this.categorias.find(cat => cat.Id === id)
  }

  getAxleImage(id: number) {
    // return this.categoria(this.veiculo.Categoria.Id).ImageEixo;
    return `~assets/assets/svg/axle/2/${eixosSvg[Number(id)]}.svg`
  }

  deletePlaque() {
    const payload = localStore.get('veiculoSelecionado');
    this.store.dispatch({ type: REMOVE, payload });
    setTimeout(() => this.close(), 0);

    this.veiculos = this.veiculos.filter(veiculo =>
      veiculo.Placa !== this.veiculo.Placa)

    localStore.set('veiculos', this.veiculos);
  }
}
