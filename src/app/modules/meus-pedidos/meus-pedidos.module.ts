import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeusPedidosComponent } from './meus-pedidos.component';
import { PedidoDetalheComponent } from './components/pedido-detalhe/pedido-detalhe.component';
import { PedidoPassosComponent } from './components/pedido-passos/pedido-passos.component';
import { ModalPoliticaEntregaComponent } from './components/modal-politica-entrega/modal-politica-entrega.component';
import { ComponentsModule } from 'app/components/index';
import { NgPipesModule } from 'ngx-pipes';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from 'app/directives/index';
import { routes } from './meus-pedidos.router';


@NgModule({
  declarations: [
    MeusPedidosComponent,
    PedidoDetalheComponent,
    PedidoPassosComponent,
    ModalPoliticaEntregaComponent,
  ],
  providers: [
    NgbActiveModal,
  ],
  exports: [
    MeusPedidosComponent,
    PedidoDetalheComponent,
    PedidoPassosComponent,
    ModalPoliticaEntregaComponent,
    RouterModule,
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    NgPipesModule,
    ComponentsModule,
    DirectivesModule,
    NgbModule
  ]
})
export class MeusPedidosModule {}
