import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';

import { HttpService } from 'app/services/http.service';
import { ApiResponse } from 'app/models/api-response.model';
import ApiPaths from 'app/configs/api-paths';

import * as store from 'store';

@Injectable()
export class FeatureToggleService {
  constructor(
    private http: HttpService,
    private router: Router,
  ) {}

  featureToggle = () => store.get('featureToggle') || [];

  Get() {
    return this.http.get(ApiPaths.FeatureToggle_Get + `?dispositivo=Web`)
  }

  Load() {
    const featureToggle = this.featureToggle();

    this
      .Get()
      .map(res => <ApiResponse>res.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          if (Dados && Dados.length) {
            store.set('featureToggle', Dados);
          }
        });
  }

  Find(modulo, chave: string) {
    const list = this.featureToggle();
    if (list.length === 0) {
      return {};
    }

    const mod = list.find(data => data.Modulo === modulo) || {};
    const rec = mod.Recursos || [];
    return mod.Recursos.find(data => data.Chave === chave);
  }

  Check(modulo, chave: string): boolean {
    const feature = this.Find(modulo, chave);

    if (!feature || feature.Habilitado === undefined) {
      return false;
    }

    if (!feature.Habilitado) {
      this.router.navigate(['/area-indisponivel']);
    }

    return !feature.Habilitado;
  }
}
