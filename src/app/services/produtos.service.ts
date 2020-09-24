import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { HttpService } from 'app/services/http.service';
import { ApiResponse } from '../models/api-response.model';
import { Produto } from '../models/produto.model';
import { LOADED } from '../reducers/produtos.reducer';
import ApiPaths from 'app/configs/api-paths';

import * as localStore from 'store';

@Injectable()
export class ProdutosService {
  constructor(
    private http: HttpService,
    private store: Store<Produto>,
  ) {}

  // busca por planos e adiciona o item com id na localStorage
  setPlanoSelecionado(id: string) {
    return this
      .Lista()
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          localStore.set('produtos', Dados);
          const plano = Dados.find(p => p.Id === id);
          localStore.set('planoSelecionado', plano);
        }
      )
  }

  Lista(cupom?: string): Observable<Response> {
    const url = !!cupom ?
    (ApiPaths.Get_Produtos_Com_Campanha_Por_Cupom + cupom) :
    ApiPaths.Get_Produtos_Com_Campanha_Por_Filtros;
    return this.http.get(url);
  }

  loadLista(cupom?: string) {
    const produtos = localStore.get('produtos') || [];
    if (produtos.length) {
      this.store.dispatch({ type: LOADED, payload: produtos });
    }

    return this
      .Lista(cupom)
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          const payload = <Produto[]>Dados;
          localStore.set('produtos', Dados);
          this.store.dispatch({ type: LOADED, payload });
        }
      )
  }
}
