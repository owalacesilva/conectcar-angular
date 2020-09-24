import { Component, AfterViewInit, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';
import { Injector, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RecursosService } from 'app/services/recursos.service';

import { RegistrationComponent } from '../../registration.component';
import { FacebookService } from 'app/modules/registration/services/facebook.service';
import { ModalComoFuncionaComponent } from 'app/components/modal-como-funciona/modal-como-funciona.component';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import * as store from 'store';

@Component({
  selector: 'app-registration-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [ NgbModal ]
})
export class OverviewComponent implements AfterViewInit {
  @Output() onResize = new EventEmitter<void>();

  private ativacaoOffline = !!store.get('ativacao-offline');
  private modalRef: NgbModalRef;

  public isCollapsed1 = false;
  public isCollapsed2 = false;

  private veiculos;
  private endereco;
  private produto;
  private cliente;
  private credito;
  private pedido;

  private registrationComponent;

  ngAfterViewInit() {
    document.body.querySelector('.holder').classList.add('initialized');

    this.resize();
  }

  constructor(
    private _modalService: NgbModal,
    private router: Router,
    private inj: Injector,
    private R: RecursosService,
    private routesFlow: RoutesFlowService,
  ) {

    this.registrationComponent = this.inj.get(RegistrationComponent);

    this.veiculos = store.get('veiculos') || [];
    this.produto = store.get('planoSelecionado') || {};
    this.cliente = store.get('cliente') || {};

    this.pedido = store.get('pedido') || {};

    const enderecos = this.pedido.Enderecos || [];
    this.endereco = enderecos.find(addr => addr.Tipo === 'Entrega');

    const recargas = this.produto.Recargas || [];

    this.credito = recargas.find(recarga =>
      recarga.Codigo === store.get('creditoSelecionado')) || {};
  }

  openModalComoFuncionam() {
    this.modalRef = this._modalService.open(ModalComoFuncionaComponent, {
      windowClass: 'modal-expandido modal-como-funciona',
      size: 'lg'
    });
  }

  openModalPlano(): void {
    this.modalRef = this._modalService.open(ModalComoFuncionaComponent, {
      windowClass: 'modal-como-funcionam',
      size: 'lg'
    });
  }

  editStep(step: string) {
    this.routesFlow.go(true, step);
  }

  resize() {
    setTimeout(() => this.registrationComponent.adjustHeight(), 100);
  }

  submit() {
    this.routesFlow.go();
  }
}
