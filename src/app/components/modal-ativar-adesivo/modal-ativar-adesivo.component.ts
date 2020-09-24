import { Component, Input, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Animations } from 'app/animations';
import { RecursosService } from 'app/services/recursos.service';
import { NgbActiveModal, NgbCarouselConfig, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import * as store from 'store';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'cc-modal-ativar-adesivo',
  templateUrl: './modal-ativar-adesivo.component.html',
  styleUrls: ['./modal-ativar-adesivo.component.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [ Animations.slideInOut ],
  providers: [ NgbCarouselConfig ]
})
export class ModalAtivarAdesivoComponent implements OnInit {
  @ViewChild('carousel') carousel: NgbCarousel;
  cliente = store.get('cliente');
  tags: number;

  constructor(
    private _activeModal: NgbActiveModal,
    private _ngbConfig: NgbCarouselConfig,
    private R: RecursosService,
  ) {
    this._ngbConfig.interval = 0;
    this._ngbConfig.wrap     = false; // do ultimo para o primeiro
    this._ngbConfig.keyboard = true;

    if (this.cliente && this.cliente.Tags) {
      this.tags = this.cliente.Tags.length;
    }
  }

  prev() {
    this.carousel.prev();
  }

  next() {
    this.carousel.next();
  }

  ngOnInit() {
  }
}
