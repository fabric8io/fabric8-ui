import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { User } from 'ngx-login-client';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClientService } from '../shared/http-module/http.service';
import { CollaboratorService } from './collaborator.service';

describe('Unit test :: Collaborator Service', () => {
  let spy;
  beforeEach(() => {
    spy = jasmine.createSpyObj('HttpClientService', ['get']);
    TestBed.configureTestingModule({
      providers: [CollaboratorService, { provide: HttpClientService, useValue: spy }],
    });
  });

  it('should call get from HTTP service', async () => {
    const collabService = TestBed.get(CollaboratorService);
    const returnValue = {
      data: [] as User[],
    };

    collabService.httpClienService.get.and.returnValue(of(returnValue).pipe(delay(200)));
    collabService.getCollaborators('').subscribe((d) => {
      expect(d).toEqual(returnValue.data);
    });
  });
});
