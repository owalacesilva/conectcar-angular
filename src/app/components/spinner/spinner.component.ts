import { Component, Input } from '@angular/core';

@Component({
  selector: 'cc-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.less']
})
export class SpinnerComponent {
  @Input() size = 0;
  @Input() color = '#f0f0f0';
  @Input() stroke = 2;
}
