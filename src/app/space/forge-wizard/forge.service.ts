
import { Injectable, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Http, RequestOptions, Headers } from '@angular/http';
import { FABRIC8_FORGE_API_URL } from 'a-runtime-console';
import { State } from 'app/space/forge-wizard/state.component';
import { AuthenticationService } from 'ngx-login-client';
import { Gui } from './gui.model';
import { History } from './history.component';

@Injectable()
export class ForgeService {

  constructor(private http: Http,
    private auth: AuthenticationService,
    @Inject(FABRIC8_FORGE_API_URL) private apiUrl: string) {
      this.apiUrl = Location.stripTrailingSlash(this.apiUrl || '') + '/forge';
  }

  commandInfo(command: string): Promise<Gui> {
    let options = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    return this.http.get(`${this.apiUrl}/commands/${command}`, new RequestOptions({ headers: options }))
      .retryWhen(errors => errors.delay(3000).scan((acc, source, index) => {
        if (index) throw source;
      })).toPromise()
      .then(response => response.json() as Gui)
      .catch(this.handleError);
  }

  nextStep(command: string, history: History): Promise<Gui> {
    return this.post(history.convert(history.stepIndex), `/commands/${command}/next`);
  }

  executeStep(command: string, history: History): Promise<Gui> {
    return this.post(history.convert(history.stepIndex), `/commands/${command}/execute`);
  }

  loadGui(command: string, history: History): Promise<Gui> {
    if (history.stepIndex === 0) {
      return this.commandInfo(command);
    } else {
      return this.nextStep(command, history);
    }
  }

  post(submittableGui: Gui, action: string): Promise<Gui> {
    let options = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    return this.http.post(this.apiUrl + action, submittableGui, new RequestOptions({ headers: options }))
      .retryWhen(errors => errors.delay(3000).scan((acc, source, index) => {
        if (index) throw source;
      })).toPromise()
      .then(response => response.json() as Gui)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    if (error.statusText) {
      return Promise.reject(error.json());
    }
    return Promise.reject(error.message ||
      'Error calling service. Contact your operation team to check Forge backend is running.');
  }

}
