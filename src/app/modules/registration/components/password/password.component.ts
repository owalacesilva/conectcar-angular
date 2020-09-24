import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';
import { HttpError } from 'app/services/http.service';

import { ModalAdesivoPendenteComponent } from 'app/components/modal-adesivo-pendente/modal-adesivo-pendente.component';
import { DialogService } from 'app/services/dialog.service';
import { LoadingService } from 'app/services/loading.service';
import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { UsuarioService } from 'app/modules/registration/services/usuario.service';
import { PedidoService } from 'app/services/pedido.service';
import { AuthenticationService } from 'app/modules/registration/services/authentication.service';
import { RegistrationComponent } from './../../registration.component';
import { ApiResponse } from 'app/models/api-response.model';
import { CustomValidators } from 'app/validators';
import { RecursosService } from 'app/services/recursos.service';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import { ICliente } from './../../models/cliente.model'

import * as store from 'store';

@Component({
  selector: 'app-registration-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.less']
})
export class PasswordComponent implements AfterViewInit, OnInit {
  toLogin: boolean;

  @ViewChild('passwordInput') passwordInput: ElementRef;

  password = new FormControl('', [Validators.required, CustomValidators.password]);
  passwordType = 'password'
  disabled = true
  fromOverview = false
  createOnlyUser = false
  criaUsuarioLegado = false
  cpf: any;
  flow = store.get('cpf-status');
  loginFlow = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private pedidoService: PedidoService,
    private routesFlow: RoutesFlowService,
    private authenticationService: AuthenticationService,
    private registration: RegistrationComponent,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService,
    private httpError: HttpError,
  ) {

    this.route.queryParams.subscribe(params => {
      if (params.r === '' || !!params.r) {
        this.fromOverview = true;
      }

      if (this.flow !== 'new' && this.fromOverview || this.persisted) {
        this.password.setValue('Qwer1234');
        this.disabled = false;
      }
    });

    if (this.password.value && this.password.valid) {
      this.disabled = false;
    }

    this.toLogin = ['login', 'new'].indexOf(this.flow) > -1;

    if (this.flow === 'login') {
      this.registration.visible = false;
      this.loginFlow = true;
    }

    // Formata o CPF
    this.cpf = store.get('CPF') || store.get('cpf') || "";
    this.cpf = this.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  ngOnInit() {
    if (this.flow === 'login') {
      this.registration.bgcontent  = 'image7';
      this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_bem_vindo_de_volta') + "</h1><p>" + this.R.R('sidebar_desc_acesse_seu_extrato_simplificado') + "</p>";
    } else {
      this.registration.bgcontent  = 'image4';
      this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_queremos_te_conhecer') + "</h1><p>" + this.R.R('sidebar_desc_queremos_te_conhecer') + "</p>";
    }
  }

  get persisted() {
    return !!store.get('clienteId') && !!store.get('token');
  }

  back(e) {
    e.preventDefault();
    e.stopPropagation();
    history.back();
  }

  createPedido() {
    const plano = store.get('planoSelecionado') || {};
    const Produto: any = {
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

    if (plano.Campanha && plano.Campanha.CodigoCampanha) {
      Produto.CodigoCampanha = plano.Campanha.CodigoCampanha;
    }

    const Cliente = this.clienteService.getCache();
    if (!Cliente.Id) {
      Cliente.Id = store.get('clienteId');
    }
    if (!Cliente.DDD) {
      Cliente.DDD = Cliente.DddCelular;
    }

    // cleanup
    [
      'FacebookUsuarioId',
      'NomeDaMae',
      'UsuarioId',
      'Enderecos',
      'DddCelular',
      'Veiculos',
      'FormasDePagamento',
      'Tags',
      'Senha',
    ].forEach(d => { delete Cliente[d] })

    const ativacaoOffline = !!store.get('ativacao-offline');
    const data: any = {
      Cliente,
      Produto,
      DiasVencimento: plano.DiasVencimento[0],
      Ativacao: ativacaoOffline,
      TipoConta: {
        Codigo: 'teste',
      },
    };

    if (plano.TiposConta && plano.TiposConta.length) {
      data.TipoConta.Codigo = (plano.TiposConta[0] || {}).Codigo;
    }

    if (store.get('cpf-status') === 'new') {
      this.pedidoService.Cria(data);
    } else {
      this.pedidoService.Atualiza(data);
    }
  }

  onLogin({ Dados }: ApiResponse) {
    store.set('token', Dados.TokenDeSeguranca);

    this.clienteService.loadFoto();

    this.clienteService.PorCpf(store.get('cpf'))
      .map(data => <ApiResponse>data.json())
      .subscribe(
        data => this.onClientePorCpf(data),
        err => this.httpError.run(err, {
          title: this.R.R('alerta_error_cadastro_senha_titulo'),
          retryAction: () => this.submit()
        })
      );
  }

  onClientePorCpf({ Dados }: ApiResponse) {
    store.set('clienteId', Dados.ClienteId);
    store.set('usuarioId', Dados.UsuarioId);
    store.set('facebookUsuarioId', Dados.FacebookUsuarioId);

    this.clienteService.loadContas();

    if (Dados.FormasDePagamento && Dados.FormasDePagamento.length) {
      const cardId = Dados.FormasDePagamento[0].CartaoCreditoId;
      this.clienteService.loadCartaoDeCredito(cardId);
    }

    let { CPF } = Dados;
    if (CPF.length === 10) {
      CPF = '0' + CPF;
    }

    if (Dados.Tags && Dados.Tags.length) {
      this.modalService.open(ModalAdesivoPendenteComponent, {
        windowClass: 'modal-expandido modal-adesivo-pendente',
        size: 'lg'
      });
    }

    const cli = { ...Dados, CPF, Senha: this.password.value }
    if (!cli.Id) {
      cli.Id = store.get('clienteId');
    }
    store.set('cliente', cli);

    const pedido = store.get('pedido') || {};
    pedido.Cliente = cli;
    store.set('pedido', pedido);

    this.pedidoService
      .UltimoNaoFinalizado()
      .map(data => <ApiResponse>data.json())
      .subscribe(
        data => this.onPedidoNaoFinalizado(data),
        err => this.httpError.run(err),
      );
  }

  hasClient = () => !!store.get('clienteId');

  onPedidoNaoFinalizado({ Dados }: ApiResponse) {
    this.loadingService.destroy();
    this.registration.visible = true;

    this.routesFlow.data = Dados;

    if (!Dados && this.flow === 'login') {
      return this.routesFlow.go();
    }

    if (!Dados && this.hasClient() && this.flow === 'new') {
      this.createPedido();
    }

    if (!Dados && !this.hasClient()) {
      return this.criaClienteEUsuario();
    }

    this.pedidoService.atualizaCache(Dados);
    this.routesFlow.go();
  }

  criaUsuario() {
    this.loadingService.show();
    const usuario = this.clienteService.getCache();

    this
      .usuarioService
      .Cria({
        CPF: usuario.CPF,
        Nome: usuario.NomeCompleto,
        Email: usuario.Email,
        Senha: this.password.value,
        ClientId: store.get('clienteId'),
      })
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          store.set('usuarioId', Dados.UsuarioId);
          this
            .authenticationService
            .login(store.get('cpf'), this.password.value)
            .map(data => <ApiResponse>data.json())
            .subscribe(
              data => this.afterLogin(data.Dados.TokenDeSeguranca),
              err => this.httpError.run(err),
            );
        },
        err => this.httpError.run(err),
      );
  }

  criaClienteEUsuario() {
    this.loadingService.show();
    this.clienteService
      .CriaClienteEUsuario()
      .subscribe(
        () => this.afterLogin(),
        err => this.httpError.run(err),
        () => this.loadingService.destroy()
      );
  }

  atualizaClienteCriaUsuario() {
    this.criaUsuario();
  }

  afterLogin(token?: string) {
    if (token) {
      store.set('token', token);
    }

    if (this.createOnlyUser) {
      const cli = store.get('cliente');
      delete cli.Senha;

      if (!cli.Id) {
        cli.Id = store.get('clienteId');
      }

      this.clienteService.AtualizaOuCache(cli);

      const pedido = store.get('pedido') || {}
      if (!pedido.Cliente) {
        pedido.Cliente = cli;
        store.set('pedido', pedido);
      }
    }

    if (this.criaUsuarioLegado) {
      const cli = store.get('cliente');
      delete cli.Senha;

      if (!cli.Id) {
        cli.Id = store.get('clienteId');
      }

      this.clienteService.AtualizaOuCache(cli);
    }

    const notActivation = !(
      store.get('ativacao-offline') ||
      store.get('ativar-placa') &&
      store.get('ativar-adesivo')
    )

    if (notActivation) {
      this.createPedido();
    }

    this.loadingService.destroy();
    this.routesFlow.go();
  }

  ngAfterViewInit() {
    this.passwordInput.nativeElement.focus();
  }

  passwordToggle() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
  }

  submit(e?) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (this.disabled) {
      return;
    }

    const Senha = this.password.value;
    this.clienteService.setCache({ Senha });

    if (this.toLogin) {
      this.loadingService.show();

      return this.authenticationService
        .login(store.get('cpf').replace(/\D*/g, ''), Senha)
        .map(data => <ApiResponse>data.json())
        .subscribe(
          data => this.onLogin(data),
          err => this.httpError.run(err),
        );
    }

    if (!this.password.valid) {
      return;
    }

    if (this.fromOverview || this.persisted) {
      this.routesFlow.go();
      return;
    }

    this.createOnlyUser = (this.flow === 'tag' && !!store.get('clienteId') && !store.get('usuarioId') && !store.get('token'));
    if (this.createOnlyUser) {
      return this.criaUsuario();
    }

    this.criaUsuarioLegado = (this.flow === 'login-tag' && !!store.get('clienteId') && !store.get('usuarioId') && !store.get('token'));
    if (this.criaUsuarioLegado) {
      return this.atualizaClienteCriaUsuario();
    }

    this.gtmService.sendPageView('compra/crie-senha');
    this.criaClienteEUsuario();
  }
}
