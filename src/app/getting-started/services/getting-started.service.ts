import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, Profile, User, UserService } from 'ngx-login-client';
import { Observable, Subscription } from 'rxjs';

import { cloneDeep } from 'lodash';

export class ExtUser extends User {
  attributes: ExtProfile;
}

export class ExtProfile extends Profile {
  contextInformation: any;
  registrationCompleted: boolean;
  featureLevel: string;
}

@Injectable()
export class GettingStartedService implements OnDestroy {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private loggedInUser: User;
  subscriptions: Subscription[] = [];
  private usersUrl: string;

  constructor(
      private auth: AuthenticationService,
      private http: Http,
      private logger: Logger,
      private userService: UserService,
      @Inject(WIT_API_URL) apiUrl: string) {
    if (this.auth.getToken() != undefined) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.usersUrl = apiUrl + 'users';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  createTransientProfile(): ExtProfile {
    let profile: ExtUser;

    this.userService.loggedInUser
      .map(user => {
        profile = cloneDeep(user) as ExtUser;
        if (profile.attributes != undefined) {
          profile.attributes.contextInformation = (user as ExtUser).attributes.contextInformation || {};
        }
      })
      .publish().connect();

    return profile.attributes;
  }

  /**
   * Get extended profile for given user ID
   *
   * @param id The user ID
   * @returns {Observable<ExtUser>}
   */
  getExtProfile(id: string): Observable<ExtUser> {
    let url = `${this.usersUrl}/${id}`;
    return this.http
      .get(url, { headers: this.headers })
      .map(response => {
        return response.json().data as ExtUser;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Update user profile
   *
   * @param profile The extended profile used to apply context information
   * @returns {Observable<User>}
   */
  update(profile: ExtProfile): Observable<ExtUser> {
    let payload = JSON.stringify({
      data: {
        attributes: profile,
        type: 'identities'
      }
    });
    return this.http
      .patch(this.usersUrl, payload, { headers: this.headers })
      .map(response => {
        return response.json().data as ExtUser;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  // Private

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }
}
