import { Component, Input, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Animations } from 'app/animations';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'cc-modal-politica-entrega',
  templateUrl: './modal-politica-entrega.component.html',
  styleUrls: ['./modal-politica-entrega.component.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [ Animations.slideInOut ],
})
export class ModalPoliticaEntregaComponent implements OnInit {
  constructor(private _activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }
}
