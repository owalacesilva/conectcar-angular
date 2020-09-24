import { Component, ViewChild, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RecursosService } from 'app/services/recursos.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { FeatureToggleService } from 'app/services/featureToggle.service';
import { HttpError } from 'app/services/http.service';
import { DialogService } from 'app/services/dialog.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalTrocaContaComponent } from './../index';
import { RecargaService } from 'app/services/recarga.service';
import { Animations } from 'app/animations';
import { ContaService } from 'app/services/conta.service';
import { ApiResponse } from 'app/models/api-response.model';
import * as localStore from 'store';

@Component({
  selector: 'app-recarga-avulsa',
  templateUrl: './recarga-avulsa.component.html',
  styleUrls: ['./recarga-avulsa.component.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [ Animations.slideInOut ]
})
export class RecargaAvulsaComponent implements AfterViewInit {
  @ViewChild('creditCard') creditCard;

  // Controla o fluxo do passo a passo
  private escolherRecarga     = true;
  private pagamento           = false;
  private pagamentoProcessado = false;

  private modalRef: NgbModalRef;
  private loading   = true;
  private direction = 'left';
  private height    = 'auto';

  private recargas: Array<any> = [];
  private contas: Array<any> = [];
  private recargaSelecionada: any = {};
  private contaSelecionada: any = localStore.get('contaSelecionada') || {};

  /**
   * [constructor description]
   *
   * @param {NgbModal}                private modalService   [description]
   * @param {Router}                  private router         [description]
   * @param {DialogService}           private dialogService  [description]
   * @param {RecargaService}          private recargaService [description]
   * @param {ContaService}            private contaService   [description]
   * @param {FeatureToggleService}    private ft             [description]
   * @param {RecursosService}         private R              [description]
   * @param {GoogleTagManagerService} private gtmService     [description]
   * @param {ElementRef}              private elRef          [description]
   */
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private httpError: HttpError,
    private dialogService: DialogService,
    private recargaService: RecargaService,
    private clienteService: ClienteService,
    private contaService: ContaService,
    private ft: FeatureToggleService,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService,
    private elRef: ElementRef,
  ) {
    ft.Check('MeuConectCar', 'RecargaAvulsa');
  }

  /**
   * [ngAfterViewInit description]
   */
  ngAfterViewInit() {
    this.contaService.getAll()
      .map(a => a.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          this.contas = Dados.Contas;

          if (this.contas.length > 0) {
            this.contaSelecionada = this.contas[0];
            setTimeout(() => this.getRecargas(), 10);
          }
        },
        (err) => this.onError(err));
  }

  /**
   * [getRecargas description]
   *
   */
  getRecargas() {
    if (this.contaSelecionada.NumeroConta) {
      this.loading = true;
      this.recargaService
        .getAvulsas(this.contaSelecionada.CodigoTipoConta)
        .map(a => a.json())
        .subscribe(
          ({ Dados }: ApiResponse) => {
            this.loading  = false;
            this.recargas = Dados.Recargas;
            setTimeout(() => this.adjustHeight('credits'), 10);
          },
          (err) => this.onError(err));
    }
  }

  /**
   * [onError description]
   *
   * @param {[type]} err [description]
   */
  onError(err) {
    this.loading = false;
    this.httpError.run(err)
  }

  /**
   * [getValorFormatado description]
   *
   * @param {any} valor [description]
   */
  getValorFormatado(v: any) {
    let valorF = 0;
    if (parseFloat(v) >= 0) {
      valorF = v;
    } else {
      valorF = v * -1;
    }

    return ['R$', valorF.toFixed(2)].join(' ');
  }

  /**
   *
   * Salva em variavel local o credito escolhido
   *
   * @param {any} recarga [description]
   * ========================================
   */
  selectCredit(recarga: any) {
    this.recargaSelecionada = recarga;
  }

  sendCard(data: any) {
    this
      .recargaService
      .post(data)
      .map(a => a.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          this.loading = false;
          this.pagamento           = false;
          this.pagamentoProcessado = true;
          this.gtmService.sendPageView('area-logada/recarga/pagamento');
          this.adjustHeight('success');
        },
        err => this.onError(err)
      );
  }

  /**
   * Salva em variavel local o credito escolhido
   * ========================================
   */
  saveCreditSelected() {
    if (!this.recargaSelecionada.Codigo) {
      return;
    }

    this.escolherRecarga = false;
    this.pagamento       = true;
    this.adjustHeight('payment');
  }

  /**
   * Salva a forma de pagamento para a recarga
   * ========================================
   */
  savePayment() {
    const Pagamento: any = {
      Tipo: 'CartaoDeCredito',
      StatusIntegracaoFinanceira: 'Pendente',
    };

    const data: any = {
      ClienteId: localStore.get('clienteId'),
      ContaPagamentoId: this.contaSelecionada.ContaPagamentoId,
      Recarga: {
        Codigo: this.recargaSelecionada.Codigo,
        Valor: this.recargaSelecionada.Valor,
      }
    };

    const cardId = this.creditCard.cardId;
    this.loading = true;

    // new card
    if (!cardId) {
      const venc = this.creditCard.vencimento.value.split('/') || [];

      const MesDeVencimento = (venc[0] || '').trim();
      let AnoDeVencimento = (venc[1] || '').trim();

      if (AnoDeVencimento.length === 2) {
        AnoDeVencimento = `20${AnoDeVencimento}`
      }

      Pagamento.CartaoDeCredito = {
        Nome: this.creditCard.nome.value,
        Numero: this.creditCard.numero.value.replace(/\D*/g, ''),
        BinCartao: this.creditCard.bin,
        Bandeira: this.creditCard.cardType,
        CVV: this.creditCard.cvc.value,
        MesDeVencimento,
        AnoDeVencimento,
      }
      data.Pagamento = Pagamento;
      return this.sendCard(data);
    }

    this
      .clienteService
      .CartaoDeCredito(cardId)
      .map(d => <ApiResponse>d.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          if (Dados.TokenCartaoDeCredito) {
            Pagamento.TokenCartao = Dados.TokenCartaoDeCredito;
            data.Pagamento = Pagamento;
            this.sendCard(data);
          }
        }
      )
  }

  /**
   * Inicia novamente o processo para recarga avulsa
   * ========================================
   */
  resetProcess() {
    this.recargaSelecionada  = {};
    this.pagamentoProcessado = false;
    this.escolherRecarga     = true;
    setTimeout(() => this.adjustHeight('credits'), 10);
  }

  /**
   * [modalTrocaConta description]
   *
   * @return {Promise<any>} [description]
   */
  private modalTrocaConta(): Promise<any> {
    const ngOptions: NgbModalOptions = {
      windowClass: 'modal-expandido modal-troca-conta',
      size: 'lg'
    };

    this.modalRef = this.modalService.open(ModalTrocaContaComponent, ngOptions);
    return this.modalRef.result;
  }

  /**
   * [openModalTrocaConta description]
   */
  openModalTrocaConta() {
    if (this.contas && this.contas.length <= 1) {
      return;
    }

    this.modalTrocaConta().then(result => {
      this.contaSelecionada = localStore.get('contaSelecionada');
    });
  }

  /**
   * [adjustHeight description]
   *
   * @param {[type]} step [description]
   */
  adjustHeight(step) {
    const holder 		= this.elRef.nativeElement.querySelector('.holder.' + step);
    const holders = this.elRef.nativeElement.querySelector('.holders');

    holders.style['height'] = holder.scrollHeight + 'px';
  }
}
