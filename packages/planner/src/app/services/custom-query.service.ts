import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CustomQueryModel } from '../models/custom-query.model';
import { HttpClientService } from '../shared/http-module/http.service';

@Injectable()
export class CustomQueryService {
  constructor(private http: HttpClientService) {}

  /**
   * getCustomQueries - Fetches all the available custom queries
   * @param apiUrl - The url to get list of all filters
   * @return Observable of FilterModel[] - Array of filters
   */
  getCustomQueries(apiUrl): Observable<CustomQueryModel[]> {
    return this.http.get<{ data: CustomQueryModel[] }>(apiUrl).pipe(
      map((r) => r.data as CustomQueryModel[]),
      catchError((e) => this.handleError(e, 'Fetch iteration API returned some error - ')),
    );
  }

  /**
   * Usage: This method create a new item
   * adds the new item to the big list
   * resolve the users for the item
   * re build the ID-Index map
   *
   * @param: WorkItem - workItem (Item to be created)
   */
  create(customQuery: CustomQueryModel, apiUrl: string): Observable<CustomQueryModel> {
    let payload = JSON.stringify({ data: customQuery });
    return this.http.post<{ data: CustomQueryModel }>(apiUrl, payload).pipe(
      map((r) => r.data as CustomQueryModel),
      catchError((e) => this.handleError(e, 'Creating custom query failed.')),
    );
  }

  /**
   * Usage: This method deletes a custom query
   * @param apiUrl ulr to the custom query
   */
  delete(apiUrl: string) {
    return this.http
      .delete(apiUrl)
      .pipe(catchError((e) => this.handleError(e, 'Delete custom query failed')));
  }

  /**
   * Error handling
   */

  private handleError(error: Error | any, str) {
    if (error.status === 401) {
      console.log('You have been logged out.', error);
    } else {
      console.log(str, error.message);
    }
    return throwError(new Error(error.message));
  }
}
