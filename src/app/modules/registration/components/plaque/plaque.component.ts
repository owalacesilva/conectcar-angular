import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Rx';

import { ApiResponse } from 'app/models/api-response.model';
import { DialogService } from 'app/services/dialog.service';
import { LoadingService } from 'app/services/loading.service';
import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { PlacaService } from 'app/modules/registration/services/placa.service';
import { Carro } from 'app/modules/registration/models/carro.model';
import { RegistrationComponent } from './../../registration.component';
import { RecursosService } from 'app/services/recursos.service';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';

import { CustomValidators } from 'app/validators';
import { Masks } from 'app/masks';

import { ADD, REMOVE } from 'app/modules/registration/reducers/placa.reducer';
import * as localStore from 'store';

@Component({
  selector: 'app-registration-plaque',
  templateUrl: './plaque.component.html',
  styleUrls: ['./plaque.component.less']
})
export class PlaqueComponent implements OnInit {
  @ViewChild('gnplaca') gnplaca;

  oldVeiculo: any = null;
  veiculo: any = null;

  fromOverview = false

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<Carro>,
    private dialogService: DialogService,
    private _activeModal: NgbActiveModal,
    private loadingService: LoadingService,
    private plaqueService: PlacaService,
    private registration: RegistrationComponent,
    private routesFlow: RoutesFlowService,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService
  ) {
    this.route.queryParams.subscribe(params => {
      this.fromOverview = params.r === '' || !!params.r;
    });

    this.plaqueService.loadCategorias();
  }

  ngOnInit() {
    this.registration.bgcontent  = 'image4';
    this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_queremos_te_conhecer') + "</h1><p>" + this.R.R('sidebar_desc_queremos_te_conhecer') + "</p>";

    this.oldVeiculo = localStore.get('veiculo-atual');
    this.veiculo = localStore.get('veiculo-atual');

    const pedido = localStore.get('pedido') || {};
    const veiculos = pedido.Veiculos || [];

    const addNew = localStore.get('veiculo-novo');
    if (!addNew && !this.veiculo && veiculos.length) {
      this.veiculo = veiculos[0];
    }

    if (this.veiculo) {
      const placa = this.veiculo.Placa.split('-');
      this.gnplaca.plaque1.setValue(placa[0]);
      this.gnplaca.plaque2.setValue(placa[1]);
      this.gnplaca.disabled = false;
    }
  }

  get placa(): string {
    return `${this.gnplaca.plaque1.value}-${this.gnplaca.plaque2.value}`
  }

  add() {
    if (this.gnplaca.disabled) {
      return;
    }

    const veiculos = localStore.get('veiculos') || [];
    if (veiculos.find(data => data.Placa === this.placa)) {
      return this.routesFlow.go(this.fromOverview, '/comprar/eixo');
    }

    this.loadingService.show();

    this
      .plaqueService
      .porPlaca(this.placa)
      .map(data => <ApiResponse>data.json())
      .subscribe(
        ({ Dados }: ApiResponse) => {
          this.gnplaca.disabled = false; // Dados.length > 0;
          // TODO
          // this.disabled = Dados.UsuarioId !== Dados.UsuarioId // store.get('usuarioId')

          if (this.gnplaca.disabled) {
            this.dialogService.showAlert({
              title: this.R.R('alerta_error_placa_ja_associada'),
              subtitle: this.R.R('alerta_error_placa_entre_contato')
            });

            return;
          }

          this.gtmService.sendPageView('compra/placa');
          this.gtmService.emitEvent('compra-placa', 'click-categoria-veiculo');

          const categorias = localStore.get('categorias') || [];
          const data = {
            UsuarioId: localStore.get('usuarioId'),
            CategoriaId: categorias[0].CategoriaVeiculoId,
            Placa: this.placa,
          };

          localStore.set('veiculo-atual', data);

          if (this.oldVeiculo && this.oldVeiculo.Placa && this.oldVeiculo.Placa !== this.placa) {
            const newVeiculos = veiculos.map(veiculo => {
              if (veiculo.Placa === this.oldVeiculo.Placa) {
                return data;
              }
              return veiculo;
            });
            localStore.set('veiculos', newVeiculos);
          } else {
            veiculos.push(data);
            localStore.set('veiculos', veiculos);
          }

          this.routesFlow.go(this.fromOverview);
        },
        (err) => console.log(err),
        () => this.loadingService.destroy()
      );
  }
}
