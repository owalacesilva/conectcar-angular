import { Component, AfterViewInit, OnInit, ViewEncapsulation } from '@angular/core';
import { RecursosService } from 'app/services/recursos.service';
import { RegistrationComponent } from './../../registration.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import * as store from 'store';

@Component({
  selector: 'app-registration-cuidados',
  templateUrl: './cuidados.component.html',
  styleUrls: ['./cuidados.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CuidadosComponent implements AfterViewInit, OnInit {

  private isLogin = false;
  private path    = '';

  /**
   * [constructor description]
   *
   * @param {RecursosService} private R [description]
   */
  constructor(
    private R: RecursosService,
    private registration: RegistrationComponent,
    private route: ActivatedRoute,
    private routesFlow: RoutesFlowService,
    private store: Store<any>) {

    this.route.url.subscribe(url => {
      this.path                 = url[0].path;
      this.isLogin              = this.path === 'login'
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

  ngAfterViewInit() { }

  back(e) {
    history.back();
    e.stopPropagation();
    e.preventDefault();
  }

  submit(e?) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.routesFlow.go();
  }
}
