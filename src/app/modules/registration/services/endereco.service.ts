import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from 'app/services/http.service';
import ApiPaths from 'app/configs/api-paths';

@Injectable()
export class EnderecoService {
  constructor(private http: HttpService) {}

  EnderecoPorCep(CEP: string): Observable<Response> {
    return this.http.get(ApiPaths.Get_Endereco_Obter_Endereco_Por_CEP + CEP);
  }

  Estados(): Observable<Response> {
    return this.http.get(ApiPaths.Get_Estado_Listar_Estado);
  }

  CidadesPorEstado(Estado = 'SP'): Observable<Response> {
    return this.http.get(ApiPaths.Get_Cidade_Listar_Cidade_Por_Estado + Estado);
  }
}
