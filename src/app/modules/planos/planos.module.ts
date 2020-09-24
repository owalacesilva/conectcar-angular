import { NgModule }                  from '@angular/core';
import { CommonModule }              from '@angular/common';
import { PlanosComponent }           from './planos.component';
import { ComponentsModule }          from 'app/components/index';
import { NgPipesModule }             from 'ngx-pipes';
import { RouterModule }              from '@angular/router';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProdutosReducer }           from 'app/reducers/produtos.reducer';
import { routes }                    from './planos.router';

@NgModule({
  declarations: [
    PlanosComponent,
  ],
  providers: [
    NgbActiveModal,
  ],
  exports: [
    PlanosComponent,
    RouterModule,
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    NgPipesModule,
    ComponentsModule,
    RouterModule,
    NgbModule
  ]
})
export class PlanosModule {}
