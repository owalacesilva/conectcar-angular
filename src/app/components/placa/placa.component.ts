import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RecursosService } from 'app/services/recursos.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Masks } from 'app/masks';

@Component({
  selector: 'app-placa',
  templateUrl: './placa.component.html',
  styleUrls: ['./placa.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class PlacaComponent implements AfterViewInit {
  @Input('readonly') readonly = false;
  @ViewChild('inputChars') inputChars: ElementRef;
  @ViewChild('inputNumbers') inputNumbers: ElementRef;

  plaque1 = new FormControl('');
  plaque2 = new FormControl('');

  public disabled = true

  mask1 = [/[a-zA-Z]/, /[a-zA-Z]/, /[a-zA-Z]/]
  mask2 = [/\d/, /\d/, /\d/, /\d/]

  private modalRef: NgbModalRef;

  constructor(
    private _modalService: NgbModal,
    private R: RecursosService
  ) { }

  ngAfterViewInit() {
    this.inputChars.nativeElement.focus();
    if (this.readonly) {
      this.inputChars.nativeElement.disabled = 'disabled';
      this.inputNumbers.nativeElement.disabled = 'disabled';
    }
  }

  onInput1() {
    if (this.plaque1.value) {
      this.plaque1.setValue(this.plaque1.value.toUpperCase());
    }

    if (this.plaque1.value.length === 3) {
      this.inputNumbers.nativeElement.focus();
    }

    this.onInput2();
  }

  onInput2() {
    this.disabled = !(
      this.plaque1.value.length === 3 &&
      this.plaque2.value.length === 4
    );
  }

  add(e?) {
    // enter handler
    console.log('--')
  }
}
