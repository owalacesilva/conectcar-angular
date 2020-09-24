import { NgModule }                     from '@angular/core';
import { StoreModule }                  from '@ngrx/store';
import { CommonModule }                 from '@angular/common';
import { ComoInstalarComponent }        from './como-instalar.component';
import { BrowserModule }                from '@angular/platform-browser';
import { BrowserAnimationsModule }      from '@angular/platform-browser/animations';
import { RouterModule }                 from '@angular/router';
import { ComponentsModule }             from 'app/components/index';
import { routes } 											from './como-instalar.router';
import { NgbModule, NgbActiveModal } 		from '@ng-bootstrap/ng-bootstrap';
import { RequestOptions, XHRBackend }   from '@angular/http';

@NgModule({
  declarations: [
    ComoInstalarComponent,
  ],
  providers: [
    ComoInstalarComponent,
  ],
  exports: [
    ComoInstalarComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
    NgbModule,
    BrowserModule,
    BrowserAnimationsModule,
  ]
})
export class ComoInstalarModule {}
