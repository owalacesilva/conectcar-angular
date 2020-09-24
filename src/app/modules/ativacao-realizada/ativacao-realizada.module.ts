import { NgModule }                   from '@angular/core';
import { CommonModule }               from '@angular/common';
import { NgbModule }                  from '@ng-bootstrap/ng-bootstrap';
import { RouterModule }               from '@angular/router';
import { ComponentsModule }           from 'app/components/index';
import { AtivacaoRealizadaComponent } from './ativacao-realizada.component';
import { routes }                     from './ativacao-realizada.router';

@NgModule({
  declarations: [
  	AtivacaoRealizadaComponent
  ],
  exports: [
  	AtivacaoRealizadaComponent,
		RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
  	NgbModule
  ]
})
export class AtivacaoRealizadaModule { }
