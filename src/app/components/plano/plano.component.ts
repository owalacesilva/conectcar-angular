import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ModalDetalhesPlanoComponent } from 'app/components/modal-detalhes-plano/modal-detalhes-plano.component';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import { RecursosService } from 'app/services/recursos.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';
import * as store from 'store';

@Component({
  selector: 'cc-plano',
  templateUrl: './plano.component.html',
  styleUrls: ['./plano.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [ NgbModal ]
})
export class PlanoComponent implements OnInit {
  @Input() produto: any;
  @Input() index: any;
  @Input() offline = false;
  @Input() to = '/cadastro/cpf';

  private modalRef: NgbModalRef;

  constructor(
    private router: Router,
    private _modalService: NgbModal,
    private routesFlow: RoutesFlowService,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService
  ) {}

  ngOnInit() {}

  open(content) {
    this._modalService.open(content, { backdrop: 'static' });
  }

  selectPlan() {
    const pedido = store.get('pedido');
    if (pedido) {
      const plano: any = {
        Id: this.produto.Id,
        Titulo: this.produto.Titulo,
        Descricao: this.produto.Descricao,
        Valor: this.produto.Mensalidade,
        Device: this.produto.Device,
        DiasVencimento: this.produto.DiasVencimento[0],
        Campanha: this.produto.Campanha,
      };
      pedido.Produto = Object.assign({}, pedido.Produto, plano);
      const tiposConta = plano.TiposConta || [];
      pedido.TipoConta = {
        Codigo: (tiposConta[0] || {}).Codigo
      }
    }

    store.set('pedido', pedido);
    store.set('planoSelecionado', this.produto);

    this.gtmService.sendPageView('compra/escolha-seu-plano');

    if (store.get('cpf-status') === 'login-via-app') {
      return this.routesFlow.go();
    }

    store.remove('cpf');

    if (this.offline) {
      this.routesFlow.go(false, this.to || '/cadastro/cpf');
    } else {
      this.router.navigate([ this.to || '/cadastro/cpf' ]);
    }
  }

  openModalDetalhes(): void {
    this.modalRef = this._modalService.open(ModalDetalhesPlanoComponent, {
      windowClass: 'modal-expandido modal-detalhes-plano',
      size: 'lg'
    });
    this.modalRef.componentInstance.produto = this.produto;
  }
}
