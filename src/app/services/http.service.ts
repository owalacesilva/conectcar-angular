import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import {
  Http,
  Headers,
  RequestOptionsArgs,
  Response,
  RequestMethod,
  RequestOptions,
  XHRBackend,
} from '@angular/http';
import { DialogService } from 'app/services/dialog.service';
import { LoadingService } from 'app/services/loading.service';
import { ApiResponse } from 'app/models/api-response.model';

import { environment } from 'environments/environment';
import * as store from 'store';

@Injectable()
export class HttpService extends Http {
  constructor (backend: XHRBackend, options: RequestOptions) {
    super(backend, options);
  }

  request(url: any, options?: RequestOptionsArgs): Observable<Response> {
    options = options || {};

    if (!options.headers) {
      options.headers = new Headers();
    }

    const token = store.get('token');
    if (token) {
      options.headers.set('Authorization', `Bearer ${token}`);
    }

    if (environment.api.headers) {
      environment.api.headers.forEach(header =>
        options.headers.append(header.key, header.value));
    }

    if (typeof url === 'string' && url[0] === '/' && environment.api.host) {
      url = `${environment.api.host}${url}`;
    }

    if (typeof url !== 'string') {
      url.url = `${environment.api.host}${url.url}`
      url.options = options
    }

    return super
    .request(url, options)
    .retry(environment.api.retryTimes)
    .catch((err: Response): Observable<Response> => {
      if (err.status === 401) {
        console.warn('forbidden, logging out');
        'token clienteId usuarioId'.split(' ').forEach(s => store.remove(s));
        window.location.pathname = '/';
      }

      if (err.status === 0)   { console.warn('no connection'); }
      if (err.status === 500) { console.warn('server error');  }

      return Observable.throw(err);
    });
  }

  get(url: any, options?: RequestOptionsArgs): Observable<Response> {
    options = options || {};
    options.method = 'GET';
    return this.request(url, options);
  }

  post(url: any, body: any, options?: RequestOptionsArgs): Observable<Response> {
    options = options || {};
    options.method = 'POST';
    options.body = body;
    return this.request(url, options);
  }

  put(url: any, body: any, options?: RequestOptionsArgs): Observable<Response> {
    options = options || {};
    options.method = 'PUT';
    options.body = body;
    return this.request(url, options);
  }
}

@Injectable()
export class HttpError {
  constructor(
    private dialogService: DialogService,
    private loadingService: LoadingService,
  ) {}

  run(err: any, data: any = {}) {
    if (!data.title) {
      data.title = 'Houve um erro';
    }

    let body = null;

    try {
      body = <ApiResponse>err.json();
    } catch (e) {
      console.warn(e);
    }

    const msg = (body && body.Notificacoes && body.Notificacoes.length) ? body.Notificacoes[0] : 'Erro';
    if (!data.subtitle) {
      data.subtitle = msg;
    }

    if (err.status === 0 || err.status === 500) {
      data.subtitle = 'Tente novamente';

      if (!data.retryLabel) {
        data.retryLabel = 'Houve um erro';
      }

      if (!data.retryAction) {
        data.retryAction = () => null;
      }
    }

    this.dialogService.showAlert(data);
    this.loadingService.destroy();
  }
};
