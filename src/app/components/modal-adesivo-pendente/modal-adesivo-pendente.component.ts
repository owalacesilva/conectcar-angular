import { Component, Input, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RecursosService } from 'app/services/recursos.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Routes from 'app/configs/routes';

@Component({
  selector: 'cc-modal-adesivo-pendente',
  templateUrl: './modal-adesivo-pendente.component.html',
  styleUrls: ['./modal-adesivo-pendente.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ModalAdesivoPendenteComponent implements OnInit {
  constructor(
    private _activeModal: NgbActiveModal,
    private router: Router,
    private R: RecursosService,
  ) {}

  onClick() {
    this._activeModal.close();
  }

  ngOnInit() {
  }
}
