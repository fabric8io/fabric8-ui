import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { AUTH_API_URL, AuthenticationService, Profile, User, UserService } from 'ngx-login-client';
import { ConnectableObservable, EMPTY, Observable } from 'rxjs';
import { catchError, map, publishReplay, skipWhile, tap } from 'rxjs/operators';

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
    @Inject(AUTH_API_URL) apiUrl: string,
  ) {
    if (this.auth.getToken() != null) {
      this.headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    this.profileUrl = apiUrl + 'users';
    this._profile = this.userService.loggedInUser.pipe(
      skipWhile((user) => !user || !user.attributes),
      map((user) => cloneDeep(user) as ExtUser),
      tap((user) => {
        if (user.attributes) {
          user.attributes.store = (user as any).attributes.contextInformation || {};
        } else {
          user.attributes = { fullName: '', imageURL: '', username: '', store: {} };
        }
      }),
      map((user) => user.attributes),
      publishReplay(1),
    ) as ConnectableObservable<ExtProfile>;
    this._profile.connect();
  }

  get current(): Observable<ExtProfile> {
    return this._profile;
  }

  save(profile: Profile) {
    return this.silentSave(profile).pipe(
      tap((val) =>
        this.notifications.message({
          message: 'User profile updated',
          type: NotificationType.SUCCESS,
        } as Notification),
      ),
      catchError((error) => {
        this.notifications.message({
          message: 'Ooops, something went wrong, your profile was not updated',
          type: NotificationType.DANGER,
        } as Notification);
        console.log('Error updating user profile', error);
        return EMPTY;
      }),
    );
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
        type: 'identities',
      },
    });
    return this.http
      .patch(this.profileUrl, payload, { headers: this.headers })
      .pipe(map((response: HttpResponse<User>) => response));
  }

  get sufficient(): Observable<boolean> {
    return this.current.pipe(
      map((current) => {
        if (
          current &&
          current.fullName &&
          current.email &&
          current.username
          // TODO Add imageURL
          //this.current.imageURL
        ) {
          return true;
        }
        return false;
      }),
    );
  }
}
