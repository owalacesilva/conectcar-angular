import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Animations } from 'app/animations';
import { ProdutosService } from 'app/services/produtos.service';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs/Rx';
import { Produto } from 'app/models/produto.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComoFuncionaComponent } from 'app/components/modal-como-funciona/modal-como-funciona.component';

import { LoadingService } from 'app/services/loading.service';
import { RegistrationComponent } from './../../registration.component';
import { RecursosService } from 'app/services/recursos.service';
import { RoutesFlowService } from 'app/services/routes-flow.service';
import { NgbActiveModal, NgbCarouselConfig, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

import { Masks } from 'app/masks';
import * as localStore from 'store';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-registration-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [ Animations.slideInOutCardsOff ],
  providers: [ NgbCarouselConfig, NgbModal ]
})
export class PlanosComponent implements OnInit {
  @ViewChild('carousel') carousel: NgbCarousel;

  @Output() onResize = new EventEmitter<void>();

  private modalRef: NgbModalRef;

  veiculosCount: number;
  veiculosAds: string;
  produtos: Observable<Produto[]>;

  slideCount = 0;
  slideIndex = 0;
  loading = true;
  direction = 'right';

  constructor(
    private _modalService: NgbModal,
    private _activeModal: NgbActiveModal,
    private _ngbConfig: NgbCarouselConfig,
    private loadingService: LoadingService,
    private registration: RegistrationComponent,
    private store: Store<Produto>,
    private productsService: ProdutosService,
    private routesFlow: RoutesFlowService,
    private R: RecursosService,
  ) {
    this._ngbConfig.interval = 0;
    this._ngbConfig.wrap     = false; // do ultimo para o primeiro
    this._ngbConfig.keyboard = true;

    this.veiculosCount = (localStore.get('veiculosTemp') || []).length;
    this.veiculosAds = this.veiculosCount === 1 ? 'adesivo' : 'adesivos';
  }

  ngOnInit() {
    this.loadingService.show();

    this.registration.bgcontent  = 'image8';
    this.registration.txtcontent = "<h1>" + this.R.R('sidebar_titulo_design_tecnologia') + "</h1><p>" + this.R.R('sidebar_desc_em_alguns_passos') + "</p>";

    this.produtos = this.store.select('products');
    this.produtos.subscribe((val) => {
      if (val.length) {
        this.loading = false;
        setTimeout(() => this.loadingService.destroy(), 1);
      }
      this.slideCount = val.length;
      this.slideIndex = val.length - 1;
    });

    this.productsService.loadLista();
  }

  slideInOut(index: any) {
    /*if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(window.navigator.userAgent)) {
      // Take the user to a different screen here.
    } else {
      return null;
    }*/
    return this.slideIndex === index ? 'in' : 'out_' + this.direction;
  }

  prev() {
    if (this.slideIndex > 0) {
      this.direction = 'left';
      this.slideIndex -= 1;
    }
  }

  next() {
    if (this.slideIndex < this.slideCount - 1) {
      this.direction = 'right';
      this.slideIndex += 1;
    }
  }

  swipeClick(index: any) {
    if (index === 0) {
      return this.prev();
    }
    if (index === 1) {
      return this.next();
    }
  }

  openModalComoFuncionam(): void {
    this.modalRef = this._modalService.open(ModalComoFuncionaComponent, {
      windowClass: 'modal-expandido modal-como-funciona',
      size: 'lg'
    });
  }
}
