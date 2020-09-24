import { Injectable, Inject } from "@angular/core";
import { WindowRefService } from "./window-ref-service.service";
declare let ga: Function;

/**
 * [Injectable description]
 */
@Injectable()
export class GoogleTagManagerService {

	private _window: any;

	constructor(windowRef: WindowRefService) {
		this._window = windowRef.nativeWindow;
	}

	/**
	 * [emitEvent description]
	 *
	 * @param {string}    eventCategory [description]
	 * @param {string}    eventAction   [description]
	 * @param {string =             null}        eventLabel [description]
	 * @param {number =             null}        eventValue [description]
	 */
  public emitEvent(eventCategory: string, eventAction: string, eventLabel: string = null, eventValue: number = null) {
  	try {
	    if (typeof ga === 'undefined' || !ga) throw "Not defined";

	    ga('send', 'event', {
	      eventCategory: eventCategory,
	      eventAction: eventAction,
	      eventLabel: eventLabel,
	      eventValue: eventValue
	    });
  	} catch(err) {
  		console.error(err);
  	}
  }

  /**
   * [sendPageView description]
   *
   * @param {any} urlPage [description]
   */
  public sendPageView(urlPage: string = null) {
  	try {
	    if (typeof ga === 'undefined' || !ga) throw "Not defined";

	  	if(urlPage != null) {
	  		ga('set', 'page', urlPage);
	  	}

	  	ga('send', 'pageView');

  	} catch(err) {
  		console.error(err);
  	}
  }

  /**
   * [setDataLayer description]
   * 
   * @param {any} variable [description]
   * @param {any} value    [description]
   */
  public setDataLayer(variable: any, value: any) {
		var dataLayer = this._window.dataLayer = this._window.dataLayer || [];
  	dataLayer.push({ [variable]: value });
  }
}
