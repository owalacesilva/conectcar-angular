import { Routes } from '@angular/router';
import { CompraRealizadaComponent } from './compra-realizada.component';

export const routes: Routes = [
  {
    path: 'compra-realizada',
    pathMatch: 'full',
    component: CompraRealizadaComponent,
  },
];
