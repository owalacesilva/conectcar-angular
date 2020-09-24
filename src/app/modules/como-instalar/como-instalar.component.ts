import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ElementRef, ViewChild }            from '@angular/core';
import { ViewEncapsulation }            		from '@angular/core';
import { FormControl, Validators }          from '@angular/forms';
import { Router, ActivatedRoute }           from '@angular/router';
import { Store }                            from '@ngrx/store'
import { Observable }                       from 'rxjs/Rx';
import { GoogleTagManagerService } 					from 'app/services/google-tag-manager.service';

@Component({
  selector: 'app-como-instalar',
  templateUrl: './como-instalar.component.html',
  styleUrls: ['./como-instalar.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ComoInstalarComponent implements OnInit, AfterViewInit {
	@ViewChild('inputAdesivo') inputAdesivo: ElementRef;

  public fromOverview = false
  public controlAdesivo = new FormControl('');
  public bgcontent;
  public txtcontent;
  public full = false;
  public disabled = true;

  /**
   * [constructor description]
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gtmService: GoogleTagManagerService
  ) {

    this.route.queryParams.subscribe(params => {
      this.fromOverview = params.r === '' || !!params.r;
    });
  }

  ngOnInit() {
    this.bgcontent  = 'image8';
    this.txtcontent = '<h1>Design e tecnologia</h1><p>Em alguns passos você terá acesso livre a todos os pedágios e estacionamentos do pais</p>';
  }

  ngAfterViewInit() {
  	this.gtmService.sendPageView();
  }
}
