import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Space, SpaceService, Context, Contexts } from 'ngx-fabric8-wit';
import { UserService, User } from 'ngx-login-client';

import { Logger } from 'ngx-base';

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
  private _spaces: Space[] = [];

  constructor(
    private userService: UserService,
    private spaceService: SpaceService,
    private router: Router,
    private contexts: Contexts,
    private logger: Logger
  ) {
  }

  ngOnInit() {
    this.userService.loggedInUser.subscribe(val => this.loggedInUser = val);
    this.contexts.current.subscribe(val => {
      this._context = val;
    });
    this.contexts.default.subscribe(val => {
      this._defaultContext = val;
      this.initSpaces();
    });
  }

  initSpaces() {
    if (this.context && this.context.user) {
      this.spaceService
        .getSpacesByUser(this.context.user.attributes.username, 5)
        .subscribe(spaces => {
          this._spaces = spaces;
        });
    } else {
      this.logger.error("Failed to retrieve list of spaces owned by user");
    }
  }

  get context(): Context {
    if (this.router.url === '/_home') {
      return this._defaultContext;
    } else {
      return this._context;
    }
  }

}
