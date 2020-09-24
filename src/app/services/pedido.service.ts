import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';

import { DialogService } from 'app/services/dialog.service';
import { HttpService } from 'app/services/http.service';
import { ApiResponse } from 'app/models/api-response.model';
import * as store from 'store';
import ApiPaths from 'app/configs/api-paths';

import {
  Pedido,
  Endereco,
  Veiculo as veiculo,
  FormaDeEnvio as formaDeEnvio,
  Pagamento as pagamento,
  Produto as produto,
} from 'app/modules/registration/models/pedido.model';

@Injectable()
export class PedidoService {
  constructor(private http: HttpService) {}

  UltimoNaoFinalizado(cpf = store.get('cpf')) {
    return this.http.get(ApiPaths.Get_Pedido_Obter_Ultimo_Pedido_Nao_Finalizado + `${cpf}/obterultimonaofinalizado`)
  }

  Lista(clienteId = store.get('clienteId')) {
    return this.http.get(ApiPaths.Get_Pedido_Listar_Pedidos_Pendentes_Entregues + clienteId)
  }

  Cria(pedido: Pedido) {
    const newPedido = this.atualizaCache(pedido);
    this.http.post(ApiPaths.Post_Pedido_Incluir_Pedido, newPedido)
      .map(res => <ApiResponse>res.json())
      .subscribe(
        ({ Dados }: ApiResponse) => this.atualizaCache({ Id: Dados.TokenPedido }),
        err => console.warn(err),
      );
  }

  atualizaCache(pedido: Pedido): Pedido {
    const oldPedido = store.get('pedido') || {};
    const newPedido = Object.assign({}, oldPedido, pedido);
    store.set('pedido', newPedido);
    return newPedido
  }

  Atualiza(pedido: Pedido, cb = () => null) {
    const newPedido = this.atualizaCache(pedido);
    if (!newPedido.Id) {
      this.Cria(pedido);
      return;
    }

    this.http.put(ApiPaths.Put_Pedido_Alterar_Pedido, newPedido)
      .map(res => <ApiResponse>res.json())
      .subscribe(
        ({ Dados }: ApiResponse) => cb,
        err => console.warn(err),
      );
  }

  AtualizaFormaDeEnvio = (FormaDeEnvio: formaDeEnvio, cb?) => this.Atualiza({ FormaDeEnvio }, cb)
  AtualizaVeiculos     = (Veiculos: veiculo[],        cb?) => this.Atualiza({ Veiculos },     cb);
  AtualizaEnderecos    = (Enderecos: Endereco[],      cb?) => this.Atualiza({ Enderecos },    cb);
  AtualizaProduto      = (Produto: produto,           cb?) => this.Atualiza({ Produto },      cb);

  ProcessaPedido(Pagamento: pagamento): Observable<Response> {
    const newPedido = this.atualizaCache({ Pagamento }) || {};
    // console.log('- processa pedido:', newPedido);
    newPedido.IdPedidoSession = newPedido.Id;
    newPedido.DeviceFingerPrint = 'test';
    delete newPedido.Id;

    const cli = store.get('cliente') || {};
    if (!newPedido.Cliente.DDD && cli.DddCelular) {
      newPedido.Cliente.DDD = cli.DddCelular;
      delete cli.DddCelular;
    }

    const cupom = store.get('cupom');
    if (!!cupom) {
      newPedido.CodigoCupom = cupom;
    }

    if (!newPedido.DeviceFingerPrint) {
      newPedido.DeviceFingerPrint = store.get('fingerprint');
    }

    // TODO
    const tokenCartaoDeCredito = store.get('tokenCartaoDeCredito');
    if (!Pagamento.CartaoDeCredito && tokenCartaoDeCredito) {
      newPedido.Pagamento.TokenCartao = tokenCartaoDeCredito;
    }

    return this.http.post(ApiPaths.Post_Pedido_Processar_Pedido, newPedido);
  }

  CheckCupomViaBin(bin) {
    const data = `?bin=${bin}&canalAquisicao=Web`
    return this.http.get(ApiPaths.Get_Cartao_Obter_Cartao_Por_Bin_E_Canal + data);
  }
}
