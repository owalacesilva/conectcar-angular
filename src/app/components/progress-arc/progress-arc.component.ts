import { Component, Input } from '@angular/core';

@Component({
  selector: 'cc-progress-arc',
  templateUrl: './progress-arc.component.html',
  styleUrls: ['./progress-arc.component.less']
})
export class ProgressArcComponent {
  @Input() progress = 0;
  @Input() size = 40;
  @Input() stroke = 2;
  @Input() emptyStrokeColor = '#D8DBDE';

  radius = () => (this.size / 2) - 2;
  circunference = () => Math.PI * (this.radius() * 2);
  offset = () => this.circunference() * (1 - this.progress);
}
