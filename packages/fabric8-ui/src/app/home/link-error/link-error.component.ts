import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoginService } from '../../shared/login.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-link-error',
  templateUrl: './link-error.component.html',
})
export class LinkErrorComponent implements OnInit {
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {}

  logout(): void {
    this.loginService.logout();
  }
}
