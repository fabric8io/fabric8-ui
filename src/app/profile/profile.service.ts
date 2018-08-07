import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { cloneDeep } from 'lodash';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { AUTH_API_URL, AuthenticationService, Profile, User, UserService } from 'ngx-login-client';
import { ConnectableObservable, Observable } from 'rxjs';

export class ExtUser extends User {
  attributes: ExtProfile;
}

export class ExtProfile extends Profile {
  store: any;
}

/*
 * A service that manages the users profile
 *
 */
@Injectable()
export class ProfileService {

  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  private profileUrl: string;
  private _profile: ConnectableObservable<ExtProfile>;

  constructor(
    private userService: UserService,
    private auth: AuthenticationService,
    private http: HttpClient,
    private notifications: Notifications,
    @Inject(AUTH_API_URL) apiUrl: string
  ) {
    if (this.auth.getToken() != undefined) {
      this.headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    this.profileUrl = apiUrl + 'users';
    this._profile = this.userService.loggedInUser
      .skipWhile(user => {
        return !user || !user.attributes;
      })
      .map(user => cloneDeep(user) as ExtUser)
      .do(user => {
        if (user.attributes) {
          user.attributes.store = (user as any).attributes.contextInformation || {};
        } else {
          user.attributes = { 'fullName': '', 'imageURL': '', 'username': '', 'store': { } };
        }
      })
      .map(user => user.attributes)
      .publishReplay(1);
    this._profile.connect();
  }

  get current(): Observable<ExtProfile> {
    return this._profile;
  }

  save(profile: Profile) {
    return this.silentSave(profile).do(val => this.notifications.message({
      message: 'User profile updated',
      type: NotificationType.SUCCESS
    } as Notification))
      .catch(error => {
        this.notifications.message({
          message: 'Ooops, something went wrong, your profile was not updated',
          type: NotificationType.DANGER
        } as Notification);
        console.log('Error updating user profile', error);
        return Observable.empty();
      });
  }

  silentSave(profile: Profile) {
    let clone = cloneDeep(profile) as any;
    delete clone.username;
    // Handle the odd naming of the field on the API
    clone.contextInformation = clone.store;
    delete clone.store;
    let payload = JSON.stringify({
      data: {
        attributes: clone,
        type: 'identities'
      }
    });
    return this.http
      .patch(this.profileUrl, payload, { headers: this.headers })
      .map((response: HttpResponse<User>) => response);
  }

  get sufficient(): Observable<boolean> {
    return this.current.map(current => {
      if (current &&
        current.fullName &&
        current.email &&
        current.username
        // TODO Add imageURL
        //this.current.imageURL
      ) {
        return true;
      } else {
        return false;
      }
    });
  }

}
