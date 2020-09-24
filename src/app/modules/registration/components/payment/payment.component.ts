import { Component, ViewEncapsulation, ViewChild, AfterViewInit, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpError } from 'app/services/http.service';
import { ApiResponse } from 'app/models/api-response.model';
import { LoadingService } from 'app/services/loading.service';
import { DialogService } from 'app/services/dialog.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { PedidoService } from 'app/services/pedido.service';
import { RegistrationComponent } from './../../registration.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalEnderecoComponent } from './../modal-endereco/modal-endereco.component';
import { ProdutosService } from 'app/services/produtos.service';
import { RecursosService } from 'app/services/recursos.service';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';
import * as store from 'store';

@Component({
  selector: 'app-registration-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [ NgbModal ]
})
export class PaymentComponent implements AfterViewInit, OnInit {
  @ViewChild('addressForm') addressForm;
  @ViewChild('creditCard') creditCard;
  @ViewChild('modalCobranca') modalCobranca;
  @ViewChild('sameAddressInput') sameAddressInput;

  @Output() onResize = new EventEmitter<void>();

  private modalRef: NgbModalRef;
  private useSameAddress = true;

  @ViewChild('adesaoInput') adesaoInput;
  private adesao = new FormControl('');

  private enderecoEntrega: string;
  private enderecoCobranca: string;
  private enderecos = [];

  private adesaoLink: string;

  get ativacaoOffline() {
    return !!store.get('ativacao-offline');
  }

  constructor(
    private loading: LoadingService,
    private dialogService: DialogService,
    private produtosService: ProdutosService,
    private clienteService: ClienteService,
    private pedidoService: PedidoService,
    private modalService: NgbModal,
    private registration: RegistrationComponent,
    private routesFlow: RoutesFlowService,
    private R: RecursosService,
    private httpError: HttpError,
    private router: Router,
    private gtmService: GoogleTagManagerService
  ) {
    this.updateEnderecos();

    const plano = store.get('planoSelecionado');
    const pedido = store.get('pedido') || {};

    if (pedido.failedPreviously) {
      delete pedido.Ip;
      delete pedido.DataHoraAceite;
      delete pedido.NumeroDaConta;
      delete pedido.NumeroPedido;
      delete pedido.Status;
      delete pedido.UrlUTM;
      delete pedido.id;
      delete pedido._ts;

      this.pedidoService.Cria(pedido);
    }

    if (!plano && pedido.Produto && pedido.Produto.Id) {
      this.produtosService.setPlanoSelecionado(pedido.Produto.Id);
    }
  }

  ngOnInit() {
    const pedido = store.get('pedido') || {};
    const produto = pedido.Produto || {};

    if (produto.Codigo) {
      this.adesaoLink = this.R.R(`produto_${produto.Codigo}_termo_adesao`);
    }

    this.registration.bgcontent  = 'image6';
    this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_voce_esta_quase_la') + "</h1><p>" + this.R.R('sidebar_desc_falta_poucas_informacoes') + "</p>";
  }

  ngAfterViewInit() { }

  updateEnderecos() {
    const pedido = store.get('pedido') || {};
    const enderecos = pedido.Enderecos || [];

    const entrega = enderecos.find(addr => addr && addr.Tipo === 'Entrega')
    if (entrega) {
      this.enderecoEntrega = `${entrega.Logradouro}, ${entrega.Numero}`
    }

    const cobranca = enderecos.find(addr => addr && addr.Tipo === 'Cobranca')
    if (cobranca) {
      this.useSameAddress = false;
      this.enderecoCobranca = `${cobranca.Logradouro}, ${cobranca.Numero}`
    }

    if (this.enderecoCobranca === this.enderecoEntrega) {
      this.enderecoCobranca = null;
    }
  }

