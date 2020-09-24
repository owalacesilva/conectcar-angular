import { Component, Input, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal }                                         from '@ng-bootstrap/ng-bootstrap';
import { RecursosService }                                        from 'app/services/recursos.service';

@Component({
  selector: 'cc-modal-detalhes-plano',
  templateUrl: './modal-detalhes-plano.component.html',
  styleUrls: ['./modal-detalhes-plano.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalDetalhesPlanoComponent implements OnInit {
  @Input() produto;

  constructor(
    private _activeModal: NgbActiveModal,
    private R: RecursosService
  ) {}

  ngOnInit() {}
}
