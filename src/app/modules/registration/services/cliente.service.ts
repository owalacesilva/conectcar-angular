import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs } from '@angular/http';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';

import { environment } from 'environments/environment';
import { ApiResponse } from 'app/models/api-response.model';

import { RoutesFlowService } from 'app/services/routes-flow.service';
import { HttpService } from 'app/services/http.service';
import { DialogService } from 'app/services/dialog.service';
import { UsuarioService } from 'app/modules/registration/services/usuario.service';
import { PedidoService } from 'app/services/pedido.service';
import { AuthenticationService } from 'app/modules/registration/services/authentication.service';
import { ICliente, Cliente } from 'app/modules/registration/models/cliente.model';
import { Endereco } from 'app/modules/registration/models/pedido.model';
import * as store from 'store';

import ApiPaths from 'app/configs/api-paths';

@Injectable()
export class ClienteService {
  constructor(
    private httpClient: HttpClient,
    private http: HttpService,
    private usuarioService: UsuarioService,
    private pedidoService: PedidoService,
    private dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private routesFlow: RoutesFlowService,
    private store: Store<any>,
  ) {}

  PorCpf(cpf: string = store.get('cpf')): Observable<Response> {
    return this.http.get(ApiPaths.Get_Cliente_Obter_Cliente_Por_CPF + cpf);
  }

