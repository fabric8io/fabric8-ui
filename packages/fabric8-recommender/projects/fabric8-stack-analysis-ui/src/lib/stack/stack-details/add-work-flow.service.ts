import { Injectable, Inject } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { AuthenticationService } from 'ngx-login-client';
import { WIT_API_URL, Contexts } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
// import 'rxjs/add/operator/catch';
// import 'rxjs/operators/map';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AddWorkFlowService {

  private stackWorkItemUrl;

  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private workItemsRoute = 'workitems';
  private spacesString = 'spaces';
  private spaceId: string;
  private bugId: string;
  private fallBackBugId: string;

  constructor(
    private http: HttpClient,
    @Inject(WIT_API_URL) private apiUrl: string,
    private auth: AuthenticationService,
    private context: Contexts
  ) {
    if (this.auth.getToken && this.auth.getToken() !== null) {
      this.headers = this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.setMetaInformation();
  }

  setMetaInformation(): void {
    let api: string = this.apiUrl;
    if (this.context && this.context.current) {
      this.context.current.subscribe(currentContext => {
        if (currentContext.space) {
          this.spaceId = currentContext.space.id;
          this.stackWorkItemUrl = api + this.spacesString + '/' + this.spaceId + '/' + this.workItemsRoute;
          if (currentContext.space.relationships && currentContext.space.relationships.workitemtypes && currentContext.space.relationships.workitemtypes.links) {
            this.fetchBugId(currentContext.space.relationships.workitemtypes.links.related);
          }
        }
      });
    }
  }

  fetchBugId(url: string): void {
    let options: {} = { headers: this.headers };
    this.http.get<any>(url, options)
      .pipe(
      catchError(this.handleError))
      .subscribe((json) => {
        try {
          if (json) {
            this.setBugId(json);
          }
        } catch (error) {
          console.log('Error converting response to JSON');
        }
      });
  }

  setBugId(response: any): void {
    if (response && response.data) {
      let data: Array<any> = response.data;
      let dataItem: any;
      for (let i in data) {
        if (data.hasOwnProperty(i)) {
          dataItem = data[i];
          if (dataItem) {
            if (dataItem.attributes) {
              const id: string = dataItem.id;
              const attributes: any = dataItem.attributes;
              if (attributes && attributes['can-construct'] === true) {
                if (!this.fallBackBugId) {
                  this.fallBackBugId = id;
                }
              }
              if (attributes && attributes.name === 'Bug') {
                this.bugId = id;
                break;
              }
            }
          }
        }
      }
    }
  }

  addWorkFlow(workItemData: any): Observable<any> {
    workItemData.data.relationships.baseType.data.id = this.bugId || this.fallBackBugId;
    let options: any = { headers: this.headers };
    let body = JSON.stringify(workItemData);
    return this.http.post<any>(this.stackWorkItemUrl, body, options)
      .pipe(map(this.extractData),
        catchError(this.handleError));
  }

  private extractData(body: any): any {
    return body || {};
  }

  private handleError(error: HttpErrorResponse) {
    let errMsg: string;
    if (error.error instanceof ErrorEvent) {
      errMsg = error.error.message || error.error.toString();
    } else {
      const body = error.error || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    }
    return Observable.throw(errMsg);
  }

}
