import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestOptions, XHRBackend } from '@angular/http';
import { ComponentsModule } from 'app/components/index';

import { AreaIndisponivelComponent } from './area-indisponivel.component';
import { routes } from './area-indisponivel.router';

@NgModule({
  declarations: [
    AreaIndisponivelComponent,
  ],
  exports: [
    AreaIndisponivelComponent,
    RouterModule,
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
    NgbModule,
  ]
})
export class AreaIndisponivelModule {}
