import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, LOCALE_ID } from '@angular/core';
import {
 Http,
 HttpModule,
 RequestOptions,
 XHRBackend,
} from '@angular/http';

import { routerReducer, RouterStoreModule } from '@ngrx/router-store';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FacebookModule } from 'ngx-facebook';
import { TextMaskModule } from 'angular2-text-mask';

import { ComponentsModule } from './components/index';
import { DirectivesModule } from './directives/index';

import { AppComponent } from './app.component';

import {
  AreaIndisponivelModule,
  PlanosModule,
  MeusPedidosModule,
  MeuConectModule,
  PontoAPontoModule,
  RegistrationModule,
  ComoFuncionamModule,
  ConfirmationModule,
  CompraRealizadaModule,
  ComoInstalarModule,
  AtivacaoRealizadaModule
} from './modules/index';

import { RoutesFlowService } from './services/routes-flow.service';
import { HttpService, HttpError } from './services/http.service';
import { RecursosService } from './services/recursos.service';
import { FeatureToggleService } from './services/featureToggle.service';
import { GoogleTagManagerService } from './services/google-tag-manager.service';
import { DialogService, AlertComponent } from './services/dialog.service';
import { LoadingService, LoadingComponent } from './services/loading.service';
import { ProdutosService } from './services/produtos.service';
import { ProdutosReducer } from './reducers/produtos.reducer';
import { ContaService } from './services/conta.service';
import { RecargaService } from './services/recarga.service';
import { WindowRefService } from './services/window-ref-service.service';
import { PlacaReducer } from './modules/registration/reducers/placa.reducer';

import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { HammerConfig } from './configs/hammer-config';

export function useFactory(backend: XHRBackend, options: RequestOptions) {
  return new HttpService(backend, options)
}

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    LoadingComponent,
  ],
  imports: [
    AreaIndisponivelModule,
    PlanosModule,
    MeusPedidosModule,
    MeuConectModule,
    PontoAPontoModule,
    ComponentsModule,
    ComoFuncionamModule,
    DirectivesModule,
    RegistrationModule,
    CompraRealizadaModule,
    ConfirmationModule,
    BrowserModule,
    StoreModule.provideStore({
      products: ProdutosReducer,
      placa: PlacaReducer,
      router: routerReducer,
    }),
    FacebookModule.forRoot(),
    NgbModule.forRoot(),
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterStoreModule.connectRouter(),
    TextMaskModule,
    ComoInstalarModule,
    AtivacaoRealizadaModule,
  ],
  entryComponents: [ LoadingComponent, AlertComponent ],
  providers: [
    RoutesFlowService,
    RecursosService,
    FeatureToggleService,
    DialogService,
    LoadingService,
    ProdutosService,
    ContaService,
    RecargaService,
    WindowRefService,
    GoogleTagManagerService,
    HttpError,
    {
      provide: HttpService,
      deps: [XHRBackend, RequestOptions],
      useFactory: useFactory,
    },
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR',
    },
    {
        provide: HAMMER_GESTURE_CONFIG,
        useClass: HammerConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
