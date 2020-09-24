import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import {
  FacebookService as FBService,
  LoginResponse,
  LoginOptions,
  InitParams
} from 'ngx-facebook';

import { environment } from 'environments/environment'
import { LOGIN } from 'app/modules/registration/reducers/authentication.reducer';
import { AuthenticationService } from 'app/modules/registration/services/authentication.service';
import * as store from 'store';

@Injectable()
export class FacebookService {
  constructor(
    private authService: AuthenticationService,
    private facebookService: FBService,
    private store: Store<any>) {}

  initFacebook() {
    const initParams: InitParams = {
      appId: environment.facebook.appId,
      xfbml: true,
      version: 'v2.9'
    };
    this.facebookService.init(initParams);
  }

  facebookLogin(): Observable<LoginResponse> {
    const options: LoginOptions = {
      scope: 'public_profile,email,user_birthday',
      enable_profile_selector: true,
      return_scopes: true,
    };

    return Observable.fromPromise(this.facebookService.login(options))
  }

  facebookLogout(): Observable<LoginResponse> {
    return Observable.fromPromise(this.facebookService.logout())
  }

  onFacebookLoginLoaded(data) {
    store.set('fb:userId', data.authResponse.userID)
    store.set('fb:token', data.authResponse.accessToken)

    this.authService
      .loadFacebookLogin(
        data.authResponse.userID,
        data.authResponse.accessToken);
  }

  onAssociarFacebookLoginLoaded(data) {
    store.set('fb:userId', data.authResponse.userID);
    store.set('fb:token', data.authResponse.accessToken);
  	const userId = store.get('usuarioId');

    this.authService
      .loadAssociarFacebookLogin(
      	userId,
        data.authResponse.userID,
        data.authResponse.accessToken);      
  }

  onDesassociarFacebookLoginLoaded(data) {
  	const clienteId = store.get('clienteId');
    this.authService.loadDesassociarFacebookLogin(clienteId);    
  }

  loadFacebookLogin() {
    this.facebookLogin().subscribe(
      (data: LoginResponse) => this.onFacebookLoginLoaded(data),
      (error: any) => alert('facebook login error')
    );
  }

  /**
   * [loadAssociarFacebookLogin description]
   */
  loadAssociarFacebookLogin(): Observable<LoginResponse> {
    return this.facebookLogin().do(
      (data: LoginResponse) => this.onAssociarFacebookLoginLoaded(data)
    );
  }

  loadDesassociarFacebookLogin() {
    /*this.facebookLogout().subscribe(
      (data: LoginResponse) => this.onDesassociarFacebookLoginLoaded(data),
      (error: any) => alert('facebook login error')
    );*/

  	const clienteId = store.get('clienteId');
    return this.authService.loadDesassociarFacebookLogin(clienteId);    
  }
}
