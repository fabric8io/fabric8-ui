import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GroupTypesModel } from '../models/group-types.model';
import { HttpClientService } from '../shared/http-module/http.service';

@Injectable()
export class GroupTypesService {
  constructor(private http: HttpClientService) {}

  getGroupTypes(url): Observable<GroupTypesModel[]> {
    return this.http.get<{ data: GroupTypesModel[] }>(url).pipe(map((r) => r.data));
  }
}
