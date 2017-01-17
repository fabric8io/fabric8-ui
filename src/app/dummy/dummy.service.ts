import { Context } from './../models/context';
import { ContextType } from './../models/context-type';
import { Space } from './../models/space';
import { Resources } from './../models/resources';
import { ProcessTemplate } from './../models/process-template';
import { User } from './../models/user';
import { Team } from './../models/team';
import { Entity } from './../models/entity';
import { Email } from './../models/email';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Broadcaster } from '../shared/broadcaster.service';

import 'rxjs/add/operator/toPromise';

// A service responsible for providing dummy data for the UI prototypes.

@Injectable()
export class DummyService {

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

  readonly CONTEXT_TYPES: Map<string, ContextType> = new Map<string, ContextType>([
    [
      'user',
      {
        name: 'User',
        icon: 'fa fa-user',
        menus: [
          {
            name: 'Home',
            path: '/home'
          }, {
            name: 'Profile',
            path: '',
            menus: [
              {
                name: 'Profile',
                path: ''
              }, {
                name: 'Collaboration Spaces',
                path: 'spaces'
              }, {
                name: 'Resources',
                path: 'resources'
              }
            ]
          },
          {
            path: 'settings',
            icon: 'pficon pficon-settings',
            menus: [
              {
                name: 'Profile',
                path: ''
              }/*, {
                // Account is disabled as we don't yet support users creating accounts
                name: 'Account',
                path: 'account'
              }*/, {
                name: 'Emails',
                path: 'emails'
              }, {
                name: 'Notifications',
                path: 'notifications'
              }
            ]
          },
        ]
      } as ContextType
    ],
    [
      'space',
      {
        name: 'Space',
        icon: 'fa fa-space-shuttle',
        menus: [
          {
            name: 'Analyze',
            path: '',
            menus: [
              {
                name: 'Overview',
                path: ''
              }, {
                name: 'README',
                path: 'readme'
              }
            ]
          }, {
            name: 'Plan',
            path: 'plan',
            menus: [
              {
                name: 'Backlog',
                path: ''
              }, {
                name: 'Board',
                path: 'board'
              }
            ]
          }, {
            name: 'Create',
            path: 'create',
            menus: [
              {
                name: 'Codebases',
                path: ''
              }, {
                name: 'Workspaces',
                path: 'workspaces'
              }
            ]
          }, {
            name: 'Run',
            path: 'run',
            menus: [
              {
                name: 'Pipelines',
                path: ''
              }
            ]
          }, {
            name: '',
            path: 'settings',
            icon: 'pficon pficon-settings',
            menus: [
              {
                name: 'Overview',
                path: '',
                icon: '',
                menus: []
              }, {
                name: 'Work',
                path: 'work'
              }, {
                name: 'Security',
                path: 'security'
              }, {
                name: 'Alerts',
                path: 'alerts'
              }
            ]
          },
        ]
      } as ContextType
    ],
    [
      'team',
      {
        name: 'Team',
        icon: 'fa fa-users'
      } as ContextType
    ],
    [
      'organization',
      {
        name: 'Organization',
        icon: 'fa fa-cubes'
      } as ContextType
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
      } as Team,
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

  readonly SPACES: Map<string, Space> = new Map<string, Space>([
    [
      'bobo',
      {
        name: 'Bobo',
        path: '/pmuir/BalloonPopGame',
        description: 'Microservices architected search engine',
        teams: [],
        defaultTeam: null
      } as Space
    ], [
      'hysterix',
      {
        name: 'Hysterix',
        path: '/pmuir/BalloonPopGame',
        description: 'Hystrix is a latency and fault tolerance library designed to isolate points of access to remote systems, services and 3rd party libraries, stop cascading failure and enable resilience in complex distributed systems where failure is inevitable.',
        teams: [],
        defaultTeam: null
      } as Space
    ], [
      'fabric8',
      {
        name: 'fabric8io',
        path: '/pmuir/BalloonPopGame',
        description: 'Fabric8 is an open source integrated development platform for Kubernetes',
        teams: [],
        defaultTeam: null
      } as Space
    ], [
      'balloonpopgame',
      {
        name: 'BalloonPopGame',
        path: '/pmuir/BalloonPopGame',
        description: 'Balloon popping fun for everyone!',
        teams: [
          this.TEAMS.get('balloonpopgame'),
          this.TEAMS.get('balloonpopgame_ux')
        ],
        defaultTeam: this.TEAMS.get('balloonpopgame')
      } as Space
    ]
  ]);

  readonly CONTEXTS: Map<string, Context> = new Map<string, Context>([
    [
      'pmuir',
      {
        entity: this.USERS.get('pmuir'),
        type: this.CONTEXT_TYPES.get('user'),
        path: '/pmuir',
        name: 'pmuir'
      } as Context
    ], [
      'balloonpopgame',
      {
        entity: this.USERS.get('pmuir'),
        space: this.SPACES.get('balloonpopgame'),
        type: this.CONTEXT_TYPES.get('space'),
        path: '/pmuir/BalloonPopGame',
        name: 'BalloonPopGame'
      } as Context
    ], [
      'ux',
      {
        entity: this.USERS.get('pmuir'),
        space: this.SPACES.get('balloonpopgame'),
        team: this.TEAMS.get('balloonpopgame_ux'),
        type: this.CONTEXT_TYPES.get('team'),
        path: null,
        name: 'BalloonPopGame / UX Team'
      } as Context
    ], [
      'redhat',
      {
        entity: this.ORGANIZATIONS.get('redhat'),
        type: this.CONTEXT_TYPES.get('organization'),
        path: null,
        name: 'Red Hat Organization'
      } as Context
    ]
  ]);

  readonly PROCESS_TEMPLATES: ProcessTemplate[] = [
    { name: 'Agile' },
    { name: 'Scrum' },
    { name: 'Issue Tracking' },
    { name: 'Scenario Driven Planning' }
  ];
  private _spaces: Space[];
  private _contexts: Context[];
  private _users: User[];
  private _defaultContext: Context;
  private _currentUser: User;

  constructor(
    private http: Http,
    private localStorageService: LocalStorageService,
    private broadcaster: Broadcaster
  ) {
    this._spaces = this.initDummy('spaces', this.SPACES);
    this._contexts = this.initDummy('contexts', this.CONTEXTS);
    this._users = this.initDummy('users', this.USERS);
    this._defaultContext = this._contexts[0];
    this.broadcaster.on<string>('save')
      .subscribe(message => {
        this.save();
      });
    this.broadcaster.on<User>('currentUserInit').subscribe(
      message => {
        this.addUser(message);
      }
    );
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

  get contexts(): Context[] {
    return this._contexts;
  }

  get processTemplates(): ProcessTemplate[] {
    return this.PROCESS_TEMPLATES;
  }

  get defaultContext(): Context {
    return this._defaultContext;
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
    this.localStorageService.set('contexts', this._contexts);
    this.localStorageService.set('users', this._users);
  }

  lookupUser(username: string, fullName: string): User {
    for (let u of this.users) {
      // TODO Fullname is a hack until we get a bit more info back from github
      if (u.attributes.username === username || u.attributes.fullName === fullName) {
        return u;
      }
    }
    return null;
  }

  private addUser(add: User) {
    let existing: User = this.lookupUser(add.attributes.username, add.attributes.fullName);
    if (existing) {
      this.currentUser = existing;
    } else {
      this.currentUser = add;
      this.users.push(add);
      this.save();
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
