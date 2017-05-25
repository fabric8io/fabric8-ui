import {Http, Headers} from "@angular/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Observable, ConnectableObservable} from "rxjs";
import {cloneDeep} from "lodash";
import {Broadcaster, Notifications, Notification, NotificationType} from "ngx-base";
import {Profile, User, UserService} from "ngx-login-client";
import {DummyService} from "./../shared/dummy.service";
import {ApiLocatorService} from "../shared/api-locator.service";
import {pathJoin} from "fabric8-runtime-console/src/app/kubernetes/model/utils";

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

  private static readonly HEADERS: Headers = new Headers({ 'Content-Type': 'application/json' });
  private _profile: ConnectableObservable<ExtProfile>;

  constructor(
    private dummy: DummyService,
    private router: Router,
    private broadcaster: Broadcaster,
    userService: UserService,
    private apiLocator: ApiLocatorService,
    private http: Http,
    private notifications: Notifications
  ) {
    this._profile = userService.loggedInUser
      .skipWhile(user => {
        return !user || !user.attributes;
      })
      .map(user => cloneDeep(user) as ExtUser)
      .do(user => {
        if(user.attributes) {
          user.attributes.store = (user as any).attributes.contextInformation || {};
        } else {
          user.attributes = { "fullName": "", "imageURL": "", "username": "", "store": { } };
        }
      })
      .map(user => user.attributes)
      .publishReplay(1);
    this._profile.connect();
  }

  protected get apiUrl(): string {
    return this.apiLocator.witApiUrl;
  }

  protected get profileUrl(): string {
    return pathJoin(this.apiUrl, 'users');
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
      .patch(this.profileUrl, payload, { headers: ProfileService.HEADERS })
      .map((response) => {
        return response.json().data as User;
      });
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
