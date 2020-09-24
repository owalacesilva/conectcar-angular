import { Routes } from '@angular/router';
import { AuthenticationGuard } from 'app/services/authentication-guard.service';
import {
  AtivacaoComponent,
  InformativoComponent,
  AdesivoComponent,
  PlaqueComponent,
  ExtratoComponent,
  ModalTrocaContaComponent,
  ExtratoDetalheComponent,
  PerfilComponent,
  RecargaAvulsaComponent,
  ConfirmarPlacaAdesivoComponent,
  AtivacaoRealizadaComponent,
  ConclusaoComponent,
  ComoInstalarComponent,
  RedesSociaisComponent,
  AlterarSenhaAtualComponent,
  AlterarSenhaNovaComponent,
  AlterarSenhaSucessoComponent,
} from './components';

export const routes: Routes = [
  {
    path: 'meu-conect',
    children: [
      {
        path: 'ativar-adesivo',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: AtivacaoComponent,
      },
      {
        path: 'informativo',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: InformativoComponent,
      },
      {
        path: 'placa',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: PlaqueComponent,
      },
      {
        path: 'adesivo',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: AdesivoComponent,
      },
      {
        path: 'confirmar-placa-adesivo',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: ConfirmarPlacaAdesivoComponent,
      },
      {
        path: 'ativacao-realizada',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: AtivacaoRealizadaComponent,
      },
      {
        path: 'extrato',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: ExtratoComponent,
      },
      {
        path: 'troca-de-conta',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: ModalTrocaContaComponent,
      },
      {
        path: 'extrato/detalhe',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: ExtratoDetalheComponent,
      },
      {
        path: 'perfil',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: PerfilComponent,
      },
      {
        path: 'perfil/redes-sociais',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: RedesSociaisComponent,
      },
      {
        path: 'recarga',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: RecargaAvulsaComponent,
      },
      {
        path: 'conclusao',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: ConclusaoComponent
      },
      {
        path: 'como-instalar',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: ComoInstalarComponent
      },
      {
        path: 'alterar-senha',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: AlterarSenhaAtualComponent
      },
      {
        path: 'nova-senha',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: AlterarSenhaNovaComponent
      },
      {
        path: 'senha-alterada',
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
        component: AlterarSenhaSucessoComponent
      },
    ]
  }
];
