import { Routes } from '@angular/router';
import { PontoAPontoComponent } from './ponto-a-ponto.component';

export const routes: Routes = [
  {
    path: 'ponto-a-ponto',
    pathMatch: 'full',
    component: PontoAPontoComponent,
  },
  {
    path: 'ponto-a-ponto/:step',
    pathMatch: 'full',
    component: PontoAPontoComponent,
  }
];
