import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { HttpService } from 'app/services/http.service';
import { ApiResponse } from 'app/models/api-response.model';

import { Carro } from '../models/carro.model';
import * as store from 'store';
import ApiPaths from 'app/configs/api-paths';

@Injectable()
export class PlacaService {
  constructor(
    private http: HttpService,
    private store: Store<Carro>,
  ) {}

  Categorias(): Observable<Response> {
    return this.http.get(ApiPaths.Get_Veiculo_Listar_Categoria)
  }

  loadCategorias() {
    this.Categorias()
    .map(cars => <ApiResponse>cars.json())
    .subscribe(({ Dados }: ApiResponse) =>
      store.set('categorias', Dados));
  }

  porPlaca(placa: string): Observable<Response> {
    return this.http.get(ApiPaths.Get_Ativacao_Validar_Placa_Ativa + placa)
  }
}
