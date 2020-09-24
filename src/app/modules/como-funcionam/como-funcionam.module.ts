import { NgModule }              from '@angular/core';
import { CommonModule }          from '@angular/common';
import { NgbModule }             from '@ng-bootstrap/ng-bootstrap';
import { ComoFuncionamComponent }from './como-funcionam.component';
import { RouterModule }          from '@angular/router';
import { routes }                from './como-funcionam.router';

@NgModule({
  declarations: [
  	ComoFuncionamComponent
  ],
  exports: [
  	ComoFuncionamComponent,
		RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
  	NgbModule
  ]
})
export class ComoFuncionamModule { }
