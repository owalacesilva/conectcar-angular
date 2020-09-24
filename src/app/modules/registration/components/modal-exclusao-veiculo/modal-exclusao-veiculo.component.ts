import { Component, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { Carro, Categoria } from 'app/modules/registration/models/carro.model';
import { REMOVE } from 'app/modules/registration/reducers/placa.reducer';

import ProdutoMock from 'app/mocks/veiculos';
import eixosSvg from 'app/mocks/car-categories';
import * as localStore from 'store';

@Component({
  selector: 'cc-modal-exclusao-veiculo',
  templateUrl: './modal-exclusao-veiculo.component.html',
  styleUrls: ['./modal-exclusao-veiculo.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalExclusaoVeiculoComponent {
  private veiculos = [];
  private veiculo  = null;

  constructor(
    private _activeModal: NgbActiveModal,
    private store: Store<Carro>
  ) {
    this.veiculos = localStore.get('veiculos') || [];
    this.veiculo = this.veiculos.find(v => v.Placa === localStore.get('veiculoSelecionado'));
  }

  getAxleImage(id: number) {
    return encodeURI(`~assets/svg/axle/1/${eixosSvg[Number(id)]}.svg`);
  }

  getAxleImage2(id) {
    switch (eixosSvg[Number(id)]) {
      case '2 eixos simples':
        return 'dois_eixos_simples';

      case '2 eixos dupla':
        return 'dois_eixos_dupla';

      case '3 eixos simples':
        return 'tres_eixos_simples';

      case '3 eixos dupla':
        return 'tres_eixos_dupla';

      case '3 eixos dupla onibus':
        return 'tres_eixos_dupla_onibus';

      case '4 eixos simples':
        return 'quatro_eixos_simples';

      case '4 eixos dupla':
        return 'quatro_eixos_dupla';

      case '5 eixos dupla':
        return 'cinco_eixos_dupla';

      case '6 eixos dupla':
        return 'seis_eixos_dupla';

      case '8 eixos dupla':
        return 'oito_eixos_dupla';

      case '9 eixos dupla':
        return 'nove_eixos_dupla';

      default:
        return null;
    }
  }

  deletePlaque() {
    this.veiculos = this.veiculos.filter(veiculo =>
      veiculo.Placa !== this.veiculo.Placa)

    localStore.set('veiculos', this.veiculos);
    this._activeModal.close();
  }
}
