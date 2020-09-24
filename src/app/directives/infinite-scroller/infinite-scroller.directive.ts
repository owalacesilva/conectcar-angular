import { Directive, AfterViewInit, ElementRef, Input, HostListener } from '@angular/core';
import { Observable, Subscription }                    from 'rxjs/Rx';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';

interface ScrollPosition {
  sH: number;
  sT: number;
  cH: number;
};

const DEFAULT_SCROLL_POSITION: ScrollPosition = {
  sH: 0,
  sT: 0,
  cH: 0
};

/**
 * [Directive description]
 * 
 * @param {'[infiniteScroller]' }} { selector [description]
 */
@Directive({ 
	selector: '[infiniteScroller]' 
})
export class InfiniteScrollerDirective implements AfterViewInit {

	/**
	 * [scrollEvent$ description]
	 * 
	 * @type {[type]}
	 */
  private scrollEvent$;
  private userScrolledDown$;
  private requestStream$;
  private requestOnScroll$;

  @Input()
  scrollCallback;

  @Input()
  immediateCallback;

  @Input()
  scrollPercent = 10;

  /**
   * [constructor description]
   * 
   * @param {ElementRef} private elm [description]
   */
  constructor(private elm: ElementRef) { }

  /**
   * [ngAfterViewInit description]
   */
  ngAfterViewInit() {

    this.registerScrollEvent();
    this.streamScrollEvents();
    this.requestCallbackOnScroll();
  }

  /**
   * [registerScrollEvent description]
   */
  private registerScrollEvent() {

  	//this.elm.nativeElement
    //this.scrollEvent$ = Observable.fromEvent(this.elm.nativeElement, 'scroll');
    this.scrollEvent$ = Observable.fromEvent(document.documentElement, 'scroll');
  }

  /**
   * [streamScrollEvents description]
   */
  private streamScrollEvents() {
    this.userScrolledDown$ = this.scrollEvent$
      .map((e: any): ScrollPosition => ({
        sH: e.target.scrollHeight,
        sT: e.target.scrollTop,
        cH: e.target.clientHeight
      }))
      .pairwise()
      .filter(positions => this.isUserScrollingDown(positions) && this.isScrollExpectedPercent(positions[1]))
  }

  /**
   * [requestCallbackOnScroll description]
   */
  private requestCallbackOnScroll() {

    this.requestOnScroll$ = this.userScrolledDown$;

    if (this.immediateCallback) {
      this.requestOnScroll$ = this.requestOnScroll$
        .startWith([DEFAULT_SCROLL_POSITION, DEFAULT_SCROLL_POSITION]);
    }

    this.requestOnScroll$
      .exhaustMap(() => { return this.scrollCallback(); })
      .subscribe(() => { });
  }

  /**
   * [isUserScrollingDown description]
   * 
   * @type {Boolean}
   */
  private isUserScrollingDown = (positions) => {
    return positions[0].sT < positions[1].sT;
  }

  /**
   * [isScrollExpectedPercent description]
   * 
   * @type {Boolean}
   */
  private isScrollExpectedPercent = (position) => {
    return ((position.sT + position.cH) / position.sH) > (this.scrollPercent / 100);
  }
}