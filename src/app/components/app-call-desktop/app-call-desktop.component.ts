import { Component, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import * as localStore from 'store';

@Component({
  selector: 'cc-app-call-desktop',
  templateUrl: './app-call-desktop.component.html',
  styleUrls: ['./app-call-desktop.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AppCallDesktopComponent {

  constructor(private viewContainerRef: ViewContainerRef) {
  	let dismissed = localStore.get('callDownloadApp__dismissed');

  	if( dismissed === undefined ) {
			localStore.set('callDownloadApp__dismissed', 0);
  	} else if( dismissed == 1 ) {
			this.dismiss();  		
  	}
  }

  dismiss() {
  	localStore.set('callDownloadApp__dismissed', 1);

  	this.viewContainerRef.
      element.nativeElement.
      parentElement.
      removeChild(this.viewContainerRef.element.nativeElement);
  }
}