import { NgModule }                from '@angular/core';
import { CommonModule }            from '@angular/common';
import { NgbModule }               from '@ng-bootstrap/ng-bootstrap';
import { RouterModule }            from '@angular/router';
import { ComponentsModule }        from 'app/components/index';
import { CompraRealizadaComponent }from './compra-realizada.component';
import { routes }                  from './compra-realizada.router';

@NgModule({
  declarations: [
  	CompraRealizadaComponent
  ],
  exports: [
  	CompraRealizadaComponent,
		RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
  	NgbModule
  ]
})
export class CompraRealizadaModule { }
