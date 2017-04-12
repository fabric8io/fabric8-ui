import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs';

import { Logger } from 'ngx-base';
import { AuthenticationService, Profile, User, UserService } from 'ngx-login-client';
import { WIT_API_URL } from 'ngx-fabric8-wit';

import { cloneDeep } from 'lodash';

export class ExtUser extends User {
  attributes: ExtProfile;
}

export class ExtProfile extends Profile {
  contextInformation: any;
  registrationCompleted: boolean;
}

@Injectable()
export class GettingStartedService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private loggedInUser: User;
  private usersUrl: string;

  constructor(
      private auth: AuthenticationService,
      private http: Http,
      private logger: Logger,
      private userService: UserService,
      @Inject(WIT_API_URL) apiUrl: string) {
    userService.loggedInUser.subscribe(user => {
      if (user !== undefined && user.attributes !== undefined) {
        this.loggedInUser = user;
      }
    });
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.usersUrl = apiUrl + 'users';
  }

  /**
   * Create transient profile with context information
   *
   * @returns {ExtProfile}
   */
  createTransientProfile(): ExtProfile {
    let profile = cloneDeep(this.loggedInUser) as ExtUser;

    if(profile.attributes) {
      profile.attributes.contextInformation = (this.loggedInUser as ExtUser).attributes.contextInformation || {};
    } else {
      profile.attributes = {
        "contextInformation": {},
        "fullName": "",
        "imageURL": "",
        "username": "",
        "registrationCompleted": false
      };
    }
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