  loadPorCpf(cpf?: string) {
    this.PorCpf(cpf)
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          store.set('clienteId', Dados.ClienteId)
          store.set('usuarioId', Dados.UsuarioId)
          if (Dados.FormasDePagamento && Dados.FormasDePagamento.length) {
            this.loadCartaoDeCredito(Dados.FormasDePagamento[0].CartaoCreditoId);
          }
        }
      );
  }

  Cria(cliente: Cliente): Observable<Response> {
    return this.http.post(ApiPaths.Post_Cliente_Incluir_Cliente, cliente);
  }

  Atualiza(cliente: Cliente): Observable<Response> {
    return this.http.put(ApiPaths.Put_Cliente_Alterar_Cliente, cliente);
  }

  ValidaCpf(cpf: string): Observable<Response> {
    return this.http.get(ApiPaths.Get_Cliente_Obter_Usuario_Por_CPF + cpf.replace(/[^\d]*/g, ''))
  }

  loadValidaCpf(CPF: string, origin?: string) {
    this.ValidaCpf(CPF)
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          store.remove('usuarioId');
          store.remove('clienteId');
          store.remove('cliente');
          store.set('cpf', CPF);
          this.setCache({ CPF });

          if (!Dados.EhCadastrado && origin === 'login') {
            return this.store.dispatch(go('/login/cpf-nao-encontrado'));
          }

          let status = null;
          if (!Dados.EhCadastrado) {
            status = 'signup';
          }

          if (Dados.EhCadastrado && Dados.EhUsuario && origin === 'login-via-app') {
            status = 'login-via-app'
          }

          if (Dados.EhCadastrado && Dados.EhUsuario) {
            status = 'login';
          }

          if (Dados.EhCadastrado && Dados.EhUsuario && origin === 'cadastro' && store.get('planoSelecionado')) {
            status = 'new';
          }

          if (Dados.EhCadastrado && !Dados.EhUsuario && Dados.PossuiTagAtiva) {
            status = 'tag';
          }

          if (Dados.EhCadastrado && !Dados.EhUsuario && Dados.PossuiTagAtiva && origin === 'login') {
            status = 'login-tag';
          }

          store.set('ativacao-offline', origin === 'ativar');
          store.set('cpf-status', status);
          return this.routesFlow.go();
        },
        (err) => {
          let body = null;
          try {
            body = <ApiResponse>err.json();
          } catch (e) { console.warn(e); }
          const msg = (body && body.Notificacoes && body.Notificacoes.length) ? body.Notificacoes[0] : 'Tente novamente';
          this.dialogService.showAlert({
            title: 'Ocorreu um problema',
            subtitle: msg,
            retryLabel: 'tente novamente',
            retryAction: () => this.loadValidaCpf(CPF)
          });
        }
      )
  }

  CriaClienteEUsuario(cliente: Cliente = this.getCache()): Observable<Response> {
    const senha = cliente.Senha;
    delete cliente.Senha;

    return this.Cria(cliente)
      .map(data => <ApiResponse>data.json())
      .flatMap(
        ({ Dados }: ApiResponse): Observable<Response> => {
          store.set('clienteId', Dados.ClienteId);
          this.pedidoService.atualizaCache({ Cliente: cliente });

          return this.usuarioService.Cria({
            CPF: cliente.CPF,
            Nome: cliente.NomeCompleto,
            Email: cliente.Email,
            Senha: senha,
            ClientId: Dados.ClienteId,
          })
        }
      )
      .map(data => <ApiResponse>data.json())
      .flatMap(
        ({ Dados }: ApiResponse): Observable<Response> => {
          store.set('usuarioId', Dados.UsuarioId);
          return this.authenticationService.login(cliente.CPF, senha)
        }
      )
      .map(data => <ApiResponse>data.json())
      .map(({ Dados }) => {
        store.set('token', Dados.TokenDeSeguranca);
        return Dados;
      })
  }

  setCache(cliente: ICliente): ICliente {
    const cache = this.getCache();
    const data = Object.assign({}, cache, cliente);
    store.set('cliente', data);

    if (!!store.get('pedido')) {
      this.pedidoService.atualizaCache({ Cliente: <Cliente>cliente });
    }
    return data;
  }

  getCache(item?: string) {
    const data = store.get('cliente') || {};
    return item ? data[item] || '' : data;
  }

  AtualizaOuCache(cliente: ICliente) {
    const cli = this.setCache(cliente);
    const id = store.get('clienteId');
    const token = store.get('token');
    if (!token || !id) {
      return this.setCache(cli);
    }
    cli.ClienteId = id;
    this.Atualiza(<Cliente>cli).subscribe();
  }

  CartaoDeCredito(id: any): Observable<Response> {
    return this.http.get(ApiPaths.Get_CartaoDeCredito_Obter_Token_Cartao_De_Credito_Por_Id + id);
  }

  loadCartaoDeCredito(id: any) {
    this
      .CartaoDeCredito(id)
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          if (Dados.TokenCartaoDeCredito) {
            store.set('tokenCartaoDeCredito', Dados.TokenCartaoDeCredito);
          }
        }
      )
  }

  ValidaTagPosto(tag: string) {
    return this.http.get(ApiPaths.Get_Tag_Validar_Tag_Posto + tag);
  }

  ValidaTagAtiva(placa: string, tag: string, cpf = store.get('cpf')) {
    const data = `cpf=${cpf.replace(/\D*/g, '')}&placa=${placa}&tag=${tag}`
    return this.http.get(ApiPaths.Get_Veiculo_Validar_Tag_Ativa + data);
  }

  AtivaTag(
    PlacaVeiculo: string,
    NumeroSerieTag: number,
    PreLiberacaoTagId: number,
  ) {
    return this.http.post(ApiPaths.Post_Ativacao_Ativar_Tag, {
      ClienteId: store.get('clienteId'),
      PlacaVeiculo,
      PreLiberacaoTagId,
      NumeroSerieTag
    });
  }

  CriaOuAtualizaEndereco(endereco: Endereco) {
    if (endereco.EnderecoId) {
      return this.AtualizaEndereco(endereco);
    }
    return this.CriaEndereco(endereco);
  }

  CriaEndereco(endereco: Endereco) {
    return this.http.post(ApiPaths.Put_Endereco_Atualizar_Endereco, endereco);
  }

  AtualizaEndereco(endereco: Endereco) {
    return this.http.put(ApiPaths.Put_Endereco_Atualizar_Endereco, endereco);
  }

  AtualizaSenha(
    SenhaAtual: string,
    NovaSenha: string,
    UsuarioId = store.get('usuarioId'),
  ) {
    return this.http.put(ApiPaths.Post_Usuarios_Alterar_Senha, {
      UsuarioId,
      SenhaAtual,
      NovaSenha
    });
  }

  UploadFoto(file: File) {
    const formData = new FormData();
    formData.append('image', file, file.name);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${store.get('token')}`);

    const opts = { reportProgress: true, headers };
    const url = environment.api.host + ApiPaths.Post_Arquivo_Foto_Perfil;
    const req = new HttpRequest('POST', url, formData, opts);
    return this.httpClient.request(req);
  }

  GetFoto() {
    return this.http.get(ApiPaths.Get_Listar_Imagens_Por_Cliente + 'T720px');
  }

  loadFoto(cb = (f: string) => null) {
    this
      .GetFoto()
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          if (Dados && Dados.Arquivos && Dados.Arquivos.length) {
            const foto = Dados.Arquivos[0].UrlArquivo;
            store.set('avatar', foto);
            if (typeof cb === 'function') {
              cb(foto);
            }
          }
        }
      );
  }

  SalvaCartaoDeCredito(cartao: any) {
    return this.http.post(ApiPaths.Post_CartaoDeCredito_Incluir_Token_Cartao_De_Credito, cartao);
  }

  loadContas() {
    return this.http.get(ApiPaths.Get_Plano_Obter_Plano_Por_ClienteId + store.get('clienteId'))
      .map(data => <ApiResponse>data.json())
      .subscribe(({ Dados }: ApiResponse) => {
        if (Dados && Dados.Contas && Dados.Contas.length) {
          store.set('contaSelecionada', Dados.Contas[0])
        }
      });
  }
}
