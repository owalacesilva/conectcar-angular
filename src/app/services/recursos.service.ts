import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';

import { HttpService } from 'app/services/http.service';
import { ApiResponse } from 'app/models/api-response.model';
import ApiPaths from 'app/configs/api-paths';

import * as store from 'store';

@Injectable()
export class RecursosService {
  private cachedRecursos: any = {};
  private recursos = () => store.get('recursos') || [];

  constructor(private http: HttpService) {
    this.recursos().forEach(r =>
      this.cachedRecursos[r.Nome] = r);
  }

  Get(data: string = store.get('recursosData') || '01/01/2017') {
    return this.http.get(
      ApiPaths.Resource_Get + `?dispositivo=Web&projeto=SPA&idioma=Pt_Br&data=${data}`)
  }

  Load(cb?: Function) {
    const recursos = this.recursos();

    this
      .Get()
      .map(res => <ApiResponse>res.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          if (Dados && Dados.length) {
            const d = new Date();
            let day = d.getUTCDate().toString();
            if (day.length === 1) {
              day = `0${day}`;
            }

            let month: any = d.getMonth() + 1;
            if (month.toString().length === 1) {
              month = `0${month}`;
            }

            Dados[0].Recursos.forEach(recurso => {
              if (recursos.length < 1 || recursos.find(rec => rec.Nome !== recurso.Nome)) {
                recursos.push(recurso);
              }
            });

            store.set('recursosData', `${day}/${month}/${d.getFullYear()}`);
            store.set('recursos', recursos);

            this.recursos().forEach(r =>
              this.cachedRecursos[r.Nome] = r);
          }
        });
  }

  R(nome: string): string {
    const recurso = this.cachedRecursos[nome] || {};
    const recursoValor = recurso.Valor;

    if (typeof recursoValor !== 'string') {
      return '';
    }

    if (recursoValor.indexOf('*') === -1) {
      return recursoValor;
    }

    return recursoValor.replace(/(\*)(.*?)(\*)/,
      (m, p1, p2) => `<strong>${p2}</strong>`);
  }
}
