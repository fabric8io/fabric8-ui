import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientService } from './http.service';

describe('HttpService', () => {
  let injector: TestBed;
  let service: HttpClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClientService],
    });
    injector = getTestBed();
    service = injector.get(HttpClientService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Should return correct response on get request Observable<Item[]>', () => {
    type Item = {
      name: string;
      id: string;
    };

    const mockItems: Item[] = [{ name: 'Laptop', id: '1' }, { name: 'PC', id: '2' }];

    service.get<Item[]>('/some/url').subscribe((items) => {
      expect(items.length).toBe(2);
      expect(items).toEqual(mockItems);
    });

    const req = httpMock.expectOne('/some/url');
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);
  });

  it('Should return correct response on patch request Observable<Item[]>', () => {
    type Item = {
      name: string;
      id: string;
    };

    const mockItems: Item[] = [{ name: 'Laptop', id: '1' }, { name: 'PC', id: '2' }];

    service.patch<Item[]>('/some/url', {}).subscribe((items) => {
      expect(items.length).toBe(2);
      expect(items).toEqual(mockItems);
    });

    const req = httpMock.expectOne('/some/url');
    expect(req.request.method).toBe('PATCH');
    req.flush(mockItems);
  });

  it('Should return correct response on post request Observable<Item[]>', () => {
    type Item = {
      name: string;
      id: string;
    };

    const mockItems: Item[] = [{ name: 'Laptop', id: '1' }, { name: 'PC', id: '2' }];

    service.post<Item[]>('/some/url', {}).subscribe((items) => {
      expect(items.length).toBe(2);
      expect(items).toEqual(mockItems);
    });

    const req = httpMock.expectOne('/some/url');
    expect(req.request.method).toBe('POST');
    req.flush(mockItems);
  });

  it('Should return correct response on delete request', () => {
    service.delete('/some/url').subscribe((items) => {
      expect(items).toBeNull();
    });

    const req = httpMock.expectOne('/some/url');
    expect(req.request.method).toBe('DELETE');
    req.event(new HttpResponse<string>({ body: null }));
  });
});
