import { Component, Input, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { RecursosService }                                       from 'app/services/recursos.service';
import { NgbActiveModal }                                        from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute }                                from '@angular/router';
import { ContaService }                                          from 'app/services/conta.service';
import { ApiResponse }  																				 from 'app/models/api-response.model';
import * as localStore 																					 from 'store';

@Component({
  selector: 'cc-modal-troca-conta',
  templateUrl: './modal-troca-conta.component.html',
  styleUrls: ['./modal-troca-conta.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalTrocaContaComponent implements OnInit {

	loading = true;
  contas = [];
  contaSelecionada: any;  
  
  private count: number = 0;
	private classes: any  = ['color1', 'color2', 'color3', 'color4', 'color5', 'color6'];

  constructor(
    private _activeModal: NgbActiveModal,
    private R: RecursosService,
    private router: Router,
    private contaService: ContaService,
  ){
    this.contaSelecionada = localStore.get('contaSelecionada') || {};
  }

  ngOnInit() {
    this.contaService.getAll()
      .map(a => a.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
					this.loading = false;
					this.contas  = Dados.Contas;
        });
  }

  /**
   * [selectAccount description]
   * 
   * @param {any} conta [description]
   */
  selectAccount(conta: any) {
		this.contaSelecionada = conta;
		this.count = 0;
  }

  /**
   * [getValorFormatado description]
   * 
   * @param {any} valor [description]
   */
  getValorFormatado(valor: any) {
  	return ["R$", valor].join(' ');
  }

  /**
   * [getColor description]
   * 
   * @param {any} index [description]
   */
  getColor(index: any) {
  	return this.classes[index] ? this.classes[index] : "";
  }

  /**
   * [submit description]
   */
  submit() {
  	localStore.set('contaSelecionada', this.contaSelecionada);
  	this._activeModal.close();
  }
}
