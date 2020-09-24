import { Component, OnInit } from '@angular/core';
import { RegistrationProgress } from 'app/modules/registration/models/registration-progress';

@Component({
  selector: 'reg-menu',
  templateUrl: './registration-menu.component.html',
  styleUrls: ['./registration-menu.component.less']
})
export class RegistrationMenuComponent implements OnInit {
  public progress = RegistrationProgress;
  constructor(
  ) {}

  ngOnInit() {

  }
}
