import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/modules/registration/services/authentication.service';


@Component({ selector: 'app-logout', template: '' })
export class LogoutComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.loadLogout()
  }
}
