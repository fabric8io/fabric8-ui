import { TestBed } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { BoardService } from './board.service';

import { HttpClientService } from '../shared/http-module/http.service';
import { PlannerHttpClientModule } from './../shared/http-module/http.module';
import { boardsResponse, spaceTemplateResponse } from './board.snapshot';

describe('BoardService :: ', () => {
  beforeEach(() => {
    const mockHttpClientService = jasmine.createSpyObj('HttpClientService', ['get']);

    TestBed.configureTestingModule({
      imports: [PlannerHttpClientModule],
      providers: [
        {
          provide: HttpClientService,
          useValue: mockHttpClientService,
        },
        BoardService,
      ],
    });
  });

  it('getBoardApiUrl :: Should pass cannery test', () => {
    const boardService = TestBed.get(BoardService);
    expect(boardService).not.toBeNull();
    expect(boardService).not.toBeUndefined();
  });

  it('getBoardApiUrl :: Should fetch board api URL', (done) => {
    const boardService = TestBed.get(BoardService);
    boardService.http.get.and.returnValue(of(spaceTemplateResponse).pipe(delay(200)));
    boardService.getBoardApiUrl('').subscribe((url) => {
      expect(url).toEqual(spaceTemplateResponse.data.relationships.workitemboards.links.related);
      done();
    });
  });

  it('getBoards :: Should fetch list of boards', (done) => {
    const boardService = TestBed.get(BoardService);
    boardService.http.get.and.returnValue(of(boardsResponse).pipe(delay(200)));
    boardService.getBoards('').subscribe((resp) => {
      expect(resp).toEqual(boardsResponse);
      done();
    });
  });
});
