import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';

import { DialogService } from 'app/services/dialog.service';
import { HttpService } from 'app/services/http.service';
import { ApiResponse } from 'app/models/api-response.model';

import { Operadores, Agendamento } from 'app/modules/registration/models/agendamento.model';
import ApiPaths from 'app/configs/api-paths';
import * as store from 'store';

@Injectable()
export class AgendamentoService {
  constructor(
    private http: HttpService,
    private store1: Store<Operadores>,
    private store2: Store<Agendamento>,
    private agendamento: Agendamento) {}

  Salva(agendamento: Agendamento): Observable<Response> {
    return this.http.post(ApiPaths.Post_Entrega_Agendamento, agendamento)
  }

  loadSalva(agendamento: Agendamento) {
    this.Salva(agendamento)
      .map(data => <ApiResponse>data.json())
      .subscribe(({ Dados }: ApiResponse) =>
        store.set('agendamento', Dados));
  }

  DiasUteis(cep: string): Observable<Response> {
    return this.http.get(ApiPaths.Get_Entrega_Retorno_Dias_Uteis + cep)
  }

  AgendamentosPorCep(cep: string): Observable<Response> {
    return this.http.get(ApiPaths.Get_Entrega_Retorno_Agendamento + cep)
  }
}
