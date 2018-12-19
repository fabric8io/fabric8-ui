import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from 'ngx-login-client';

import { LoginService } from '../../services/login.service';

@Component({
  selector: 'alm-login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  showError: boolean = false;
  feedbackMessage: string = '';
  statusCode: number = 0;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/'], {});
    }
  }

  gitSignin() {
    this.loginService.gitHubSignIn();
  }

  checkStatus(loginStatus: any) {
    if (loginStatus.token) {
      this.router.navigate(['/'], {});
    } else {
      this.statusCode = loginStatus.status;
      this.feedbackMessage = loginStatus.responseText;
      this.showError = true;
    }
  }

  closeAlert() {
    this.showError = false;
  }
}
