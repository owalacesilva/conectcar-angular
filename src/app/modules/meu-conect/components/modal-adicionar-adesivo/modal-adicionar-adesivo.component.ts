import { Component, Input, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Animations } from 'app/animations';
import { RecursosService } from 'app/services/recursos.service';
import { NgbActiveModal, NgbCarouselConfig, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
declare var jQuery: any;

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'cc-modal-adicionar-adesivo',
  templateUrl: './modal-adicionar-adesivo.component.html',
  styleUrls: ['./modal-adicionar-adesivo.component.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [ Animations.slideInOut ],
  providers: [ NgbCarouselConfig ]
})
export class ModalAdicionarAdesivoComponent implements OnInit {
  @ViewChild('carousel') carousel: NgbCarousel;

  private disabled = true;

  constructor(
    private _activeModal: NgbActiveModal,
    private _ngbConfig: NgbCarouselConfig,
    private R: RecursosService,
  ) {
    this._ngbConfig.interval = 0;
    this._ngbConfig.wrap     = false; // do ultimo para o primeiro
    this._ngbConfig.keyboard = true;
  }

  prev() {
    this.carousel.prev();
  }

  next() {
    this.carousel.next();
  }

  ngOnInit() {
    // do nothing
  }
}
