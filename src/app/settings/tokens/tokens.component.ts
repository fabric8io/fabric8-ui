import { Observable, BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from "../../shared/authentication.service";

@Component({
  selector: 'f8-settings-tokens',
  templateUrl: 'tokens.component.html',
  styleUrls: ['./tokens.component.scss']
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
