import { Component, ViewEncapsulation } from '@angular/core';
import * as store from 'store';

@Component({
  selector: 'cc-baixe-app',
  templateUrl: './baixe-app.component.html',
  styleUrls: ['./baixe-app.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class BaixeAppComponent {
  private userAgent = '';

  constructor() {
    const ua = window.navigator.userAgent;

    if (ua.match(/iPad/i) || ua.match(/iPhone/i)) {
      this.userAgent = 'ios';
    }

    if (ua.match(/Android/i)) {
      this.userAgent = 'android';
    }
  }
}
