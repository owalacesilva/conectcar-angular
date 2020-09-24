import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { RecursosService }                             from 'app/services/recursos.service';
import { NgbModal, NgbModalRef }                       from '@ng-bootstrap/ng-bootstrap';
import { ModalAdicionarAdesivoComponent }              from './../index';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';

@Component({
  selector: 'app-como-instalar',
  templateUrl: './como-instalar.component.html',
  styleUrls: ['./como-instalar.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ComoInstalarComponent implements AfterViewInit {

  public bgcontent: string;
  public txtcontent: string;
  public full = false;

  constructor(private R: RecursosService, private gtmService: GoogleTagManagerService) { }

  ngAfterViewInit() {
    this.bgcontent  = 'image4';
    this.txtcontent = '<h1>Queremos te conhecer</h1><p>Queremos manter uma comunicação personalizada e te contar tudo o que acontence com seu ConectCar</p>';
    this.gtmService.sendPageView('area-logada/ativacao/como-instalar');
  }
}
