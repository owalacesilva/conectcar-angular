import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from 'app/components/index';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from 'app/directives/index';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './ponto-a-ponto.router';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PontoAPontoComponent } from './ponto-a-ponto.component'
import {
  AdesaoConfirmadaPontoAPontoComponent,
  AderirPontoAPontoComponent,
  ConfirmarAdesaoPontoAPontoComponent,
  CancelarPontoAPontoComponent
} from './components/index';

@NgModule({
  declarations: [
  	PontoAPontoComponent,
    AdesaoConfirmadaPontoAPontoComponent,
    AderirPontoAPontoComponent,
    ConfirmarAdesaoPontoAPontoComponent,
    CancelarPontoAPontoComponent
  ],
  providers: [
    NgbActiveModal,
  ],
  entryComponents: [],
  exports: [
  	PontoAPontoComponent
  ],
  imports: [
  	BrowserModule,
  	BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class PontoAPontoModule {}
