import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { AuthenticationService } from 'ngx-login-client';
import { OnLogin } from 'fabric8-runtime-console/src/app/shared/onlogin.service';


@Component({
  selector: 'alm-pipelines',
  templateUrl: 'pipelines.component.html',
  styleUrls: ['./pipelines.component.scss']
})
export class PipelinesComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private onLogin: OnLogin
    ) {
  }

  ngOnInit() {
    this.authService.getOpenShiftToken().subscribe((token) => {
      this.onLogin.onLogin(token);
    });

  }

}
