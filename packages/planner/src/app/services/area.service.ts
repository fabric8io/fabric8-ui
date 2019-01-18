import { Observable, of as ObservableOf, throwError } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Logger } from 'ngx-base';

import { Spaces } from 'ngx-fabric8-wit';
import { AreaModel } from '../models/area.model';
import { HttpClientService } from '../shared/http-module/http.service';

@Injectable()
export class AreaService {
  public areas: AreaModel[] = [];
  private _currentSpace;

  constructor(private logger: Logger, private http: HttpClientService, private spaces: Spaces) {
    this.spaces.current.subscribe((val) => (this._currentSpace = val));
  }

  /**
   * getAreas - We call this service method to fetch
   * @param areaUrl - The url to get all the areas
   * @return Promise of AreaModel[] - Array of areas
   */
  getAreas(): Observable<AreaModel[]> {
    // get the current iteration url from the space service
    if (this._currentSpace) {
      let areasUrl = this._currentSpace.relationships.areas.links.related;
      if (this.checkValidUrl(areasUrl)) {
        return this.http.get<{ data: AreaModel[] }>(areasUrl).pipe(
          map((response) => {
            return response.data as AreaModel[];
          }),
          map((data) => {
            this.areas = data;
            return this.areas;
          }),
          catchError((error: Error | any) => {
            if (error.status === 401) {
              //this.auth.logout(true);
            } else {
              console.log('Fetch area API returned some error - ', error.message);
              return Promise.reject<AreaModel[]>([] as AreaModel[]);
            }
          }),
        );
      } else {
        this.logger.log('URL not matched');
        return ObservableOf<AreaModel[]>([] as AreaModel[]);
      }
    } else {
      return throwError('nospace');
    }
  }

  /**
   * getAreas - We call this service method to fetch
   * @param areaUrl - The url to get all the areas
   * @return Observable of AreaModel[] - Array of areas
   */
  getAreas2(areaUrl): Observable<AreaModel[]> {
    if (this.checkValidUrl(areaUrl)) {
      return this.http.get<{ data: AreaModel[] }>(areaUrl).pipe(
        map((response) => {
          return response.data as AreaModel[];
        }),
        map((data) => {
          this.areas = data;
          return this.areas;
        }),
        catchError((error: Error | any) => {
          if (error.status === 401) {
            //this.auth.logout(true);
          } else {
            console.log('Fetch area API returned some error - ', error.message);
            return Promise.reject<AreaModel[]>([] as AreaModel[]);
          }
        }),
      );
    } else {
      this.logger.log('URL not matched');
      return ObservableOf<AreaModel[]>([] as AreaModel[]);
    }
  }

  getArea(area: any): Observable<AreaModel> {
    if (Object.keys(area).length) {
      let areaLink = area.data.links.self;
      return this.http.get<{ data: AreaModel }>(areaLink).pipe(map((arearesp) => arearesp.data));
    } else {
      return ObservableOf(area);
    }
  }

  getAreaById(areaId: string): Observable<AreaModel> {
    return this.getAreas().pipe(
      first(),
      map((resultAreas) => {
        for (let i = 0; i < resultAreas.length; i++) {
          if (resultAreas[i].id === areaId) {
            return resultAreas[i];
          }
        }
      }),
      catchError((err) => {
        return throwError(new Error(err.message));
      }),
    );
  }

  /**
   * checkValidUrl checks if the API url for
   * iterations is valid or not
   * sample url -
   * http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/areas
   *
   * @param URL
   * @return Boolean
   */
  checkValidUrl(url: string): Boolean {
    let urlArr: string[] = url.split('/');
    let uuidRegExpPattern = new RegExp('[^/]+');
    return (
      urlArr[urlArr.length - 1] === 'areas' &&
      uuidRegExpPattern.test(urlArr[urlArr.length - 2]) &&
      urlArr[urlArr.length - 3] === 'spaces'
    );
  }
}
