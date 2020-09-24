import { Component, Input, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Animations } from 'app/animations';
import { RecursosService } from 'app/services/recursos.service';
import { NgbActiveModal, NgbCarouselConfig, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';
declare var jQuery: any;

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'cc-modal-como-funciona',
  templateUrl: './modal-como-funciona.component.html',
  styleUrls: ['./modal-como-funciona.component.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [ Animations.slideInOut ],
  providers: [ NgbCarouselConfig, GoogleTagManagerService ]
})
export class ModalComoFuncionaComponent implements OnInit {
  @ViewChild('carousel') carousel: NgbCarousel;

  constructor(
    private _activeModal: NgbActiveModal,
    private _ngbConfig: NgbCarouselConfig,
    private R: RecursosService,
    private gtmService: GoogleTagManagerService
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
