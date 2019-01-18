import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBackendClient } from './../shared/http-module/http.service';
import { InfotipState } from './../states/infotip.state';

const infotipsUrl: string = 'https://docs.openshift.io/json/infotips.json';

@Injectable()
export class InfotipService {
  constructor(private http: HttpBackendClient) {}

  getInfotips(): Observable<InfotipState> {
    return this.http.get<{ data: InfotipState }>(infotipsUrl);
  }
}
