import { Inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { WIT_API_URL } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { ProcessTemplate } from 'ngx-fabric8-wit';


@Injectable()
export class SpaceTemplateService {
  constructor(
    private http: HttpClient,
    @Inject(WIT_API_URL) private apiUrl: string
  ) {}

  getSpaceTemplates(): Observable<ProcessTemplate[]> {
    return this.http.get(this.apiUrl + 'spacetemplates')
      .pipe(
        map(d => d['data'] as ProcessTemplate[])
      );
  }
}
