import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from 'app/services/http.service';
import { ApiResponse } from 'app/models/api-response.model';
import * as store from 'store';
import ApiPaths from 'app/configs/api-paths';

@Injectable()
export class ContaService {
	/**
	 * [constructor description]
	 *
	 * @param {HttpService} private http [description]
	 */
  constructor(private http: HttpService) {}

  /**
   * [Lista description]
   *
   * @param {number = store.get('clienteId')} clienteId [description]
   */
  getAll(clienteId: number = store.get('clienteId')) {
    return this.http.get(ApiPaths.Get_ContaExtrato_Listar_Contas + clienteId)
  }

  /**
   * [getExtrato description]
   *
   * @param {number = store.get('clienteId')} clienteId [description]
   */
  getExtrato(options: any) {
    return this.http.post(ApiPaths.Post_ContaExtrato_Listar_Extratos, options);
  }

  /**
   * [postAdesaoPontoPonto description]
   * 
   * @param {any} options [description]
   */
  postAdesaoPontoPonto(options: any) {
    return this.http.post(ApiPaths.Post_AdesaoPontoPonto_Incluir_AdesaoPontoPonto, options);
  }
}
