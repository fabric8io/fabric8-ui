import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Spaces, Context, Contexts } from 'ngx-fabric8-wit';
import { UserService, User } from 'ngx-login-client';

import { DummyService } from './../shared/dummy.service';

@Component({
  host: {
    'class': "app-component"
  },
  selector: 'alm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loggedInUser: User;

  private _context: Context;
  private _defaultContext: Context;

  constructor(
    public dummy: DummyService,
    userService: UserService,
    public spaces: Spaces,
    private router: Router,
    private contexts: Contexts
  ) {
    userService.loggedInUser.subscribe(val => this.loggedInUser = val);
    contexts.current.subscribe(val => {
      this._context = val;
    });
    contexts.default.subscribe(val => {
      this._defaultContext = val;
    });
  }

  ngOnInit() { }

  get context(): Context {
    if (this.router.url === '/_home') {
      return this._defaultContext;
    } else {
      return this._context;
    }
  }

}
