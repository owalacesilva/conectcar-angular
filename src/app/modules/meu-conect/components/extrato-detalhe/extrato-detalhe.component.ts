import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { RecursosService } from 'app/services/recursos.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as localStore 																					 from 'store';
import * as moment from 'moment';
import * as locales from 'moment/min/locales';


@Component({
  selector: 'app-extrato-detalhe',
  templateUrl: './extrato-detalhe.component.html',
  styleUrls: ['./extrato-detalhe.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ExtratoDetalheComponent implements AfterViewInit {

	private transacao: any;
	private dataEntrada: any = null;
	private dataSaida: any = null;
	
	private dataPedagio: any = null;
	private dataEstacionamento: any = null;

	private dataTransacao: any;
	private dataRegistroCredito: any = null;
	private dataRegistroAbastecimento: any = null;
	private dataRegistroPedagio: any = null;
	private dataRegistroEstacionamento: any = null;

	/**
	 * [constructor description]
	 * 
	 * @param {NgbActiveModal}  private _activeModal [description]
	 * @param {RecursosService} private R            [description]
	 */
  constructor(
    private _activeModal: NgbActiveModal,
    private R: RecursosService
  ) {
  	this.transacao = localStore.get('transacaoS');

  	// Recupera as datas de entrada e saída
  	this.getSubDescricao();

  	this.dataTransacao = moment(this.transacao.DataTransacao).format('[em] DD/MM/YYYY [às] HH:mm');
  	switch (this.transacao.NomeGrupoTipoOperacao) {
  		case 'Crédito':
  			this.dataRegistroCredito = this.dataTransacao;
  			break;
  		case 'Combustivel':
  			this.dataRegistroAbastecimento = this.dataTransacao;
  			break;
  		case 'Pedágio':
  			this.dataRegistroPedagio = this.dataTransacao;
  			break;
  		case 'Estacionamento':
				this.dataEstacionamento         = this.getSubDescricaoFormatted();
				this.dataRegistroEstacionamento = this.dataTransacao;
  			break;
  	}
  }

  ngAfterViewInit() {
  }

  /**
   * [getIconeTransacao description]
   * 
   * @param {any} tipo [description]
   */
  getIconeTransacao(transacao: any) {
  	switch (transacao.NomeGrupoTipoOperacao) {
  		case 'Crédito':
  			// code...
  			return "ic_credito";
  		case 'Combustivel':
  			// code...
  			return "ic_abastecimento";
  		case 'Pedágio':
  			// code...
  			return "ic_pedagio";
  		case 'Estacionamento':
  			// code...
  			return "ic_estacionamento";
  		case 'Taxas':
  			// code...
  			return "ic_taxas";
  		case 'Recarga':
  			// code...
  			return "ic_credito";
  		default:
  			// code...
  			return "ic_outros";
  	}
  }

  /**
   * [getValorLabel description]
   */
  getValorLabel() {
  	switch (this.transacao.NomeGrupoTipoOperacao) {
  		case 'Crédito':
  			// code...
  			return "Crédito";
  		case 'Combustivel':
  			// code...
  			return "Abastecimento";
  		case 'Pedágio':
  			// code...
  			return "Passagem em pedágio";
  		case 'Estacionamento':
  			// code...
  			return "Estacionamento";
  		case 'Taxas':
  			// code...
  			return "Taxas";
  		case 'Recarga':
  			// code...
  			return "Recarga";
  		default:
  			// code...
  			return "Outros";
  	}
  }

  /**
   * [getValorFormatado description]
   * 
   * @param {any} valor [description]
   */
  getValorFormatado(v: any, p: boolean = true, n: boolean = true) {
  	let valorF = 0;
  	if( parseFloat(v) >= 0 ) {
  		valorF = v;
  	} else {
  		valorF = v * -1;
  	}

  	let valor = ["R$", valorF.toFixed(2)].join(' ');

  	if( this.transacao.Credito ) {
  		return (p ? ["+", valor].join(' ') : valor);
  	} else {
  		return (n ? ["-", valor].join(' ') : valor);
  	}
  }

  /**
   * [getSubDescricao description]
   * 
   * @param {any} transacao [description]
   */
  getSubDescricao() {
  	let subDescricao = this.transacao.SubDescricao;

  	if( subDescricao && subDescricao.length ) {
  		let subs = subDescricao.split('|');

  		try {
				this.dataEntrada = moment( subs[0], 'DD-MM-YYYY HH:mm:ss' ).format('[em] DD/MM/YYYY [às] HH:mm');
				this.dataSaida   = subs[1] ? moment( subs[1], 'DD-MM-YYYY HH:mm:ss' ).format('[em] DD/MM/YYYY [às] HH:mm') : null;
  		} catch(e) {
  			console.log(e);
  		}
  	}
  }

  /**
   * [getSubDescricaoFormatted description]
   * 
   * @param {any} transacao [description]
   */
  getSubDescricaoFormatted() {
  	let subDescricao = this.transacao.SubDescricao;

  	if( subDescricao && subDescricao.length ) {
  		let subs = subDescricao.split('|');

  		try {
				let firstDate  = moment( subs[0], 'DD-MM-YYYY HH:mm:ss' );
				let secondDate = subs[1] ? moment( subs[1], 'DD-MM-YYYY HH:mm:ss' ) : null;

				if( secondDate && secondDate.isValid() ) {
					return [firstDate.format('[em] DD/MM/YYYY [das] HH:mm'), secondDate.format('[às] HH:mm') ].join(' ');
				} else {
					return firstDate.format('[em] DD/MM/YYYY [às] HH:mm');					
				}
  		} catch(e) {
  			console.log(e);
  			return "";
  		}
  	} else {
  		return "";
  	}
  }
}
