import { Component, AfterViewInit, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'legal-terms',
  templateUrl: './legal-terms.component.html',
  styleUrls: ['./legal-terms.component.less']
})
export class LegalTermsComponent implements AfterViewInit, OnInit {

	@Output('close') eventClose: EventEmitter<any> = new EventEmitter<any>();
	@Input('term') term;

  constructor() {
  	this.term = 'politicas';
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  closeTerms() {
  	this.eventClose.emit();
  }
}
