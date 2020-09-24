import { Component, Input, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal }                                         from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { AddressComponent } from './../address/address.component';
import { RecursosService } from 'app/services/recursos.service';
import * as localStore from 'store';

@Component({
  selector: 'cc-modal-frete-gratis',
  templateUrl: './modal-frete-gratis.component.html',
  styleUrls: ['./modal-frete-gratis.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalFreteGratisComponent implements OnInit {

	/**
	 * [constructor description]
	 *
	 * @param {NgbActiveModal} private _activeModal [description]
	 */
  constructor(
  	private _activeModal: NgbActiveModal,
    private R: RecursosService,
  ) {

  }

  /**
   * [ngOnInit description]
   */
  ngOnInit() {
    // do nothing
  }


}