  submit() {
    if (this.creditCard.disabled) {
      return;
    }

    if (!this.adesao.value) {
      this.dialogService.showAlert({
        title: 'Termo de adesão',
        subtitle: 'Você precisa concordar com os termos de adesão para continuar sua compra',
      });
      return;
    }

    if (store.get('pedidoEnviado')) {
      this.router.navigate(['/compra-realizada']);
      return;
    }

    this.loading.show();
    const pedido = store.get('pedido') || {};
    const enderecos = pedido.Enderecos || [];

    const plano = store.get('planoSelecionado');
    const tiposConta = plano.TiposConta || [];

    pedido.TipoConta = pedido.TipoConta || {}
    pedido.Produto = pedido.Produto || plano;

    if (!pedido.TipoConta.Codigo) {
      pedido.TipoConta.Codigo = (tiposConta[0] || {}).Codigo || 'teste';
    }

    if (!pedido.DiasVencimento) {
      pedido.DiasVencimento = (plano.DiasVencimento || [])[0];
    }

    if (!pedido.Produto.CodigoCampanha) {
      pedido.Produto.CodigoCampanha = (plano.Campanha || {}).Codigo;
    }

    if (this.useSameAddress) {
      const endereco = enderecos.find(e => e && e.Tipo === 'Entrega');
      const cobranca = Object.assign({}, endereco, { Tipo: 'Cobranca' });
      pedido.Enderecos = [endereco, cobranca];
    }

    if (this.ativacaoOffline && enderecos.length === 1 && enderecos[0].Tipo === 'Entrega') {
      const cobr = Object.assign({}, enderecos[0], { Tipo: 'Cobranca' });
      pedido.Enderecos = [enderecos[0], cobr];
    }

    delete pedido.failedPreviously;
    store.set('pedido', pedido);

    if (!pedido.CodigoCupom) {
      return this.processaPedido();
    }

    this
      .produtosService
      .Lista(pedido.CodigoCupom)
      .map(res => <ApiResponse>res.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          if (!Dados || !Dados.length) {
            this
              .dialogService
              .showAlert({
                title: 'Erro',
                subtitle: 'Cupom inválido',
              });
            return this.router.navigate(['/planos']);
          }

          this.gtmService.sendPageView('compra/pagamento');
          this.processaPedido();
        }
      );
  }

  saveCard() {
    const venc = this.creditCard.vencimento.value.split('/') || [];

    const MesVencimento = Number((venc[0] || '').trim());
    let AnoVencimento = (venc[1] || '').trim();
    if (AnoVencimento.length === 2) {
      AnoVencimento = Number(`20${AnoVencimento}`);
    }

    this
      .clienteService
      .SalvaCartaoDeCredito({
        ClienteId: store.get('clienteId'),
        NomeTitular: this.creditCard.nome.value,
        CartaoDeCredito: this.creditCard.numero.value.replace(/\D*/g, ''),
        Bandeira: this.creditCard.cardType,
        CVV: this.creditCard.cvc.value,
        MesVencimento,
        AnoVencimento,
      })
      .map(res => <ApiResponse>res.json())
      .subscribe(({ Dados }: ApiResponse) => {
        if (Dados && Dados.DadosCartaoCreditoId) {
          this.clienteService.loadCartaoDeCredito(Dados.DadosCartaoCreditoId);
        }
      });
  }

  prepareCardData(callback: any) {
    const Pagamento: any = {
      StatusIntegracaoFinanceira: 'Pendente',
      Tipo: 'CartaoDeCredito',
    };

    // old credit card
    if (this.creditCard.cardId) {
      this
        .clienteService
        .CartaoDeCredito(this.creditCard.cardId)
        .map(d => <ApiResponse>d.json())
        .subscribe(
          ({ Dados }: ApiResponse) => {
            if (Dados.TokenCartaoDeCredito) {
              Pagamento.TokenCartao = Dados.TokenCartaoDeCredito;
              callback(Pagamento);
            }
          }
        )
      return;
    }

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
    };

    callback(Pagamento);
  }

  processaPedido() {
    this.prepareCardData((pagamento) =>
      this
        .pedidoService
        .ProcessaPedido(pagamento)
        .map(res => <ApiResponse>res.json())
        .subscribe(
          ({ Dados }: ApiResponse) => {
            if (!store.get('tokenCartaoDeCredito')) {
              this.saveCard();
            }

            store.set('numeroPedido', Dados.NumeroPedido);

            [
              'ativacao-offline',
              'ativacao-placa',
              'ativacao-adesivo',
              'pedido',
              'planoSelecionado',
              'veiculos',
              'veiculosTemp',
              'endereco-agendamento',
            ].forEach(s => store.remove(s));

            this.router.navigate(['/compra-realizada']);
            this.loading.destroy();
          },
          (err) => {
            const body = <ApiResponse>err.json();
            let msg = this.R.R('alerta_error_cadastro_pagamento_mensagem');
            if (body && body.Notificacoes && body.Notificacoes.length) {
              msg = body.Notificacoes.find(n => n !== '');
            }
            this.dialogService.showAlert({
              title: this.R.R('alerta_error_cadastro_pagamento_titulo'),
              subtitle: msg
            });
            this.loading.destroy();
          }
      ));
  }

  sameAddress() {
    this.useSameAddress = true;
  }

  dadosEndereco() {
    const pedido = store.get('pedido') || {};
    const endereco = (pedido.Enderecos || []).find(e => e && e.Tipo === 'Cobranca');
    return endereco;
  }

  openEnderecoCobranca() {
    this.modalRef = this.modalService.open(ModalEnderecoComponent, {
      windowClass: 'modal-expandido modal-endereco',
      size: 'lg',
    });

    this.modalRef.result.then(
      (obj) => {
        const pedido = store.get('pedido') || {};
        const entrega = (pedido.Enderecos || []).find(e => e && e.Tipo === 'Entrega');
        pedido.Enderecos = [entrega, obj.data];
        store.set('pedido', pedido);
        this.updateEnderecos();
      },
      () => this.sameAddressInput.nativeElement.click(),
    );
  }
}
