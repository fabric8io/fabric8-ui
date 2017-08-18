import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class FeedbackService {
    private headers: Headers = new Headers({'Content-Type': 'application/json'});
    constructor(
        private http: Http,
        private auth: AuthenticationService) {
            if (this.auth.getToken() !== null) {
                this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
            }
        }

    public submit(feedback: any): Observable<any> {
        let url: string = 'https://recommender.api.openshift.io/api/v1/user-feedback';
        let options: RequestOptions = new RequestOptions({
            headers: this.headers
        });

        return this.http
            .post(url, JSON.stringify(feedback), options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
        errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
