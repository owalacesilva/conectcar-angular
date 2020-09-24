import { NgModule }                        from '@angular/core';
import { NgbModule }                       from '@ng-bootstrap/ng-bootstrap';
import { CommonModule }                    from '@angular/common';
import { RouterModule }                    from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule }                  from 'angular2-text-mask';
import { StoreModule }                     from '@ngrx/store';
import { AuthenticationComponent }         from './authentication/authentication.component';
import { AppLoginComponent }               from './applogin/applogin.component';
import { CuidadosComponent }         			 from './cuidados/cuidados.component';
import { ChamadaAtivacaoComponent }        from './chamada-ativacao/chamada-ativacao.component';
import { EmailComponent }                  from './email/email.component';
import { NameComponent }                   from './name/name.component';
import { PhoneComponent }                  from './phone/phone.component';
import { RegistrationBirthdateComponent }  from './birthdate/birthdate.component';
import { PasswordComponent }               from './password/password.component';
import { EsqueciSenhaComponent }           from './esqueci/esqueci.component';
import { EsqueciSenhaResetComponent }      from './esqueci-reset/esqueci-reset.component';
import { LogoutComponent }                 from './logout/logout.component';
import { RegistrationMenuComponent }       from './registration-menu/registration-menu.component';
import { AuthenticationService }           from 'app/modules/registration/services/authentication.service';
import { ModalPrivacidadeComponent }       from './modal-privacidade/modal-privacidade.component';
import { ModalTermosComponent }            from './modal-termos/modal-termos.component';
import { ComponentsModule }                from 'app/components/index';
import { DirectivesModule }                from 'app/directives/index';
import { PlaqueComponent }                 from './plaque/plaque.component';
import { AtivarPlacaComponent }            from './ativar-placa/ativar-placa.component';
import { AtivarAdesivoComponent } 				 from './ativar-adesivo/ativar-adesivo.component';
import { AtivarPlacaEixoComponent } 			 from './ativar-placa-eixo/ativar-placa-eixo.component';

import { ComoFuncionaContaConectcarComponent }      from './cc-conta-conectcar/cc-conta-conectcar.component';
import { ComoFuncionaCreditoAutomaticoComponent }   from './cc-credito-automatico/cc-credito-automatico.component';
import { ComoFuncionaSaldoContaConectcarComponent } from './cc-saldo-conta-conectcar/cc-saldo-conta-conectcar.component';

import { PlanosComponent } 		 						 from './planos/planos.component';
import { ConfirmarPlacaAdesivoComponent }  from './confirmar-placa-adesivo/confirmar-placa-adesivo.component';
import { AdesivoComponent } 			 				 from './adesivo/adesivo.component';
import { OverviewComponent }               from './overview/overview.component';
import { PaymentComponent }                from './payment/payment.component';
import { AxleComponent }                   from './axle/axle.component';
import { ModalAxleComponent }              from './modal-axle/modalAxle.component';
import { AddressComponent }                from './address/address.component';
import { ModalDeleteAxleComponent }        from './modal-delete-axle/modalDeleteAxle.component';
import { CreditoComponent }                from './credito/credito.component';
import { LegalTermsComponent }             from './legal-terms/legal-terms.component';
import { ModalExclusaoVeiculoComponent }   from './modal-exclusao-veiculo/modal-exclusao-veiculo.component';
import { ModalAgendamentoComponent }       from './modal-agendamento/modal-agendamento.component';
import { ModalFreteGratisComponent }       from './modal-frete-gratis/modal-frete-gratis.component';
import { ModalEnderecoComponent }          from './modal-endereco/modal-endereco.component';
import { ModalEdicaoVeiculoComponent }     from './modal-edicao-veiculo/modal-edicao-veiculo.component';
import { CpfNaoEncontradoComponent }       from './cpf-nao-encontrado/cpf-nao-encontrado.component'

import {
  AuthenticationReducer,
  CheckCpfReducer,
  FacebookAuthenticationReducer
} from 'app/modules/registration/reducers/authentication.reducer';

@NgModule({
  declarations: [
    CuidadosComponent,
    ChamadaAtivacaoComponent,
    AuthenticationComponent,
    AppLoginComponent,
    EmailComponent,
    EsqueciSenhaComponent,
    EsqueciSenhaResetComponent,
    NameComponent,
    PhoneComponent,
    PasswordComponent,
    LogoutComponent,
    RegistrationMenuComponent,
    RegistrationBirthdateComponent,
    ModalPrivacidadeComponent,
    ModalTermosComponent,
    PlaqueComponent,
    AtivarPlacaComponent,
    AtivarAdesivoComponent,
    AtivarPlacaEixoComponent,
    ComoFuncionaContaConectcarComponent,
    ComoFuncionaCreditoAutomaticoComponent,
    ComoFuncionaSaldoContaConectcarComponent,
    PlanosComponent,
    ConfirmarPlacaAdesivoComponent,
    AdesivoComponent,
    OverviewComponent,
    PaymentComponent,
    AxleComponent,
    ModalAxleComponent,
    AddressComponent,
    ModalDeleteAxleComponent,
    CreditoComponent,
    LegalTermsComponent,
    ModalExclusaoVeiculoComponent,
    ModalFreteGratisComponent,
    ModalAgendamentoComponent,
    ModalEnderecoComponent,
    ModalEdicaoVeiculoComponent,
    CpfNaoEncontradoComponent,
  ],
  exports: [
    AppLoginComponent,
    AuthenticationComponent,
    CuidadosComponent,
    ChamadaAtivacaoComponent,
    EmailComponent,
    EsqueciSenhaComponent,
    EsqueciSenhaResetComponent,
    NameComponent,
    PhoneComponent,
    PasswordComponent,
    RegistrationBirthdateComponent,
    LogoutComponent,
    RegistrationMenuComponent,
    PlaqueComponent,
    AtivarPlacaComponent,
    AtivarAdesivoComponent,
    AtivarPlacaEixoComponent,
    ComoFuncionaContaConectcarComponent,
    ComoFuncionaCreditoAutomaticoComponent,
    ComoFuncionaSaldoContaConectcarComponent,
    PlanosComponent,
    ConfirmarPlacaAdesivoComponent,
    AdesivoComponent,
    OverviewComponent,
    PaymentComponent,
    AxleComponent,
    ModalAxleComponent,
    AddressComponent,
    ModalDeleteAxleComponent,
    CreditoComponent,
    LegalTermsComponent,
    ModalExclusaoVeiculoComponent,
    ModalFreteGratisComponent,
    ModalAgendamentoComponent,
    ModalEnderecoComponent,
    ModalEdicaoVeiculoComponent,
    CpfNaoEncontradoComponent,
  ],
  entryComponents: [
    ModalExclusaoVeiculoComponent,
    ModalFreteGratisComponent,
    ModalAgendamentoComponent,
    ModalEnderecoComponent,
    ModalEdicaoVeiculoComponent,
    LegalTermsComponent
  ],
  imports: [
    ComponentsModule,
    DirectivesModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgbModule.forRoot(),
    StoreModule.provideStore({
        facebookAuthentication: FacebookAuthenticationReducer,
        authentication: AuthenticationReducer,
        cpfStatus: CheckCpfReducer,
    }),
  ],
  providers: [
    AuthenticationService,
  ]
})
export class RegistrationComponentsModule { }
