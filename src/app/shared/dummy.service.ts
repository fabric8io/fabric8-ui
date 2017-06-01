import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/toPromise';
import { Broadcaster } from 'ngx-base';
import { User, Entity } from 'ngx-login-client';
import { Team, Space, ProcessTemplate, Context, ContextType, ContextTypes } from 'ngx-fabric8-wit';
import { Resources } from './../models/resources';
import { Email } from './../models/email';



// A service responsible for providing dummy data for the UI prototypes.

@Injectable()
export class DummyService {

  readonly RESERVED_WORDS: string[] = [
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
    {
      name: 'Scenario Driven Planning',
      description: `An agile development methodology focused on real-world problems, or Scenarios, described in the language and from the viewpoint of the user. Scenarios deliver particular Value Propositions and are realized via Experiences.`
    }
  ];

  constructor(
    private http: Http,
    private localStorageService: LocalStorageService,
    private broadcaster: Broadcaster
  ) {
  }

  get resources(): Resources {
    return this.RESOURCES;
  }

  get processTemplates(): ProcessTemplate[] {
    return this.PROCESS_TEMPLATES;
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
