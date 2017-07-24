import { Observable, BehaviorSubject } from 'rxjs';
import { AuthenticationService } from 'ngx-login-client';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-settings-tokens',
  templateUrl: 'tokens.component.html',
  styleUrls: ['./tokens.component.less']
})
export class TokensComponent {

  hidden = true;
  private _hiddenSubject = new BehaviorSubject<boolean>(true);

  constructor(private authService: AuthenticationService) {
  }

  show() {
    this.hidden = false;
    Observable.timer(120000).subscribe(val => this.hidden = true);
  }

  get personalAccessToken(): string {
    return this.hidden ? '' : this.authService.getToken();
  }


}
