import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { RecursosService } from 'app/services/recursos.service';
import { GoogleTagManagerService } from 'app/services/google-tag-manager.service';

@Component({
  selector: 'app-informativo',
  templateUrl: './informativo.component.html',
  styleUrls: ['./informativo.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class InformativoComponent implements AfterViewInit {

  constructor(
  	private R: RecursosService,
    private gtmService: GoogleTagManagerService
  ) { }

  ngAfterViewInit() {
		this.gtmService.sendPageView();
  }
}
