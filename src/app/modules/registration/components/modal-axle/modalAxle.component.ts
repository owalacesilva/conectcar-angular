import { Component, Input, AfterViewInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';

import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { TypeVehicle } from 'app/modules/registration/models/type-vehicle';
import { Carro, Categoria } from 'app/modules/registration/models/carro.model';
import { UPDATE } from 'app/modules/registration/reducers/placa.reducer';

import { CustomValidators } from 'app/validators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import ProdutoMock from 'app/mocks/veiculos';
import eixosSvg from 'app/mocks/car-categories';
import * as localStore from 'store';

@Component({
  selector: 'app-registration-modal-axle',
  templateUrl: './modalAxle.component.html',
  styleUrls: ['./modalAxle.component.less']
})
export class ModalAxleComponent implements AfterViewInit {
  @Input() close: Function;

  modalAxle = new FormControl('');
  axles = this.categorias.map(data => data.CategoriaVeiculoId);
  selected = null;
  disabled = true

  veiculos = [];
  veiculo = null;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private store: Store<Carro>,
  ) {

    this.veiculos = localStore.get('veiculos') || [];
    this.veiculo = this.veiculos.find(v => v.Placa === localStore.get('veiculoSelecionado'));
  }

  get categorias(): Categoria[] {
    return localStore.get('categorias') || [];
    // return ProdutoMock;
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

  ngAfterViewInit() {
  }

  changePlaque(id) {
    if (this.veiculo && this.veiculo.Categoria) {
      this.veiculo.Categoria.CategoriaVeiculoId = id;
      this.disabled = false;
    }
  }

  isSelected(id) {
    return (
      this.veiculo &&
      this.veiculo.Categoria &&
      this.veiculo.Categoria.CategoriaVeiculoId === id
    );
  }

  savePlaque() {
    this.store.dispatch({ type: UPDATE, payload: this.veiculo })
    setTimeout(() => this.close(), 0);
  }
}
