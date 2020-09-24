import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AuthenticationService } from 'app/modules/registration/services//authentication.service';
import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { RegistrationComponent } from 'app/modules/registration/registration.component';
import { RecursosService } from 'app/services/recursos.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';

import { CustomValidators } from 'app/validators';
import { Masks } from 'app/masks';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as store from 'store';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.less']
})
export class AuthenticationComponent implements AfterViewInit, OnInit {
  @ViewChild('cpfInput') cpfInput: ElementRef;
  mask = Masks.cpf;
  cpf = new FormControl('', [CustomValidators.cpf]);
  ativacaoOffline = false
  showValidation = false
  loading = false
  isLogin = false
  path = ''

  @Output() legalterms: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private facebookService: FacebookService,
    private clienteService: ClienteService,
    private authenticationService: AuthenticationService,
    private registration: RegistrationComponent,
    private router: Router,
    private route: ActivatedRoute,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService
  ) {
    this.route.url.subscribe(url => {
      this.path = url[0].path;
      this.isLogin = this.path === 'login'
      this.ativacaoOffline = this.path === 'ativar';
      store.set('ativacao-offline', !!this.ativacaoOffline);
      this.registration.visible = !this.isLogin;
    });
  }

  ngOnInit() {
    if (this.isLogin) {
      this.registration.bgcontent  = 'image7';
      this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_bem_vindo_de_volta') + "</h1><p>" + this.R.R('sidebar_desc_acesse_seu_extrato_simplificado') + "</p>";
    } else {
      this.registration.bgcontent  = 'image5';
      this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_seja_bem_vindo_conectcar') + "</h1><p>" + this.R.R('sidebar_desc_em_alguns_passos') + "</p>";
    }
  }

  facebookLoggedIn(): boolean {
    return !!store.get('fb:token');
  }

  open(content) {
    this.modalService.open(content);
  }

  ngAfterViewInit() {
    this.facebookService.initFacebook();
    this.gtmService.sendPageView();
  }

  facebookLogin(e) {
    this.facebookService.loadFacebookLogin();
  }

  onChange(e) {
    e.preventDefault();

    const cleanCpf = this.cpf.value.replace(/[^\d]/g, '');
    this.showValidation = cleanCpf.length === 11;

    if (!this.cpf.valid) {
      return;
    }

    this.loading = true;
    this.clienteService.loadValidaCpf(cleanCpf, this.path);
		this.gtmService.setDataLayer('konduto_customer_id', cleanCpf);
  }

  back(e) {
    e.stopPropagation();
    e.preventDefault();
    history.back();
  }

  submit(e) {
    this.onChange(e);
  }

  openTerms() {
    this.legalterms.emit();
  }

  openPlans() {
    this.router.navigate(['/planos']);
  }
}
