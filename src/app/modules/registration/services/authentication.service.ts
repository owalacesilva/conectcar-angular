import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { FacebookService as FBService } from 'ngx-facebook';

import { environment } from 'environments/environment'

import { CPF_STATUS, LOGIN, LOGOUT } from 'app/modules/registration/reducers/authentication.reducer';
import { PedidoService } from 'app/services/pedido.service'
import { UsuarioService } from 'app/modules/registration/services/usuario.service'
import { RecursosService } from 'app/services/recursos.service';
import { LoadingService } from 'app/services/loading.service';
import { HttpService } from 'app/services/http.service';
import { ApiResponse } from 'app/models/api-response.model';
import * as store from 'store';

import ApiPaths from 'app/configs/api-paths';

@Injectable()
export class AuthenticationService {
  constructor(
    private loadingService: LoadingService,
    private facebookService: FBService,
    private pedidoService: PedidoService,
    private router: Router,
    private http: HttpService,
    private recursos: RecursosService,
    private store: Store<any>,
  ) {}

  logout() {
    store.clearAll();
    this.store.dispatch({ type: LOGOUT });
    setTimeout(() => this.recursos.Load(), 1000);
  }

  login(Cpf, Senha: string): Observable<Response> {
    return this.http.post(ApiPaths.Post_Autenticacoes_Logar_Usuario, { Cpf, Senha });
  }

  loadLogin(password, cpf = store.get('cpf')) {
    this.login(cpf, password)
      .map(data => <ApiResponse>data.json())
      .subscribe(({ Dados }: ApiResponse) => {
        store.set('token', Dados.TokenDeSeguranca);
        this.store.dispatch({ type: LOGIN, payload: Dados });
        this.store.dispatch(go(['/pedidos']));
      })
  }

  loadLogout() {
    this.logout()
    this.store.dispatch(go(['/']));
  }

  facebookLogin(fbUserId, fbToken: string): Observable<Response> {
    const data = {
      UsuarioIDFacebook: fbUserId,
      TokenDeAcessoFacebook: fbToken,
    }
    return this.http.post(ApiPaths.Post_Autenticacoes_Logar_Com_Facebook, data)
  }

  associarFacebookLogin(userId, fbUserId, fbToken: string): Observable<Response> {
    const data = {
      UsuarioIdFacebook: fbUserId,
      UsuarioId: userId,
      TokenDeAcessoFacebook: fbToken,
    }
    return this.http.post(ApiPaths.Post_Usuarios_Associar_Usuario_Facebook, data)
  }

  desassociarFacebookLogin(clienteId: any): Observable<Response> {
    const data = {
      ClienteId: clienteId
    }
    return this.http.post(ApiPaths.Post_Usuarios_Desassociar_Usuario_Facebook, data)
  }

  loadFacebookLogin(fbUserId, fbToken: string) {
    this.facebookLogin(fbUserId, fbToken)
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          store.set('token', Dados.Token);
          store.set('usuarioId', Dados.UsuarioId);

          this.facebookService.api('me?fields=email,name,birthday')
            .then(me => {
              const data = {
                NomeCompleto: me.name,
                Email: me.email,
                DataDeNascimento: null,
              };

              if (me.birthday) {
                const birthday = me.birthday.split('/');
                data.DataDeNascimento = `${birthday[1]}/${birthday[0]}/${birthday[2]}`;
              }

              store.set('cliente', data);
            })
            .catch(e => console.log('facebook data error'))
        },
        err => { // signup
          this.facebookService.api('me')
          .then(me => console.log(me))
          .catch(e => console.log('facebook /me'))
        },
      );
  }

  loadAssociarFacebookLogin(userId, fbUserId, fbToken: string) {
    this.associarFacebookLogin(userId, fbUserId, fbToken)
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {

        	if( Dados.Sucesso == true ) {
				    store.set('facebookUsuarioId', fbUserId);
				    store.set('fb:token', fbToken);
				    store.set('fb:userId', fbUserId);
        	} else {
        		console.log('facebook error');
        	}
        },
        err => { // signup
          console.log('facebook exception');
        },
      );
  }

  loadDesassociarFacebookLogin(clienteId) {
    return this.desassociarFacebookLogin(clienteId)
      .map(data => <ApiResponse>data.json())
      .do(
        ({ Dados }: ApiResponse) => {

        	if( Dados.Sucesso == true ) {
        		// Apaga facebook usuario di
				    store.remove('facebookUsuarioId');
				    store.remove('fb:token');
				    store.remove('fb:userId');
        	} else {
        		console.log('facebook error');
        	}
        },
        err => { // signup
          console.log('facebook exception');
        },
      );
  }

  ObterDadosRecuperarSenha(CPF: string = store.get('cpf')) {
    return this.http.get(ApiPaths.Post_Usuarios_Obter_Dados_Recuperar_Senha_Cliente_CPF + CPF);
  }

  SalvarFormaRecebimentoSenha(CPF: string = store.get('cpf'), FormaDeRecebimento: string = 'Email') {
    return this.http.post(
      ApiPaths.Post_Usuarios_Associar_Obter_Dados_Recuperar_Senha,
      { CPF, FormaDeRecebimento }
    );
  }

  ValidaRecuperarSenha(CPF: string = store.get('cpf'), Chave: string) {
    return this.http.post(
      ApiPaths.Post_Usuarios_Validar_Recuperar_Senha_Email_SMS,
      { CPF, Chave }
    );
  }

  AlterarSenha(CPF: string = store.get('cpf'), Chave: string, NovaSenha: string) {
    return this.http.put(
      ApiPaths.Post_Usuarios_Alterar_Senha_Email_SMS,
      { CPF, Chave, NovaSenha }
    );
  }

  RevalidarToken(token: string) {
    store.set('token', token);
    return this.http.get(ApiPaths.Get_Autenticacoes_Revalidar_Token);
  }
}
