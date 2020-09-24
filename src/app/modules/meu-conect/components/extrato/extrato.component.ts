import { Component, ViewEncapsulation, AfterViewInit, HostListener } from '@angular/core';
import { RecursosService } from 'app/services/recursos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ExtratoDetalheComponent, ModalTrocaContaComponent } from './../index';
import { DialogService } from 'app/services/dialog.service';
import * as localStore from 'store';
import * as moment from 'moment';
import * as locales from 'moment/min/locales';
import * as SmartBanner from 'smart-app-banner';
import {Observable} from 'rxjs/Observable';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';

moment.locale('pt-br');

import { ContaService } from 'app/services/conta.service';
import { ApiResponse } from 'app/models/api-response.model';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ExtratoComponent implements AfterViewInit {

  private modalRef: NgbModalRef;
  private loading = true;
  private loadingPagination = false;
  private contas: any;
  private contaSelecionada: any;
  private extratos: Array<any> = [];
  private numeroDaPagina = 1;
  public scrollCallback;

  constructor(
    private _modalService: NgbModal,
    private R: RecursosService,
    private dialogService: DialogService,
    private router: Router,
    private contaService: ContaService,
    private gtmService: GoogleTagManagerService
  ) {
    this.contaSelecionada = localStore.get('contaSelecionada') || {};
    // this.scrollCallback   = this.getExtrato.bind(this);
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    this.contaService.getAll()
      .map(a => a.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          this.loading = false;
          this.contas  = Dados.Contas;

          if( this.contas.length > 0 ) {
            this.contaSelecionada = this.contas[0];

            setTimeout(() => { this.getExtrato(); });
          }
        },
        (err) => this.onError(err));

    this.callSmartBanner();
    this.gtmService.sendPageView('area-logada/extrato');
  }

  /**
   * [getExtrato description]
   *
   * @see https://codeburst.io/angular-2-simple-infinite-scroller-directive-with-rxjs-observables-a989b12d4fb1
   */
  getExtrato() {
    if( this.contaSelecionada.NumeroConta && this.loadingPagination == false) {
      this.loadingPagination = true;
      this.contaService.getExtrato({
        ContaId: this.contaSelecionada.NumeroConta,
        DataTransacaoDe: "",
        DataTransacaoAte: "",
        Placas: [],
        NumeroDaPagina: this.numeroDaPagina,
        QuantidadeLinhas: 10
      })
        .map(a => a.json())
        .subscribe(
          ({ Dados }: ApiResponse) => {
            this.filtraResposta( Dados );
          },
          (err) => this.onError(err));
    }
  }

  /**
   * [filtraResposta description]
   *
   * @param {any} Dados [description]
   */
  filtraResposta(Dados: any) {
    this.numeroDaPagina++;
    this.extratos = this.extratos.concat( this.groupExtrato(Dados.Extratos) );
    this.loadingPagination = false;
  }

  /**
   * [groupExtrato description]
   *
   * @param {any} extratos [description]
   */
  groupExtrato(extratos: any) {
    let keyHolder = [];
    let arr       = [];

    extratos.forEach((extrato) => {
      let momentDataTransacao = moment(extrato.DataTransacao).format('YYYY-MM-DD');

      keyHolder[momentDataTransacao] = keyHolder[momentDataTransacao] || {};

      var obj = keyHolder[momentDataTransacao];

      if( Object.keys(obj).length == 0)
        arr.push(obj);

      obj.DataTransacao = extrato.DataTransacao;
      obj.transactions  = obj.transactions || [];

      obj.transactions.push( extrato );
    });

    return arr;
  }

  /**
   * [onError description]
   *
   * @param {[type]} err [description]
   */
  onError(err) {
    this.dialogService.showAlert({
      title: 'Houve um problema',
      subtitle: err
    });
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
   * [getSubDescricao description]
   *
   * @param {any} transacao [description]
   */
  getSubDescricao(transacao: any) {
    let subDescricao = transacao.SubDescricao;

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

  /**
   * [getDataFormatada description]
   *
   * @param {any} data [description]
   */
  getDataFormatada(data: any) {
    let momentData = moment(data);

    return momentData.isValid() ? momentData.format('LL') : data;
  }

  /**
   * [getValorFormatado description]
   *
   * @param {any} valor [description]
   */
  getValorFormatado(v: any, c: any, p: boolean = true, n: boolean = true) {
    let valorF = 0;
    if( parseFloat(v) >= 0 ) {
      valorF = v;
    } else {
      valorF = v * -1;
    }

    let valor = ["R$", valorF.toFixed(2)].join(' ');

    if( c ) {
      return (p ? ["+", valor].join(' ') : valor);
    } else {
      return (n ? ["-", valor].join(' ') : valor);
    }
  }

  /**
   * [HostListener description]
   *
   * @param {scroll"} "window [description]
   * @param {[type]}          [description]
   */
  @HostListener("window:scroll", [])
  onWindowScroll() {
    var winheight   = window.innerHeight || (document.documentElement || document.body).clientHeight
    var docheight   = this.getDocHeight();
    var scrollTop   = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    var trackLength = docheight - winheight
    var pctScrolled = Math.floor(scrollTop / trackLength * 100) // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)

    if (pctScrolled >= 90) {
      this.getExtrato();
    }
  }

  /**
   * [getDocHeight description]
   */
  getDocHeight() {
    var D = document;
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    )
  }

  /**
   * [isCredit description]
   *
   * @param {any} transacao [description]
   */
  isCredit(transacao: any) {
    return transacao.Credito && transacao.NomeGrupoTipoOperacao == "Recarga";
  }

  /**
   * [openModalExtratoDetalhe description]
   *
   */
  openModalExtratoDetalhe(transacao: any){
    localStore.set('transacaoS', transacao);
    this.gtmService.sendPageView('area-logada/extrato/detalhe-passagem');

    this.modalRef = this._modalService.open(ExtratoDetalheComponent, {
      windowClass: 'modal-expandido modal-extrato-detalhe',
      size: 'lg'
    });
  }

  /**
   * [modalTrocaConta description]
   *
   * @return {Promise<any>} [description]
   */
  private modalTrocaConta(): Promise<any> {
    let ngOptions: NgbModalOptions = {
      windowClass: 'modal-expandido modal-troca-conta',
      size: 'lg'
    };

    this.modalRef = this._modalService.open(ModalTrocaContaComponent, ngOptions);
    return this.modalRef.result;
  }

  /**
   * [openModalTrocaConta description]
   */
  openModalTrocaConta() {
    if(Array.isArray(this.contas) && this.contas.length <= 1) return;

    this.modalTrocaConta().then(
      (result) => {
        this.contaSelecionada = localStore.get('contaSelecionada');
        this.numeroDaPagina   = 1;
        this.extratos.length  = 0;
        this.getExtrato();
        this.gtmService.sendPageView('area-logada/extrato/selecione-conta');
      },
      (reason) => {
        // do nothing
      }
    );
  }

  /**
   * [callSmartBanner description]
   */
  callSmartBanner() {
    new SmartBanner({
      daysHidden: 15,   // days to hide banner after close button is clicked (defaults to 15)
      daysReminder: 90, // days to hide banner after "VIEW" button is clicked (defaults to 90)
      appStoreLanguage: 'us', // language code for the App Store (defaults to user's browser language)
      title: 'ConectCar',
      author: 'ConectCar S.A.',
      button: 'Ver',
      store: {
        ios: 'em App Store',
        android: 'na Google Play',
        windows: 'na Windows store'
      },
      price: {
        ios: 'Grátis',
        android: 'Grátis',
        windows: 'Grátis'
      },
      icon: "img/cc-app-android-download.jpg" // full path to icon image if not using website icon image
      // , theme: '' // put platform type ('ios', 'android', etc.) here to force single theme on all device
      // , force: 'ios' // Uncomment for platform emulation
    });
  }
}
