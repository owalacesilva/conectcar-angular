import { Component, Input, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbCarouselConfig, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { RecursosService } from 'app/services/recursos.service';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'cc-modal-desconto',
  templateUrl: './modal-desconto.component.html',
  styleUrls: ['./modal-desconto.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ModalDescontoComponent implements OnInit {
  private cupom: string = null;

  constructor(
    private _activeModal: NgbActiveModal,
    private R: RecursosService
  ) { }

  ngOnInit() { }
}
