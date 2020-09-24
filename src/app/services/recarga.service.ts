import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from 'app/services/http.service';
import { ApiResponse } from 'app/models/api-response.model';
import * as store from 'store';
import ApiPaths from 'app/configs/api-paths';

@Injectable()
export class RecargaService {
  constructor(private http: HttpService) {}

  getAvulsas(codigoTipoConta: string) {
    return this.http.get(ApiPaths.Get_Recarga_Listar_Recarga_Avulsa_Por_Codigo_Tipo_Conta + codigoTipoConta);
  }

  post(data: any) {
    return this.http.post(ApiPaths.Post_Pedido_Recarga, data);
  }
}
