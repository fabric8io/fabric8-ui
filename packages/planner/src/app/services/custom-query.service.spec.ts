import { TestBed } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { Observable, of } from 'rxjs';
import { CustomQueryModel } from '../models/custom-query.model';
import { HttpClientService } from '../shared/http-module/http.service';
import { CustomQueryService } from './custom-query.service';

describe('Custom Query :: Unit Tests', () => {
  let customqueryService: CustomQueryService;
  let httpService: jasmine.SpyObj<HttpClientService>;
  let spy, resp;
  beforeEach(() => {
    spy = jasmine.createSpyObj('HttpService', ['get', 'post', 'delete']);
    TestBed.configureTestingModule({
      providers: [CustomQueryService, { provide: HttpClientService, useValue: spy }],
    });
    customqueryService = TestBed.get(CustomQueryService);
    httpService = TestBed.get(HttpClientService);
  });

  it('should get all the custom queries', () => {
    httpService.get.and.returnValue(
      of({
        data: [] as CustomQueryModel[],
      }),
    );

    customqueryService.getCustomQueries('').subscribe((d) => {
      expect(d).toEqual([] as CustomQueryModel[]);
    });
  });

  it('should create a custom query', () => {
    httpService.post.and.returnValue(
      of({
        data: {} as CustomQueryModel,
      }),
    );
    customqueryService.create({} as CustomQueryModel, '').subscribe((d) => {
      expect(d).toEqual({} as CustomQueryModel);
    });
  });

  it('should delete a custom query', () => {
    httpService.delete.and.returnValue(of());
    customqueryService.delete('').subscribe(() => {
      expect(httpService.delete).toHaveBeenCalled();
    });
  });
});
