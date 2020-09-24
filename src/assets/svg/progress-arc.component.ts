import { Component, Input } from '@angular/core';

@Component({
  selector: 'cc-progress-arc',
  templateUrl: './progress-arc.component.html',
  styleUrls: ['./progress-arc.component.less']
})
export class ProgressArcComponent {
  @Input()
  progress = 0;
}
