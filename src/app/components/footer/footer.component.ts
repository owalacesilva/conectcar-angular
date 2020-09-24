import { Component, ViewEncapsulation } from '@angular/core';
import { RecursosService } from 'app/services/recursos.service';

@Component({
  selector: 'cc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class FooterComponent {

  constructor(private R: RecursosService) { }
}
