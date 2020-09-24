import { Component, Input, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ElementRef, ViewChild }                              from '@angular/core';
import { FormControl, Validators }                            from '@angular/forms';
import { Router }                                             from '@angular/router';
import { Observable }                                         from 'rxjs/Rx';
import { NgbActiveModal }                                     from '@ng-bootstrap/ng-bootstrap';
import { Agendamento }                                        from 'app/modules/registration/models/agendamento.model';
import { PedidoService }                                      from 'app/services/pedido.service';
import { FormaDeEnvio } from 'app/modules/registration/models/pedido.model';
import { Store }                                              from '@ngrx/store';
import * as localStore                                        from 'store';
import * as store 																						from 'store';

@Component({
  selector: 'cc-modal-endereco',
  templateUrl: './modal-endereco.component.html',
  styleUrls: ['./modal-endereco.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalEnderecoComponent implements AfterViewInit {

	@ViewChild('addressForm') addressForm;

	agendamento: Agendamento;
	formaDeEnvio: FormaDeEnvio = {
    OperadorId: 1,
    EhAgendado: false,
    PrazoDeEntrega: 7,
  };

  constructor (
  	private _activeModal: NgbActiveModal,
  	private orderService: PedidoService,
  	private store: Store<Agendamento>,
  ) {

  }

  ngAfterViewInit() {
  }

  dadosEndereco() {
    const pedido = store.get('pedido') || {};
    const endereco = (pedido.Enderecos || []).find(e => e && e.Tipo === 'Cobranca');
    return endereco;
  }

  submit() {
		const plano   = localStore.get('planoSelecionado') || {};
		const Produto = {
      Id: plano.Id,
      Titulo: plano.Titulo,
      Descricao: plano.Descricao,
      Valor: plano.Mensalidade,

      Device: plano.Device,

      // default values
      Recarga: {
        Codigo: 'CR100',
        Valor: 100.0,
      },
    }

		const FormaDeEnvio = this.formaDeEnvio;
    // this.orderService.Atualiza({
    //   Produto,
    //   FormaDeEnvio,
    //   DiasVencimento: plano.DiasVencimento[0],
    //   Enderecos: [this.addressForm.data],
    // });
    
    this._activeModal.close();
  }
}
