import { Inject, Injectable } from '@angular/core';
import { User } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClientService } from './../shared/http-module/http.service';

@Injectable()
export class CollaboratorService {
  constructor(private httpClienService: HttpClientService) {}

  getCollaborators(url: string): Observable<User[]> {
    return this.httpClienService.get<{ data: User[] }>(url).pipe(map((resp) => resp.data));
  }
}
