import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AppCallDesktopComponent } from './app-call-desktop/app-call-desktop.component';
import { ProgressArcComponent } from './progress-arc/progress-arc.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { BaixeAppComponent } from './baixe-app/baixe-app.component';
import { ModalComoFuncionaComponent} from './modal-como-funciona/modal-como-funciona.component';
import { ModalAtivarAdesivoComponent} from './modal-ativar-adesivo/modal-ativar-adesivo.component';
import { ModalAdesivoPendenteComponent} from './modal-adesivo-pendente/modal-adesivo-pendente.component';
import { PlanoComponent } from './plano/plano.component';
import { ModalDetalhesPlanoComponent } from './modal-detalhes-plano/modal-detalhes-plano.component';
import { ModalDescontoComponent } from './modal-desconto/modal-desconto.component';
import { CollapseModule } from 'ngx-bootstrap';
import { NgPipesModule } from 'ngx-pipes';
import { AddressFormComponent } from './address-form/address-form.component';
import { CartaoDeCreditoComponent } from './cartao-de-credito/cartao-de-credito.component';
import { PlacaComponent } from './placa/placa.component';
import { DirectivesModule } from 'app/directives/index';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    DirectivesModule,
    NgPipesModule,
    CollapseModule.forRoot()
  ],
  declarations: [
    BaixeAppComponent,
    HeaderComponent,
    FooterComponent,
    AppCallDesktopComponent,
    ProgressArcComponent,
    SpinnerComponent,
    PlanoComponent,
    ModalComoFuncionaComponent,
    ModalAtivarAdesivoComponent,
    ModalAdesivoPendenteComponent,
    ModalDetalhesPlanoComponent,
    ModalDescontoComponent,
    AddressFormComponent,
    CartaoDeCreditoComponent,
    PlacaComponent
  ],
  entryComponents: [
    HeaderComponent,
    PlanoComponent,
    ModalComoFuncionaComponent,
    ModalAtivarAdesivoComponent,
    ModalAdesivoPendenteComponent,
    ModalDescontoComponent,
    ModalDetalhesPlanoComponent,
  ],
  exports: [
    BaixeAppComponent,
    HeaderComponent,
    FooterComponent,
    AppCallDesktopComponent,
    PlanoComponent,
    ProgressArcComponent,
    SpinnerComponent,
    AddressFormComponent,
    CartaoDeCreditoComponent,
    PlacaComponent
  ]
})
export class ComponentsModule { }
