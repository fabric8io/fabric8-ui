import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';

import { Observable, Observer } from 'rxjs/Rx';

import { ApiLocatorService } from '../../../shared/api-locator.service';

import { ILoggerDelegate, LoggerFactory } from '../common/logger';
import { clone } from '../common/utilities';


import {
  ForgeCommands,
  ForgeService,
  IForgeCommand,
  IForgeCommandData,
  IForgeCommandPipeline,
  IForgeCommandRequest,
  IForgeCommandResponse,
  IForgeInput,
  IForgeState
} from './contracts/forge-service';

class CommandPipelineStep {
  public static begin = 'begin';
  public static next = 'next';
  public static validate = 'validate';
  public static execute = 'execute';
}

@Injectable()
export class Fabric8ForgeService extends ForgeService {

  static instanceCount: number = 1;

  private _apiUrl: string;

  constructor(private _http: Http, loggerFactory: LoggerFactory, apiLocator: ApiLocatorService,
    private _authService: AuthenticationService) {
    super();
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, Fabric8ForgeService.instanceCount++);
    if (logger) {
      this.log = logger;
    }
    this.log(`New instance...`);
    this._apiUrl = apiLocator.forgeApiUrl;
    if (this._authService == null) {
      this.log({ message: `Injected AuthenticationService is null`, warning: true });
    }
  }

  executeCommand(request: IForgeCommandRequest = {
    payload: {
      command: {
        name: 'empty'
      }
    }
  }): Observable<IForgeCommandResponse> {
    let command = request.payload.command;
    // map the forge command system name into the parameters
    switch (command.name) {
      case ForgeCommands.forgeStarter: {
        // note that this is now deprecated
        command.parameters.pipeline.name = 'launchpad-new-starter-project';
        return this.forgeHttpCommandRequest(request);
      }
      case ForgeCommands.forgeQuickStart: {
        command.parameters.pipeline.name = 'fabric8-new-project';
        return this.forgeHttpCommandRequest(request);
      }
      case ForgeCommands.forgeImportGit: {
        command.parameters.pipeline.name = 'fabric8-import-git';
        return this.forgeHttpCommandRequest(request);
      }
      default: {
        return Observable.empty();
      }
    }
  }

  handleError(error: any): Observable<any> {
    let errorMessage: any;
    let errorName: string = 'ForgeApiClientError';
    let innerError = error;
    if (error instanceof Response) {
      try {
        const body = error.json() || '';
        if (body.messages) {
          errorName = 'ForgeApiPartialCommandCompletionError';
          errorMessage = 'The forge command failed or partially succeeded';
          innerError = {
            partialCommandCompletionError: {
              status: error.status,
              statusText: error.statusText,
              url: error.url,
              messages: body.messages
            }
          };
        } else if (body.cause.type == "io.fabric8.forge.generator.keycloak.KeyCloakFailureException") {
          errorName = 'AuthenticationError';
          errorMessage = body.cause.type;
          innerError = {
            httpError: {
              status: error.status,
              statusText: error.statusText,
              url: error.url,
              body: body
            }
          };
        } else {
          errorName = 'ForgeApiServerError';
          errorMessage = 'An unexpected server side forge api error occurred';
          innerError = {
            httpError: {
              status: error.status,
              statusText: error.statusText,
              url: error.url,
              body: body
            }
          };
        }
      } catch (ex) {
        errorName = 'ForgeApiClientExceptionError';
        errorMessage = 'An unexpected error occurred while consuming the http response returned from the server';
        innerError = error;
        innerError.inner = ex;
      }
    } else if (error instanceof Error) {
      errorName = 'ForgeApiClientError';
      errorMessage = 'An unexpected client side error occurred';
      innerError = error;
    } else {
      errorName = 'ForgeApiClientCustomError';
      errorMessage = 'An unexpected client side custom error occurred';
      innerError = error;
    }
    this.log({
      message: errorMessage,
      error: true
    }, error);
    return Observable.throw({
      origin: this.constructor.name,
      name: errorName,
      message: errorMessage,
      inner: innerError
    });

  }

  private addAuthorizationHeaders(headers: Headers) {
    if (this._authService.isLoggedIn()) {
      let token = this._authService.getToken();
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  public GetCommand(url: string): Observable<IForgeCommandResponse> {
    return Observable.create((observer: Observer<IForgeCommandResponse>) => {
      let headers = new Headers();
      this.addAuthorizationHeaders(headers);
      if (!headers.get('Authorization')) {
        let error = {
          origin: this.constructor.name,
          name: "Authentication error",
          message: "Please login to be able to add to space."
        }
        return observer.error(error);
      } else {
        let options = new RequestOptions(<RequestOptionsArgs>{ headers: headers });
        this.log(`Forge GET request  : ${url}`);
        this._http.get(url, options)
          .map((response: Response) => {
            let forgeResponse: IForgeCommandResponse = {
              payload: {
                data: response.json()
              }
            };
            this.log(`Forge GET response : ${url}`, forgeResponse.payload.data);
            return forgeResponse;
          })
          .catch((err) => this.handleError(err))
          .subscribe((response: IForgeCommandResponse) => {
            observer.next(response);
            observer.complete();
          }, (err) => {
            return observer.error(err);
          });
      };
    });
  }

  private PostCommand(url: string, body: any): Observable<IForgeCommandResponse> {
    return Observable.create((observer: Observer<IForgeCommandResponse>) => {
      this.log(`Forge POST request  : ${url}`, body);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      this.addAuthorizationHeaders(headers)
      if (!headers.get('Authorization')) {
        let error = {
          origin: this.constructor.name,
          name: "Authentication error",
          message: "Please login to be able to add to space."
        }
        return observer.error(error);
      } else {
        let options = new RequestOptions(<RequestOptionsArgs>{ headers: headers });
        this._http.post(url, body, options)
          .map((response: Response) => {
            if (body.isExecute === true) {
              // if this is an execute command then handle the response differently
              // e the data coming back is structured differently
              let forgeResponse: IForgeCommandResponse = {
                payload: {
                  data: {
                    results: response.json(),
                    inputs: this.clone<IForgeInput[]>(body.inputs),
                    state: {
                      valid: true,
                      isExecute: true,
                      canExecute: true,
                      wizard: true,
                      canMoveToNextStep: false,
                      canMoveToPreviousStep: false
                    }
                  }
                }
              };
              this.log(`Forge POST response : ${url}`, forgeResponse.payload);
              return forgeResponse;
            } else {
              let forgeResponse: IForgeCommandResponse = {
                payload: {
                  data: <IForgeCommandData>response.json()
                }
              };
              forgeResponse.payload.data.results = [];
              forgeResponse.payload.data.state = forgeResponse.payload.data.state || {} as IForgeState;
              forgeResponse.payload.data.state.isExecute = false;

              this.log(`Forge POST response : ${url}`, forgeResponse.payload);
              return forgeResponse;
            }
          })
          .catch((err) => this.handleError(err))
          .subscribe((response: IForgeCommandResponse) => {
            observer.next(response);
            observer.complete();
          }, (err => {
            observer.error(err);
          }));
      }
    });

  }

  private forgeHttpCommandRequest(commandRequest: IForgeCommandRequest): Observable<IForgeCommandResponse> {
    let currentCommand = commandRequest.payload.command;
    let currentParameters = currentCommand.parameters;
    let currentForgePipelineName = currentParameters.pipeline.name;
    let currentPipeline: IForgeCommandPipeline = currentParameters.pipeline;
    let api: string = Location.stripTrailingSlash(this._apiUrl || '');
    // build the url based on the workflow step and the system name
    switch (currentPipeline.step.name) {
      case CommandPipelineStep.begin: {
        let url = `${api}/forge/commands/${currentForgePipelineName}`;
        currentPipeline.step.index = 0;
        return this.GetCommand(url)
          .do((commandBeginResponse: IForgeCommandResponse) => {
            // Configure and set the next command pipeline stage to be submitted
            this.updateForgeHttpCommandResponseContext(commandRequest, commandBeginResponse);
          });
      }
      case CommandPipelineStep.validate:
      case CommandPipelineStep.next:
      case CommandPipelineStep.execute: {
        let url = `${api}/forge/commands/${currentForgePipelineName}/${currentPipeline.step.name}`;
        let body: IForgeCommandData = currentParameters.data;
        if (body.state.wizard) {
          body['stepIndex'] = currentPipeline.step.index;
        }
        if (currentPipeline.step.name === CommandPipelineStep.execute) {
          body['isExecute'] = true;
        }
        return this.PostCommand(url, body).do((response) => {
          this.updateForgeHttpCommandResponseContext(commandRequest, response);
        });
      }
      default: {
        this.log({
          message: `Invalid forge command step for command:${currentCommand.name}.
          step:${currentParameters.pipeline.step.name}`,
          error: true
        });
        return Observable.empty();
      }
    }
  }
  /**
   * Clone the object.
   * @param value
   */
  private clone<T>(value: any): T {
    return clone<T>(value);
  }
  /**
   * Update the context with the validate, next and current commands.
   */
  private updateForgeHttpCommandResponseContext(request: IForgeCommandRequest, response: IForgeCommandResponse) {

    response.context = response.context || {};

    let currentCommand = request.payload.command;
    let currentParameters = currentCommand.parameters;
    let currentPipeline: IForgeCommandPipeline = currentParameters.pipeline;

    let currentResponseForgeData = response.payload.data;
    let state = currentResponseForgeData.state;

    switch (currentPipeline.step.name) {
      // update context for completed begin step
      case CommandPipelineStep.begin: {
        // begin stage completed ... now need to validate the current step
        // and move to the next step
        let nextCommand = this.clone<IForgeCommand>(currentCommand);
        nextCommand.parameters.data = this.clone<IForgeCommandData>(currentResponseForgeData);
        let nextCommandPipeline = <IForgeCommandPipeline>nextCommand.parameters.pipeline;

        let validationCommand = this.clone<IForgeCommand>(currentCommand);
        validationCommand.parameters.data = this.clone<IForgeCommandData>(currentResponseForgeData);
        validationCommand.parameters.pipeline.step.name = CommandPipelineStep.validate;
        let validationPipeline = <IForgeCommandPipeline>validationCommand.parameters.pipeline;

        if (state.wizard === true) {
          // next command will submit and move to the next step
          nextCommandPipeline.step.name = CommandPipelineStep.next;
          nextCommandPipeline.step.index = 1;
          // validation command will validate the 'current' step
          validationPipeline.step.index = 0;
        }
        if (state.canExecute) {
          let executeCommand = this.clone<IForgeCommand>(currentCommand);
          executeCommand.parameters.pipeline.step.name = CommandPipelineStep.execute;
          executeCommand.parameters.pipeline.step.index = executeCommand.parameters.pipeline.step.index + 1;
          executeCommand.parameters.data = this.clone<IForgeCommandData>(currentResponseForgeData);
          response.context.executeCommand = executeCommand;
        }
        // update context
        response.context.nextCommand = nextCommand;
        response.context.validationCommand = validationCommand;
        break;
      }

      // update context for completed validate step
      case CommandPipelineStep.validate: {

        response.context = response.context || {};
        // validation does not provide a next command
        // because it only validates the current command
        response.context.nextCommand = null;
        // validation command does not provide a validation
        // command because the current command is the validation command
        response.context.validationCommand = null;

        if (response.payload.data.state.valid) {
          // Note for the next command this becomes a property of
          currentCommand.parameters.validatedData = this.clone<IForgeCommandData>(currentCommand.parameters.data
            || { inputs: [] });
        }
        if (state.canExecute) {
          let executeCommand = this.clone<IForgeCommand>(currentCommand);
          executeCommand.parameters.pipeline.step.name = CommandPipelineStep.execute;
          executeCommand.parameters.pipeline.step.index = executeCommand.parameters.pipeline.step.index + 1;
          executeCommand.parameters.data = this.clone<IForgeCommandData>(currentResponseForgeData);
          response.context.executeCommand = executeCommand;
        }

        break;
      }
      case CommandPipelineStep.next: {

        // merge the arrays checking for duplicates
        currentCommand.parameters.validatedData = currentCommand.parameters.validatedData || { inputs: [] };
        let inputs = this.clone<IForgeInput[]>(currentCommand.parameters.validatedData.inputs);
        if (inputs.length === 0) {
          inputs = currentCommand.parameters.data.inputs;
        }
        let notInResponse: IForgeInput[] = [];

        let inResponse: IForgeInput[] = this.clone<IForgeInput[]>(response.payload.data.inputs);
        for (let requestInput of inputs) {
          let foundInput = inResponse.find((i) => i.name === requestInput.name);
          if (!foundInput) {
            notInResponse.push(requestInput);
          }
        }
        let merged = [...notInResponse, ...inResponse];

        let nextCommand = this.clone<IForgeCommand>(currentCommand);
        nextCommand.parameters.data = this.clone<IForgeCommandData>(response.payload.data);
        let nextCommandPipeline = <IForgeCommandPipeline>nextCommand.parameters.pipeline;
        nextCommandPipeline.step.name = CommandPipelineStep.next;

        // the validate command is a validation of all the inputs from previous steps
        // and the current one
        let validationCommand = this.clone<IForgeCommand>(currentCommand);
        validationCommand.parameters.data = this.clone<IForgeCommandData>(response.payload.data);
        // insert the merged input data
        validationCommand.parameters.data.inputs = this.clone<IForgeInput[]>(merged);
        validationCommand.parameters.pipeline.step.name = CommandPipelineStep.validate;

        // advance the indexes: note validate pipeline index always same the current command step index
        nextCommandPipeline.step.index = nextCommandPipeline.step.index + 1;

        if (state.canExecute) {
          let executeCommand = this.clone<IForgeCommand>(currentCommand);
          executeCommand.parameters.pipeline.step.name = CommandPipelineStep.validate;
          executeCommand.parameters.pipeline.step.index = executeCommand.parameters.pipeline.step.index + 1;
          executeCommand.parameters.data.inputs = this.clone<IForgeInput[]>(merged);
          response.context.executeCommand = executeCommand;
        }
        response.context.nextCommand = nextCommand;
        response.context.validationCommand = validationCommand;

        break;
      }
      case CommandPipelineStep.execute: {
        response.context.executeCommand = this.clone(currentCommand);
        break;
      }
      default: {
        break;
      }
    }
    response.context.currentCommand = this.clone(currentCommand);

  }

  private log: ILoggerDelegate = () => { };

}
