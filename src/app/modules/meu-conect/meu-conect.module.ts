import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from 'app/components/index';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from 'app/directives/index';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { routes } from './meu-conect.router';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ngfModule } from 'angular-file';
import {
  AtivacaoComponent,
  InformativoComponent,
  PlaqueComponent,
  AdesivoComponent,
  ModalEditarPlaqueComponent,
  ModalAdicionarAdesivoComponent,
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
} from './components/index';

@NgModule({
  declarations: [
    AtivacaoComponent,
    InformativoComponent,
    PlaqueComponent,
    AdesivoComponent,
    ModalEditarPlaqueComponent,
    ModalAdicionarAdesivoComponent,
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
  ],
  providers: [
    NgbActiveModal,
  ],
  entryComponents: [
    ModalEditarPlaqueComponent,
    ModalAdicionarAdesivoComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    ngfModule,
    HttpClientModule,
  ]
})
export class MeuConectModule {}
