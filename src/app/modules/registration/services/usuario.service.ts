import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';

import { HttpService } from 'app/services/http.service';
import { ApiResponse } from 'app/models/api-response.model';

import { IUsuario, Usuario } from 'app/modules/registration/models/usuario.model';
import { Cadastro } from 'app/modules/registration/models/cadastro.model';
import * as store from 'store';
import ApiPaths from 'app/configs/api-paths';

@Injectable()
export class UsuarioService {
  constructor(
    private http: HttpService,
    private store: Store<Usuario>,
    private fbStore: Store<Cadastro>) {}

  setCache(usuario: IUsuario) {
    const data = Object.assign({}, this.getCache(), usuario);
    store.set('usuario', data);
  }

  getCache(): IUsuario {
    return store.get('usuario');
  }

  Cria(data: Usuario): Observable<Response> {
    return this.http.post(
      ApiPaths.Post_Usuarios_Incluir_Usuario, data);
  }
}
