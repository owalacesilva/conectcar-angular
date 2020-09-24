import { NgModule } from '@angular/core';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { FocusWatcherDirective } from './focus-watcher/focus-watcher.directive';
import { InfiniteScrollerDirective } from './infinite-scroller/infinite-scroller.directive';

@NgModule({
  declarations: [
    PlaceholderDirective,
    FocusWatcherDirective,
    InfiniteScrollerDirective,
  ],
  exports: [
    PlaceholderDirective,
    FocusWatcherDirective,
    InfiniteScrollerDirective,
  ]
})
export class DirectivesModule { }
