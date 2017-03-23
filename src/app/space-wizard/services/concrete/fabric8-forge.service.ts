import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable, Observer } from 'rxjs/Rx';
import { IForgeRequest, IForgePayload, IForgeResponse, ForgeService,ForgeCommands } from '../contracts/forge-service';

import { LoggerFactory, ILoggerDelegate } from '../../common/logger';




@Injectable()
export class Fabric8ForgeService extends ForgeService {
  static instanceCount: number = 1;
  private log: ILoggerDelegate = () => { };
  private config = {
    //apiUrl: "http://localhost:8088"
    forge: {
      api: {
        url: {
          http: "http://forge.api.prod-preview.openshift.io",
          https: "https://forge.api.prod-preview.openshift.io"
        }
      }
    }
  };
  constructor(private http: Http, loggerFactory: LoggerFactory) {
    super()
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, Fabric8ForgeService.instanceCount++);
    if (logger) {
      this.log = logger;
    }
    this.log(`New instance...`);
  }
  private handleError(err): Observable<any> {
    let errMessage = err.message ? err.message : err.status ? `${err.status} - ${err.statusText}` : 'Server Error';
    //this.log({ message: errMessage, inner: err, error: true })
    return Observable.throw(new Error(errMessage));
  }
  private GetCommand(url: string): Observable<IForgeResponse> {
    return Observable.create((observer: Observer<IForgeResponse>) => {
      let headers = new Headers();
      //headers.append(...) e.g ('Content-Type', 'application/json');
      //TODO: auth token
      this.http.get(url, headers)
        .map((response) => {
          let payload: IForgePayload = response.json();
          //console.dir(payload);
          return { payload: payload };
        })
        .catch(this.handleError)
        .subscribe((response: IForgeResponse) => {
          observer.next(response);
          observer.complete();
        })
    });
  }
  private PostCommand(url: string, payload: any): Observable<IForgeResponse> {
    return Observable.create((observer: Observer<IForgeResponse>) => {
      let headers = new Headers();
      //headers.append('Content-Type', 'application/json');
      this.http.post(url, payload, headers)
        .map((response) => {
          let payload: IForgePayload = response.json();
          //console.dir(payload);
          return { payload: payload };
        })
        .catch(this.handleError)
        .subscribe((response: IForgeResponse) => {
          observer.next(response);
          observer.complete();
        })
    });
  }
  ExecuteCommand(options: IForgeRequest = { command: { name: "empty" } }): Observable<IForgeResponse> {
    switch (options.command.name) {
      case ForgeCommands.forgeStarter: {
        let parameters: any = options.command.parameters;
        switch (parameters.workflow.step.name) {
          case "begin":
            {
              let url = `${this.config.forge.api.url.https}/forge/commands/obsidian-new-project`;
              this.log(`Executing forge ${url}`);
              return this.GetCommand(url);
            }
          case "next":
            {
              let url = `${this.config.forge.api.url.https}/forge/commands/obsidian-new-project/next`;
              let data = parameters.data || {};
              console.dir(data);
              let payload = parameters.data;
              payload.stepIndex = parameters.workflow.step.index || 1;
              this.log(`posting to forge ${url}`);
              console.dir(payload)
              return this.PostCommand(url, payload);
            }
          case "validate":
            {
              let url = `${this.config.forge.api.url.https}/forge/commands/obsidian-new-project/validate`;
              let data = parameters.data || {};
              console.dir(data);
              let payload = parameters.data;
              payload.stepIndex = parameters.workflow.step.index || 1;
              this.log(`posting to forge ${url}`);
              console.dir(payload)
              return this.PostCommand(url, payload);
            }
          case "execute":
            {
              let url = `${this.config.forge.api.url.https}/forge/commands/obsidian-new-project/execute`;
              let data = parameters.data || {};
              console.dir(data);
              let payload = parameters.data;
              payload.stepIndex = parameters.workflow.step.index || 1;
              this.log(`posting to forge ${url}`);
              console.dir(payload)
              return this.PostCommand(url, payload);
            }
          default: {
            this.log({ message: `invalid forge command:${options.command.name} step:${parameters.workflow.step.name}`, error: true });
            return createEmptyResponse();
          }
        }

      }
      default: {
        return createEmptyResponse();
      }
    }
  }
}

function createEmptyResponse(): Observable<IForgeResponse> {
  return Observable.create((observer: Observer<IForgeResponse>) => {
    observer.next({});
    observer.complete();
  })
}
