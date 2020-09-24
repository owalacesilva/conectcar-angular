import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { RecursosService } from 'app/services/recursos.service';
import { FacebookService } from 'app/modules/registration/services/facebook.service';
import * as store from 'store';

@Component({
  selector: 'app-redes-sociais',
  templateUrl: './redes-sociais.component.html',
  styleUrls: ['./redes-sociais.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class RedesSociaisComponent implements AfterViewInit {

	private cliente: any;
	private facebookUsuarioId: string;
	private loading: boolean = false;

  constructor(
  	private R: RecursosService, 
  	private facebookService: FacebookService
  ) {
		this.cliente = store.get('cliente') || {};
  }

  ngAfterViewInit() {
		this.facebookService.initFacebook();
  }

  facebookLogin() {
  	this.loading = true;
    this.facebookService.loadAssociarFacebookLogin().subscribe(
      (data: any) => this.loading = false,
      (error: any) => alert('facebook login error')
    );
  }

  facebookLogout() {
  	this.loading = true;
    this.facebookService.loadDesassociarFacebookLogin().subscribe(
      (data: any) => this.loading = false,
      (error: any) => alert('facebook login error')
    );
  }

  facebookLoggedIn(): boolean {
    return !!store.get('facebookUsuarioId');
  }

  getFacebookUsuarioId() {
  	return store.get('facebookUsuarioId') || null;
  }
}
