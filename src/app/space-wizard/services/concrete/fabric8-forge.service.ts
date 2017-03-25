import { Injectable, OpaqueToken } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';

import { Observable, Observer } from 'rxjs/Rx';
import { IForgeRequest, IForgeCommandPayload, IForgeResponse, ForgeService, ForgeCommands } from '../contracts/forge-service';

import { LoggerFactory, ILoggerDelegate } from '../../common/logger';
import { ApiLocatorService } from '../../../shared/api-locator.service';

@Injectable()
export class Fabric8ForgeService extends ForgeService {
  static instanceCount: number = 1;
  private log: ILoggerDelegate = () => { };
  private apiUrl: string;


  constructor(private http: Http, loggerFactory: LoggerFactory, apiLocator: ApiLocatorService) {
    super()
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, Fabric8ForgeService.instanceCount++);
    if (logger) {
      this.log = logger;
    }
    this.log(`New instance...`);
    this.apiUrl = apiLocator.forgeApiUrl;
    this.log({message:`forge api is ${this.apiUrl}`,warning:true});
  }

  private handleError(error): Observable<any> {
    let errorMessage: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body, );
      errorMessage = `${error.status} - ${error.statusText || ''} ${error}`;
    } else {
      errorMessage = error.message ? error.message : error.toString();
    }
    this.log({ message: errorMessage, inner: error, error: true })
    return Observable.throw(errorMessage);
  }

  private addAuthorizationToken(headers: Headers) {
    var token = localStorage.getItem('auth_token');
    if (token) {
      headers.set('Authorization', "Bearer " + token)
    }
  }
  private GetCommand(url: string): Observable<IForgeResponse> {
    return Observable.create((observer: Observer<IForgeResponse>) => {
      let headers = new Headers();
      this.addAuthorizationToken(headers);
      let options = new RequestOptions(<RequestOptionsArgs>{ headers: headers });
      this.log(`forge GET : ${url}`);
      this.http.get(url, options)
        .map((response) => {
          let forgeResponse: IForgeResponse = { payload: response.json() };
          this.log(`forge GET response : ${url}`);
          console.dir(forgeResponse.payload);
          return forgeResponse;
        })
        .catch((err) => this.handleError(err))
        .subscribe((response: IForgeResponse) => {
          observer.next(response);
          observer.complete();
        })
    });
  }

  private PostCommand(url: string, body: any): Observable<IForgeResponse> {
    return Observable.create((observer: Observer<IForgeResponse>) => {
      this.log(`forge POST : ${url}`);
      console.dir(body)
      let headers = new Headers({ 'Content-Type': 'application/json' });
      this.addAuthorizationToken(headers);
      let options = new RequestOptions(<RequestOptionsArgs>{ headers: headers });
      this.http.post(url, body, options)
        .map((response) => {
          let forgeResponse: IForgeResponse = { payload: response.json() };
          this.log(`forge POST response : ${url}`);
          console.dir(forgeResponse.payload);
          return forgeResponse;
        })
        .catch((err) => this.handleError(err))
        .subscribe((response: IForgeResponse) => {
          observer.next(response);
          observer.complete();
        })
    });
  }

  ExecuteCommand(request: IForgeRequest = { command: { name: "empty" } }): Observable<IForgeResponse> {
    switch (request.command.name) {
      case ForgeCommands.forgeStarter: {
        request.command.forgeCommandName = "obsidian-new-project";
        return this.forgeWorkflowCommandRequest(request);
      }
      case ForgeCommands.forgeQuickStart: {
        request.command.forgeCommandName = "obsidian-new-quickstart";
        return this.forgeWorkflowCommandRequest(request);
      }
      default: {
        return Observable.empty();
      }
    }
  }

  private forgeWorkflowCommandRequest(request: IForgeRequest): Observable<IForgeResponse> {
    let parameters: any = request.command.parameters;
    let forgeCommandName = request.command.forgeCommandName;
    let api: string = this.apiUrl || "";
    if (api.endsWith("/") === false) {
      api = `${api}/`;
    }

    switch (parameters.workflow.step.name) {
      case "begin":
        {
          let url = `${api}forge/commands/${forgeCommandName}`;
          return this.GetCommand(url);
        }
      case "next":
        {
          let url = `${api}forge/commands/${forgeCommandName}/next`;
          let body = parameters.data || {};
          body.stepIndex = parameters.workflow.step.index || 1;
          return this.PostCommand(url, body);
        }
      case "validate":
        {
          let url = `${api}forge/commands/${forgeCommandName}/validate`;
          let body = parameters.data || {};
          return this.PostCommand(url, body);
        }
      case "execute":
        {
          let url = `${api}forge/commands/${forgeCommandName}/execute`;
          let body = parameters.data;
          return this.PostCommand(url, body);
        }
      default: {
        this.log({ message: `invalid forge command:${request.command.name} step:${parameters.workflow.step.name}`, error: true });
        return Observable.empty();
      }
    }
  }
}
