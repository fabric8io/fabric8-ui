import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClientService } from '../shared/http-module/http.service';
import { BoardModel } from './../models/board.model';

@Injectable()
export class BoardService {
  constructor(private http: HttpClientService) {}

  /**
   * Usage: this is used to get the board API url from spacetemplate response
   * @param spaceTemplateApiUrl
   */
  getBoardApiUrl(spaceTemplateApiUrl: string) {
    return this.http.get<{ data: any }>(spaceTemplateApiUrl).pipe(
      map((resp) => resp.data),
      map((template) => template.relationships.workitemboards.links.related),
    );
  }

  /**
   * Usage: this is to get the list board for a sapce
   * @param boardUrl
   */
  getBoards(boardUrl: string): Observable<BoardModel> {
    return this.http.get<{ data: any; included: any[] }>(boardUrl).pipe(
      map((resp) => {
        return {
          data: resp.data,
          included: resp.included,
        };
      }),
    );
  }
}
