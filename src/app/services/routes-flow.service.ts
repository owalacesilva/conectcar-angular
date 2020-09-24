import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationProgress } from 'app/modules/registration/models/registration-progress';
import { PlatformLocation } from '@angular/common'
import Routes from 'app/configs/routes';
import * as store from 'store';

@Injectable()
export class RoutesFlowService {
  private gotoOverview = false;
  public current: string;
  public data: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: PlatformLocation,
  ) {
    this.current = `/${this.route.snapshot.firstChild.url.join('/')}`;
    location.onPopState(() => {
      this.current = this.prev();
      this.checkProgress();
    });

    this.route.queryParams.subscribe(params => {
      this.gotoOverview = (params.r === '' || !!params.r);
    });

    this.checkProgress();
  }

  get flow(): string {
    return store.get('cpf-status');
  }

  get ativacaoOffline(): boolean {
    return !!store.get('ativacao-offline');
  }

  pedidosRoutes(): string[] {
    if (this.gotoOverview && this.current === '/comprar/eixo') {
      return [
        Routes.comprarPlaca,
        Routes.comprarEixo,
        Routes.comprarResumo,
        Routes.comprarPagamento,
      ];
    }

    if (this.gotoOverview) {
      return [
        Routes.comprarResumo,
        Routes.comprarPagamento,
      ];
    }

    const routes = [];

    if (!this.data || !this.data.Enderecos || this.data.Enderecos.length < 1) {
      routes.push(Routes.comprarEndereco);
    }

    if (this.ativacaoOffline) {
      routes.push(...[
        Routes.ativarPlacaEixo,
        Routes.ativarAdesivo,
        Routes.ativarConfirmar,

        // como funciona
        Routes.ativarComoFunciona1,
        Routes.ativarComoFunciona2,
        Routes.ativarComoFunciona3,

        // escolher planos
        Routes.ativarPlanos,
      ]);
    } else {
      if (!this.data || !this.data.Veiculos || this.data.Veiculos.length < 1) {
        routes.push(Routes.comprarPlaca);
        routes.push(Routes.comprarEixo);
      }
    }

    routes.push(...[
      Routes.comprarCredito,
      Routes.comprarResumo,
      Routes.comprarPagamento,
    ]);

    return routes;
  }

  routes() {
    const urls = [];
    if (this.ativacaoOffline) {
      urls.push(Routes.ativarCuidados);
    }

    if (this.flow === 'new') {
      return [
        ...urls,
        Routes.cadastroSenha,
        ...this.pedidosRoutes(),
      ];
    }

    if (this.flow === 'login-via-app') {
      return [
        Routes.ativarPlanos,
        Routes.comprarEndereco,
        Routes.comprarPlaca,
        Routes.comprarEixo,
        Routes.comprarCredito,
        Routes.comprarResumo,
        Routes.comprarPagamento,
      ];
    }

    if (this.flow === 'login') {
      return [
        ...urls,
        Routes.loginSenha,
        Routes.extrato,
      ];
    }

    if (this.flow === 'tag') {
      return [
        ...urls,
        Routes.loginPlaca,
        Routes.loginAdesivo,
        Routes.cadastroNome,
        Routes.cadastroEmail,
        Routes.cadastroCelular,
        Routes.cadastroNascimento,
        Routes.cadastroSenha,
        ...this.pedidosRoutes(),
      ];
    }

    if (this.flow === 'login-tag') {
      return [
        ...urls,
        Routes.loginPlaca,
        Routes.loginAdesivo,
        Routes.cadastroNome,
        Routes.cadastroEmail,
        Routes.cadastroCelular,
        Routes.cadastroNascimento,
        Routes.cadastroSenha,
        Routes.extrato,
      ];
    }
    if (this.flow === 'signup') {
      return [
        ...urls,
        Routes.cadastroNome,
        Routes.cadastroEmail,
        Routes.cadastroCelular,
        Routes.cadastroNascimento,
        Routes.cadastroSenha,
        ...this.pedidosRoutes(),
      ];
    }
  }

  checkProgress() {
    if (!this.current) {
      return;
    }

    const profile = [];
    const delivery = ['endereco'];
    const vehicle = [];
    const payment = [];

    if (this.ativacaoOffline) {
      profile.push(...[
        'cuidados',
      ]);
    }

    if (['new', 'signup', 'tag'].indexOf(this.flow) > -1) {
      profile.push(...[
        'cpf',
      ]);
    }

    if (this.flow !== 'new' && this.flow !== 'login') {
      profile.push(...[
        'nome',
        'email',
        'celular',
        'nascimento'
      ]);
    }
    profile.push('senha');

    if (this.ativacaoOffline) {
      payment.push(...[
        'placa-eixo',
        'adesivo',
        'confirmar-placa-adesivo',
        'como-funciona-conta-conectcar',
        'como-funciona-credito-automatico',
        'como-funciona-saldo-conta-conectcar',
        'como-funciona-saldo-conta-conectcar',
        'planos',
      ]);
    } else {
      vehicle.push(...[
        'placa',
        'eixo'
      ]);
    }

    payment.push(...[
      'credito',
      'resumo',
      'pagamento'
    ]);

    const all = [
      ...profile,
      ...delivery,
      ...vehicle,
      ...payment
    ];

    const pos = all.findIndex(step => this.current.indexOf(step) > -1);
    if (pos < 0) {
      return RegistrationProgress.clear();
    }

    if (pos <= profile.length - 1) {
      const count = 1.0 / profile.length;
      const prog = count * profile.findIndex(step => this.current.indexOf(step) > -1);
      RegistrationProgress.profileProgress = prog || count;
      return;
    }

    if (pos <= profile.length + delivery.length - 1) {
      const count = 1.0 / delivery.length;
      RegistrationProgress.profileProgress = 1;
      RegistrationProgress.deliveryProgress = count * delivery.findIndex(step => this.current.indexOf(step) > -1);
      return;
    }

    if (pos <= profile.length + delivery.length + vehicle.length - 1) {
      const count = 1.0 / vehicle.length;
      RegistrationProgress.profileProgress = 1;
      RegistrationProgress.deliveryProgress = 1;
      RegistrationProgress.vehicleProgress = count * vehicle.findIndex(step => this.current.indexOf(step) > -1);
      return;
    }

    if (pos <= profile.length + delivery.length + vehicle.length + payment.length - 1) {
      const count = 1.0 / payment.length;
      RegistrationProgress.profileProgress = 1;
      RegistrationProgress.deliveryProgress = 1;
      RegistrationProgress.vehicleProgress = 1;
      RegistrationProgress.paymentProgress = count * payment.findIndex(step => this.current.indexOf(step) > -1);
      return;
    }
  }

  prev() {
    const routes = this.routes();
    if (!routes) {
      return;
    }
    const i = routes.indexOf(this.current) - 1;
    if (i >= 0 && routes[i]) {
      return routes[i];
    }
  }

  next() {
    const routes = this.routes();
    if (!routes) {
      return;
    }
    const i = routes.indexOf(this.current) + 1;
    if (routes[i]) {
      return routes[i];
    }
  }

  go(setOverviewParam = false, to = null) {
    if (this.gotoOverview && this.prev() === Routes.comprarResumo) {
      this.current = this.prev();
      history.back();
      return;
    }

    let url = null;
    const i = this.routes().indexOf(to);
    if (to !== null && i > -1) {
      url = this.routes()[i];
    }

    const data: any = {};
    if (setOverviewParam) {
      data.queryParams = { r: '' };
    }
    this.current = url || this.next();
    this.router.navigate([this.current], data);
    this.checkProgress();
  }
}
