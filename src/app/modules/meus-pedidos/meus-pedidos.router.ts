import { Routes } from '@angular/router';
import { AuthenticationGuard } from 'app/services/authentication-guard.service';
import { MeusPedidosComponent } from './meus-pedidos.component';
import { PedidoDetalheComponent } from './components/pedido-detalhe/pedido-detalhe.component';

export const routes: Routes = [
  {
    path: 'pedidos',
    pathMatch: 'full',
    canActivate: [AuthenticationGuard],
    component: MeusPedidosComponent,
  },
  {
    path: 'pedidos/:id',
    canActivate: [AuthenticationGuard],
    component: PedidoDetalheComponent,
  },
];
