import { Component, ViewEncapsulation, ViewChild, AfterViewInit, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiResponse } from 'app/models/api-response.model';
import { LoadingService } from 'app/services/loading.service';
import { DialogService } from 'app/services/dialog.service';
import { PedidoService } from 'app/services/pedido.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalDescontoComponent } from 'app/components/modal-desconto/modal-desconto.component';
import { RecursosService } from 'app/services/recursos.service';

import Payment from 'payment';
import * as store from 'store';

@Component({
  selector: 'cc-cartao-payment',
  templateUrl: './cartao-de-credito.component.html',
  styleUrls: ['./cartao-de-credito.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [ NgbModal ]
})
export class CartaoDeCreditoComponent implements AfterViewInit {
  @Input('chackCupom') doChackCupom = true;
  @Input() enableCoupon = false;
  @Output() onResize = new EventEmitter<void>();

  @Output() cardId: any = null;

  private modalRef: NgbModalRef;
  private bandeira;

  @ViewChild('nomeInput') nomeInput: ElementRef;

  @ViewChild('numeroInput') numeroInput: ElementRef;
  public numero = new FormControl('');
  private numeroBlurred: boolean;
  private numeroError: string = null;

  public nome = new FormControl('');

  @ViewChild('cvcInput') cvcInput: ElementRef;
  public cvc = new FormControl('');
  private cvcBlurred: boolean;
  private cvcError: string = null;

  @ViewChild('vencimentoInput') vencimentoInput: ElementRef;
  public vencimento = new FormControl('');
  private vencimentoBlurred: boolean;
  private vencimentoError: string = null;

  public cardType: string;
  private showValidation: boolean;

  private useOwnCreditCard: boolean;
  private ownCreditCard: any = null;
  public newCreditCard: any = {};
  private cartaoLabel: string;

  private checkingBin = false;
  private lastBin = null;

  public disabled = true;

  constructor(
    private loading: LoadingService,
    private dialogService: DialogService,
    private router: Router,
    private pedidoService: PedidoService,
    private modalService: NgbModal,
    private R: RecursosService
  ) {
    this.bandeira = null;
  }

  ngAfterViewInit() {
    const cli = store.get('cliente') || {};

    Payment.formatCardNumber(this.numeroInput.nativeElement);
    Payment.formatCardExpiry(this.vencimentoInput.nativeElement);
    Payment.formatCardCVC(this.cvcInput.nativeElement);

    if (cli && cli.FormasDePagamento && cli.FormasDePagamento.length) {
      this.ownCreditCard = cli.FormasDePagamento[0];
      this.cartaoLabel = this.R.R('cadastro_pagamento_cartao_final') + ' ' + this.ownCreditCard.QuatroUltimos;
      this.showOwnCard();
    } else {
      this.cartaoLabel = this.R.R('cadastro_pagamento_cartao_outro');
      this.numeroInput.nativeElement.focus();
    }

    this.onResize.emit();
  }

  bandeirasClasses() {
    return {
      ic_band_visa: this.bandeira === 'visa',
      ic_band_mastercard: this.bandeira === 'mastercard',
      ic_band_amex: this.bandeira === 'amex',
      ic_band_hipercard: this.bandeira === 'hipercard',
      ic_band_diners: this.bandeira === 'diners'
    }
  }

  get bin() {
    return this.numero.value.replace(/\D*/g, '').substring(0, 6);
  }

  checkDisabled() {
    this.disabled = (
      !this.ownCreditCard &&
      !Payment.fns.validateCardNumber(this.numero.value) ||
      !Payment.fns.validateCardExpiry(this.vencimento.value) ||
      !Payment.fns.validateCardCVC(this.cvc.value, this.cardType) ||
      this.nome.value === '' ||
      this.cvcError !== null ||
      this.numeroError !== null ||
      this.vencimentoError !== null
    );
  }

  checkCupom() {
    if (!this.enableCoupon || this.lastBin === this.bin || this.disabled || this.checkingBin) {
      return;
    }

    this.checkingBin = true;
    this.loading.show();
    this.lastBin = this.bin;

    this
      .pedidoService
      .CheckCupomViaBin(this.bin)
      .map(res => <ApiResponse>res.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          this.checkingBin = false;
          this.loading.destroy();

          if (!Dados || !Dados.CodigoCampanha) {
            delete this.newCreditCard.Campanha;
            return;
          }

          this.newCreditCard.Campanha = Dados.CodigoCampanha;

          const modal = this.modalService.open(ModalDescontoComponent, {
            windowClass: 'modal-expandido modal-desconto',
            size: 'lg'
          });
          modal.componentInstance.cupom = Dados.CodigoCampanha;
        },
        err => {
          this.checkingBin = false;
          this.loading.destroy();
          if (this.newCreditCard.Campanha) {
            delete this.newCreditCard.Campanha;
          }
        },
      );
  }

  afterInput() {
    this.checkDisabled();

    if (this.doChackCupom) {
      this.checkCupom();
    }
  }

  onNumeroInput() {
    this.numeroBlurred = false;
    this.cardType = Payment.fns.cardType(this.numero.value);

    if (this.cvcInput && this.cvcInput.nativeElement) {
      this.cvcInput.nativeElement.placeholder = (this.cardType === 'amex') ? 'XXXX' : 'XXX';
      this.cvcInput.nativeElement.maxLength = this.cvcInput.nativeElement.placeholder.length;
    }

    this.newCreditCard.numero = this.numero.value;

    this.changeBandeira();
    this.afterInput();
  }

  onNumeroBlur() {
    if (!this.numero.value.length) {
      return;
    }

    this.numeroError = Payment.fns.validateCardNumber(this.numero.value) ? null : 'Número inválido';
    this.numeroBlurred = true;
    this.afterInput();
  }

  onCVCInput() {
    this.newCreditCard.cvc = this.cvc.value;
    this.cvcBlurred = false;
    this.afterInput();
  }

  onNomeInput() {
    this.newCreditCard.nome = this.nome.value;
  }

  onCVCBlur() {
    if (!this.cvc.value.length) {
      return;
    }

    this.cvcError = Payment.fns.validateCardCVC(this.cvc.value, this.cardType) ? null : 'CVV inválido';
    this.cvcBlurred = true;
    this.afterInput();
  }

  onVencimentoInput() {
    this.newCreditCard.vencimento = this.vencimento.value;
    this.vencimentoBlurred = false;
    this.afterInput();
  }

  onVencimentoBlur() {
    if (!this.vencimento.value.length) {
      return;
    }

    this.vencimentoBlurred = true;
    this.vencimentoError = Payment.fns.validateCardExpiry(this.vencimento.value) ? null : 'Data inválida'
    this.afterInput();
  }

  changeBandeira() {
    const value = this.numero.value.replace(/ /g, '');

    if (/^4[0-9]*$/i.test(value)) {
      this.bandeira = 'visa';
    } else if (/^5[1-5][0-9]*$/i.test(value)) {
      this.bandeira = 'mastercard';
    } else if (/^3[47][0-9]*$/i.test(value)) {
      this.bandeira = 'amex';
    } else if (/^3(?:0[0-5]|[68][0-9])[0-9]*$/i.test(value)) {
      this.bandeira = 'diners';
    } else if (/^60[0-9]*$/i.test(value)) {
      this.bandeira = 'hipercard';
    } else {
      this.bandeira = '';
    }
  }

  showOwnCard() {
    this.useOwnCreditCard = false;
    if (!this.useOwnCreditCard) {
      this.toggleCartao();
    }
  }

  toggleCartao() {
    this.useOwnCreditCard = !this.useOwnCreditCard;

    if (this.useOwnCreditCard) {
      this.cartaoLabel = this.R.R('cadastro_pagamento_cartao_outro');

      this.cvc.setValue('XXX');
      this.nome.setValue('XXXXXXXXXXXXXX');
      this.numero.setValue(`XXXX XXXX XXXX ${this.ownCreditCard.QuatroUltimos}`);
      this.vencimento.setValue('XX/XX');

      this.cardId = this.ownCreditCard.CartaoCreditoId;

      this.cvcInput.nativeElement.disabled = 'disabled';
      this.nomeInput.nativeElement.disabled = 'disabled';
      this.numeroInput.nativeElement.disabled = 'disabled';
      this.vencimentoInput.nativeElement.disabled = 'disabled';
      this.disabled = false;

      return;
    }

    this.cardId = null;
    this.cartaoLabel = `${this.R.R('cadastro_pagamento_cartao_final')} ${this.ownCreditCard.QuatroUltimos}`;
    const cartao = this.newCreditCard;
    this.cvc.setValue(cartao.cvc);
    this.nome.setValue(cartao.nome);
    this.numero.setValue(cartao.numero);

    let vencimento = cartao.vencimento;
    if (cartao.MesDeVencimento && cartao.AnoDeVencimento) {
      vencimento = `${cartao.MesDeVencimento}/${cartao.AnoDeVencimento}`;
    }

    this.vencimento.setValue(vencimento);

    this.cvcInput.nativeElement.disabled = null;
    this.nomeInput.nativeElement.disabled = null;
    this.numeroInput.nativeElement.disabled = null;
    this.vencimentoInput.nativeElement.disabled = null;
    this.checkDisabled();
  }
}
