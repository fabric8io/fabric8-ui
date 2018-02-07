import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import * as _ from 'lodash';

import 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';

const defaults = Object.freeze({
  apiEndpoint: 'http://localhost:8080/v1',
  title: 'Red Hat fabric8',
});

const defaultConfigJson = '/config.json';

export function configServiceInitializer(config: ConfigService) {
  return () => config.load();
}

@Injectable()
export class ConfigService {

  private settingsRepository: any = defaults;

  constructor(private _http: Http) { }

  load(configJson: string = defaultConfigJson): Observable<ConfigService> {
    return this._http.get(configJson).map(res => {
      let config = res.json();
      // .toPromise()
      // .then((config) => {
        this.settingsRepository = Object.freeze(_.merge({}, this.settingsRepository, config));
        return this;
      // })
      // .catch((error: any) => {
      //   console.log('Error: Configuration service unreachable!', error);
      });
  }

  getSettings(group?: string, key?: string): any {
    if (!group) {
      return this.settingsRepository;
    }

    if (!this.settingsRepository[group]) {
      throw new Error(`Error: No setting found with the specified group [${group}]!`);
    }

    if (!key) {
      return this.settingsRepository[group];
    }

    if (!this.settingsRepository[group][key]) {
      throw new Error(`Error: No setting found with the specified group/key [${group}/${key}]!`);
    }

    return this.settingsRepository[group][key];
  }

}
