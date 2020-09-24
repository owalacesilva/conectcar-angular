import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration.component';
import { RegistrationComponentsModule } from './components/index';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CadastroReducer } from 'app/modules/registration/reducers/cadastro.reducer';
import { PlacaReducer } from 'app/modules/registration/reducers/placa.reducer';
import { ComponentsModule } from 'app/components/index';

import { AuthenticationService } from 'app/modules/registration/services/authentication.service';
import { AuthenticationGuard } from 'app/services/authentication-guard.service';
import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { EnderecoService } from 'app/modules/registration/services/endereco.service';
import { ClienteService } from 'app/modules/registration/services/cliente.service';
import { UsuarioService } from 'app/modules/registration/services/usuario.service';
import { Agendamento } from 'app/modules/registration/models/agendamento.model';
import { AgendamentoService } from 'app/modules/registration/services/agendamento.service';
import { Pedido } from 'app/modules/registration/models/pedido.model';
import { PedidoService } from 'app/services/pedido.service';
import { PlacaService } from 'app/modules/registration/services/placa.service';
import { routes } from './registration.router';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {
  RequestOptions,
  XHRBackend,
} from '@angular/http';
import { HttpService } from 'app/services/http.service';

export function useFactory(backend: XHRBackend, options: RequestOptions) {
  return new HttpService(backend, options)
}

@NgModule({
  declarations: [
    RegistrationComponent,
  ],
  providers: [
    RegistrationComponent,
    Agendamento,
    AgendamentoService,
    AuthenticationService,
    AuthenticationGuard,
    FacebookService,
    EnderecoService,
    ClienteService,
    PedidoService,
    PlacaService,
    UsuarioService,
    NgbActiveModal,
    Pedido,
    {
      provide: HttpService,
      deps: [XHRBackend, RequestOptions],
      useFactory: useFactory,
    }
  ],
  exports: [
    RegistrationComponent,
    RegistrationComponentsModule,

  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
    NgbModule,
    RegistrationComponentsModule,
    BrowserModule,
    BrowserAnimationsModule,
    StoreModule.provideStore({
      registration: CadastroReducer,
      placa: PlacaReducer,
    }),
  ]
})
export class RegistrationModule {}
