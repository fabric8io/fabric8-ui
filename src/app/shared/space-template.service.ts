import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { WIT_API_URL } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Observable';

import { ProcessTemplate } from 'ngx-fabric8-wit';


@Injectable()
export class SpaceTemplateService {
  constructor(
    private http: Http,
    @Inject(WIT_API_URL) private apiUrl: string
  ) {}

  getSpaceTemplates(): Observable<ProcessTemplate[]> {
    return this.http.get(this.apiUrl + 'spacetemplates')
      .map(d => d.json().data as ProcessTemplate[]);
  }
}
