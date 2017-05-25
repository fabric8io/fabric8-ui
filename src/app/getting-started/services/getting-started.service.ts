import {Injectable, OnDestroy} from "@angular/core";
import {Headers, Http} from "@angular/http";
import {Observable, Subscription} from "rxjs";
import {Logger} from "ngx-base";
import {AuthenticationService, Profile, User, UserService} from "ngx-login-client";
import {cloneDeep} from "lodash";
import {ApiLocatorService} from "../../shared/api-locator.service";
import {pathJoin} from "fabric8-runtime-console/src/app/kubernetes/model/utils";

export class ExtUser extends User {
  attributes: ExtProfile;
}

export class ExtProfile extends Profile {
  contextInformation: any;
  registrationCompleted: boolean;
}

@Injectable()
export class GettingStartedService implements OnDestroy {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private loggedInUser: User;
  subscriptions: Subscription[] = [];

  constructor(
      private auth: AuthenticationService,
      private http: Http,
      private logger: Logger,
      private apiLocator: ApiLocatorService,
      private userService: UserService) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
  }

  protected get apiUrl(): string {
    return this.apiLocator.witApiUrl;
  }

  protected get usersUrl(): string {
    return pathJoin(this.apiUrl, 'users');
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
