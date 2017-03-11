import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/toPromise';
import { Broadcaster, User, Entity } from 'ngx-login-client';
import { Team, Space, ProcessTemplate, Context, ContextType, ContextTypes } from 'ngx-fabric8-wit';
import { Resources } from './../models/resources';
import { Email } from './../models/email';



// A service responsible for providing dummy data for the UI prototypes.

@Injectable()
export class DummyService {

  readonly RESERVED_WORDS: string[] = [
    'home', 'public'
  ];

  readonly RESOURCES: Resources = {
    startDate: new Date(2016, 8, 1, 0, 0, 0, 0),
    endDate: new Date(2016, 8, 30, 23, 59, 59, 0),
    list: [
      {
        type: {
          name: 'Pipeline',
          unit: 'minutes'
        },
        value: 124,
        max: 200
      }, {
        type: {
          name: 'Environments',
          unit: 'RAM-minutes'
        },
        value: 7185,
        max: 18000
      }
    ]
  };

  readonly USERS: Map<string, User> = new Map<string, User>(
    [
      [
        'pmuir',
        {
          attributes: {
            fullName: 'Pete Muir',
            imageURL: 'https://avatars2.githubusercontent.com/u/157761?v=3&s=460',
            email: 'pmuir@fabric8.io',
            username: 'pmuir',
            bio: 'I like writing clever one-line bios about myself. See? I just did.'
          },
          id: '111',
          type: ''
        } as User
      ], [
        'qodfathr',
        {
          attributes: {
            fullName: 'Todd Manicini',
            imageURL: 'https://avatars1.githubusercontent.com/u/16322190?v=3&s=460',
            email: 'tmancini@fabric8.io',
            bio: 'I like writing clever one-line bios about myself. But, I can\'t!',
            username: 'qodfathr'
          },
          id: '222',
          type: ''
        } as User
      ]
    ]
  );

  readonly ORGANIZATIONS: Map<string, Entity> = new Map<string, Entity>([
    [
      'redhat',
      {
        id: 'redhat'
      } as Entity
    ]
  ]);

  readonly TEAMS: Map<string, Team> = new Map<string, Team>([
    [
      'balloonpopgame_ux',
      {
        name: '',
        members: [
          this.USERS.get('qodfathr')
        ]
      } as Team
    ], [
      'balloonpopgame',
      {
        name: '',
        members: [
          this.USERS.get('pmuir'),
          this.USERS.get('qodfathr')
        ]
      } as Team
    ]
  ]);

  readonly PROCESS_TEMPLATES: ProcessTemplate[] = [
    { name: 'Agile' },
    { name: 'Scrum' },
    { name: 'Issue Tracking' },
    { name: 'Scenario Driven Planning' }
  ];
  private _spaces: Space[];
  private _recentContexts: Context[];
  private _users: User[];
  private _currentUser: User;

  constructor(
    private http: Http,
    private localStorageService: LocalStorageService,
    private broadcaster: Broadcaster
  ) {
    this._spaces = [];
    this._recentContexts = [];
    this._users = this.initDummy('users', this.USERS);
    this.broadcaster.on<string>('save')
      .subscribe(message => {
        this.save();
      });

    this.broadcaster.on<string>('logout').subscribe(
      message => {
        this._currentUser = null;
      }
    );
    this.save();
  }

  get spaces(): Space[] {
    return this._spaces;
  }

  get resources(): Resources {
    return this.RESOURCES;
  }

  get recent(): Context[] {
    return this._recentContexts;
  }

  set recent(recent: Context[]) {
    this._recentContexts = recent;
  }

  get processTemplates(): ProcessTemplate[] {
    return this.PROCESS_TEMPLATES;
  }

  get users(): User[] {
    return this._users;
  }

  get currentUser(): User {
    return this._currentUser;
  }

  set currentUser(user: User) {
    this._currentUser = user;
  }

  save(): void {
    this.localStorageService.set('spaces', this._spaces);
    this.localStorageService.set('contexts', this._recentContexts);
    this.localStorageService.set('users', this._users);
  }

  lookupUser(username: string): User {
    for (let u of this.users) {
      if (u.attributes.username === username) {
        return u;
      }
    }
    return null;
  }

  public addUser(add: User) {
    if (add && add.attributes) {
      let existing: User = this.lookupUser(add.attributes.username);
      if (existing) {
        this.currentUser = existing;
      } else {
        this.currentUser = add;
        this.users.push(add);
        this.save();
      }
      this.broadcaster.broadcast('currentUserChanged', this.currentUser);
    }
  }

  private makePseudoRandmonString(len: number): string {
    let text: string = '';
    let possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i: number = 0; i < len; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private valuesAsArray<T>(m: Map<any, T>): T[] {
    let res: T[] = new Array<T>();
    m.forEach(function (value) {
      res.push(value);
    });
    return res;
  }

  private copyValuesToArray<T>(m: Map<any, T>): T[] {
    return JSON.parse(JSON.stringify(this.valuesAsArray(m)));
  }

  private initDummy<T>(key: string, def: Map<any, T>): T[] {
    let res: T[];
    if (this.localStorageService.get(key)) {
      res = this.localStorageService.get<T[]>(key);
    } else {
      res = this.copyValuesToArray(def);
    }
    return res;
  }

}
