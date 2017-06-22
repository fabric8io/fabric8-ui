//
import { Broadcaster, Notification, NotificationAction, Notifications, NotificationType } from 'ngx-base';
import { CodebasesService } from '../../create/codebases/services/codebases.service';
import { Space } from 'ngx-fabric8-wit';
import { Codebase } from '../../create/codebases/services/codebase';

import { ILoggerDelegate, LoggerFactory } from '../common/logger';
import { IWorkflow } from '../models/workflow';
import { formatJson } from '../common/utilities';
import * as _ from 'lodash';
import {
  IAppGeneratorCommand,
  IAppGeneratorPair,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IAppGeneratorService,
  IAppGeneratorServiceProvider,
  IAppGeneratorState,
  IFieldCollection,
  IAppGeneratorMessage,
  AppGeneratorConfiguratorService
} from '../services/app-generator.service';

interface IAddCodebaseResult {
    codebase: Codebase;
    forgeResult: any;
    space: Space;
}

interface IAddCodebaseDelegate {
  (): Promise<IAddCodebaseResult>;
}


export class Fabric8AppGeneratorClient {
  /**
   * make allowance for non-singleton d-i semantics
   */
  public static factoryProvider = {
      provide: Fabric8AppGeneratorClient,
      useFactory: (appGeneratorService, codebasesService, configuratorService, notifications, broadcaster, loggerFactory) => {
        let tmp = new Fabric8AppGeneratorClient(appGeneratorService, codebasesService, configuratorService, notifications, broadcaster, loggerFactory);
        return tmp;
      },
      deps: [IAppGeneratorServiceProvider.InjectToken, CodebasesService, AppGeneratorConfiguratorService, Notifications, Broadcaster, LoggerFactory]
  };

  static instanceCount: number = 1;

  public workflow: IWorkflow;
  public commandName: string;
  public state: IAppGeneratorState;

  public hasErrorMessage: boolean;
  public errorMessage: IAppGeneratorMessage;

  public hasSuccessMessage: boolean;
  public successMessage: IAppGeneratorMessage;
  public result: any;

  public processing: boolean = false;
  public hasProcessingMessage: boolean;
  public processingMessage: IAppGeneratorMessage;

  private _fields: IFieldCollection;
  private _responseHistory: Array<IAppGeneratorResponse>;
  private _currentResponse: IAppGeneratorResponse;
  private _onCommandPipelineBeginStep: boolean = false;
  private _onCommandPipelineExecuteStep: boolean = false;
  private _onCommandPipelineNextStep: boolean = false;

  constructor(
    private _appGeneratorService: IAppGeneratorService,
    private _codebasesService: CodebasesService,
    private _configuratorService: AppGeneratorConfiguratorService,
    private _notifications: Notifications,
    private _broadcaster: Broadcaster,
    loggerFactory: LoggerFactory
    ) {

    this.log = loggerFactory.createLoggerDelegate(this.constructor.name, Fabric8AppGeneratorClient.instanceCount++);
    this.log(`New instance ...`);

    this.state = {
      canExecute: false,
      isExecute: false,
      canMovePreviousStep: false,
      canMoveToNextStep: false,
      currentStep: 0,
      steps: [],
      title: '',
      description: '',
      valid: false
    } as IAppGeneratorState;

    this.fields = [];
    this.clearErrorMessageView();
    this.clearSuccessMessageView();
    this.clearProcessingMessageView();
    this.processing = false;

  }

  public get onCommandPipelineBeginStep(): boolean {
    return this._onCommandPipelineBeginStep;
  }

  public set onCommandPipelineBeginStep(value: boolean) {
    this._onCommandPipelineExecuteStep = false;
    this._onCommandPipelineNextStep = false;
    this._onCommandPipelineBeginStep = value;
  }

  public get onCommandPipelineExecuteStep(): boolean {
    return this._onCommandPipelineExecuteStep;
  }

  public set onCommandPipelineExecuteStep(value: boolean) {
    this._onCommandPipelineBeginStep = false;
    this._onCommandPipelineNextStep = false;
    this._onCommandPipelineExecuteStep = value;
  }

  public get onCommandPipelineNextStep(): boolean {
    return this._onCommandPipelineExecuteStep;
  }

  public set onCommandPipelineNextStep(value: boolean) {
    this._onCommandPipelineBeginStep = false;
    this._onCommandPipelineExecuteStep = false;
    this._onCommandPipelineExecuteStep = value;
  }

  public get fields(): IFieldCollection {
    this._fields = this._fields || [];
    return this._fields;
  }

  public set fields(value: IFieldCollection) {
    this._fields = value;
  }

  public reset() {
    this.responseHistory = [];
    this._currentResponse = null;
    this.fields = [];
    this.clearErrorMessageView();
    this.clearSuccessMessageView();
    this.clearProcessingMessageView();
    this.addCodebaseDelegate = null;
  }
  /**
   * When an error occurs the error area will be displayed. On the beginning step
   * and acknowledge will take back to the forge selector
   */
  public acknowledgeErrorMessage() {
    this.clearErrorMessageView();
    if (this.onCommandPipelineBeginStep) {
      // if the dynamic 'step' is on the on the first step then reset and
      // go back to the forge selector
      this.reset();
      this.workflow.gotoPreviousStep();
    }
  }
  // TODO: revisit primary action and ux interaction model for long for errors and information ???
  public showCodebaseAddedNotification( addCodeBaseResult: IAddCodebaseResult) {
    // const notifcationAction : NotificationAction = {
    //    name: `CodebaseDetails`,
    //    title: `View Details`,
    //    id: 'codebase-added'
    // };
    this._notifications.message(<Notification>{
      message: `Your generated ${addCodeBaseResult.codebase.attributes.url} repository has been added to the ${this._configuratorService.currentSpace.attributes.name} space`,
      type: NotificationType.SUCCESS
      // ,primaryAction:notifcationAction
    });
    // .filter( action => action.id === notifcationAction.id)
    // .subscribe(action => {
    // });
  }


  public acknowledgeSuccessMessage() {
    if ( !this.invokeAddCodebaseDelegate()) {
      // go back to the forge wizard selector
      this.reset();
      this.workflow.gotoPreviousStep();
    }
  }

  public finish() {
    this.execute()
      .then(
        (execution) => {
          this.addCodebaseDelegate = this.getAddCodebaseDelegate();
        }
      )
      .catch(
        (ex) => {
          this.log({ origin : 'finish', message: 'App generator finish error', error: true }, ex);
      });
  }

  /** closes the workflow all together i.e shuts down the host dialog */
  public close() {
    this.reset();
    this.workflow.cancel();
  }

  /** cancels the workflow step  and goes back to the wizard selector workflow step */
  public cancel() {
    this.reset();
    this.workflow.gotoPreviousStep();
  }

  public begin() {
    this.onCommandPipelineBeginStep = true;
    this.reset();
    let title = 'Application Generator';
    this.state.title = title;
    this.displayProcessingMessageView('Loading ...');
    let request: IAppGeneratorRequest = {
      command: {
        name: `${this.commandName}`
      }
    };
    let commandInfo = `${request.command.name}`;
    this.log(`Begin request for command ${commandInfo}.`, request, console.groupCollapsed);
    return this._appGeneratorService.getFields(request)
      .subscribe(response => {
        this.log(`Begin response for command ${commandInfo}.`, request, console.groupEnd);
        this.applyTheNextCommandResponse({ request, response });
        // do an initial validate
        title = this.state.title;
        this.processingMessage.title = `Validating ...`;
        this.validate({showProcessingIndicator: false}).then((validation) => {
          this.state.title = title;
          this.clearProcessingMessageView();
        }, (error) => {
          this.state.title = title;
          this.displayErrorMessageView({error: error});
        });
      }, (error) => {
        this.state.title = title;
        this.displayErrorMessageView({error: error});
      });
  }

  public gotoPreviousStep() {
    let response = this.responseHistory.pop();
    this.fields = response.payload.fields;
    this.log(`Restored fieldset[${response.payload.fields.length}] from fieldset history
              ... there are ${this.responseHistory.length} items in history ...`);
  }

  public gotoNextStep() {
    this.onCommandPipelineNextStep = true;
    this.processing = false;
    this.displayProcessingMessageView('Validating ...');
    this.validate({showProcessingIndicator: false }).then((validated) => {
      if (validated.response.payload.state.valid) {
        // if validation succeeded
        // this.processing = true;
        let nextCommand: IAppGeneratorCommand = this._currentResponse.context.nextCommand;
        nextCommand.parameters.fields = this.fields;
        // pass along the validated data and fields
        nextCommand.parameters.validatedData = validated.request.command.parameters.data;
        let request: IAppGeneratorRequest = {
          command: nextCommand
        };
        // add the accumulated validation fields to the 'next' command
        let validationCommand: IAppGeneratorCommand = this._currentResponse.context.validationCommand;
        for (let field of validationCommand.parameters.fields) {
          let requestField = nextCommand.parameters.fields.find((f) => f.name === field.name);
          if (!requestField) {
            nextCommand.parameters.fields.push(field);
            let input = validationCommand.parameters.data.inputs.find(i => i.name === field.name);
            if (input) {
              nextCommand.parameters.data.inputs.push(input);
            }
          } else {
            let input = validationCommand.parameters.data.inputs.find(i => i.name === field.name);
            if (input) {
              nextCommand.parameters.data.inputs.push(input);
            }
          }
        }
        //
        let cmdInfo = `${nextCommand.name} :: ${nextCommand.parameters.pipeline.step.name} :: ${nextCommand.parameters.pipeline.step.index}`;
        this.log(`Next request for command ${cmdInfo}.`, request, console.groupCollapsed);
        this.displayProcessingMessageView('Loading the next step ...');
        this._appGeneratorService.getFields(request)
          .subscribe((response) => {
            this.log(`Next response for command ${cmdInfo}.`, request , console.groupEnd);
            this.applyTheNextCommandResponse({ request, response });
            this.clearProcessingMessageView();
            this.processing = false;
          }, (error) => {
            this.processing = false;
            this.displayErrorMessageView({error: error});
          });

      } else {
        this.clearProcessingMessageView();
        this.processing = false;
      }

    }).catch(error => {
      this.processing = false;
      this.displayErrorMessageView({error: error});
      this.log({ origin: 'gotoNextStep', message: error.message, warning: true });
    });

  }

  public execute(): Promise<IAppGeneratorPair> {
    this.onCommandPipelineExecuteStep = true;
    return new Promise<IAppGeneratorPair>((resolve, reject) => {

      this.state.title = 'Generating the application ...';

      this.displayProcessingMessageView('Validating ...');

      this.validate({ showProcessingIndicator: false }).then( (validated) => {
        if (validated.response.payload.state.valid) {
          let executeCommand: IAppGeneratorCommand = validated.response.context.executeCommand;
          // pass along the validated data and fields
          let request: IAppGeneratorRequest = {
            command: executeCommand
          };
          // add the accumulated validation fields to the 'next' command
          let validationCommand: IAppGeneratorCommand = this._currentResponse.context.validationCommand;
          for (let field of validationCommand.parameters.fields) {
            let requestField = executeCommand.parameters.fields.find((f) => f.name === field.name);
            if (!requestField) {
              executeCommand.parameters.fields.push(field);
              let input = validationCommand.parameters.data.inputs.find(i => i.name === field.name);
              if (input) {
                executeCommand.parameters.data.inputs.push(input);
              }
            } else {
              let input = validationCommand.parameters.data.inputs.find(i => i.name === field.name);
              if (input) {
                executeCommand.parameters.data.inputs.push(input);
              }
            }
          }

          let cmdInfo = `${executeCommand.name}:${executeCommand.parameters.pipeline.step.name}:${executeCommand.parameters.pipeline.step.index}`;
          this.displayProcessingMessageView('Generating ...');
          this.log(`Execute request for command ${cmdInfo}.`, request, console.groupCollapsed);
          this._appGeneratorService.getFields(request)
            .subscribe((response) => {
              this.log(`Execute response for command ${cmdInfo}.`, response, console.groupEnd);

              this.applyTheExecuteCommandResponse({ request, response });
              this.state.title = 'Application Generator Results';
              resolve({ request, response });
              this.clearProcessingMessageView();
            }, (error) => {
              this.displayErrorMessageView({error: error});
              reject(error);
            });
        } else {
          this.clearProcessingMessageView();
        }
      }, (validationError => {
        reject(validationError);
      })).catch(error => {
        this.displayErrorMessageView({error: error});
        this.log({ origin: 'execute', message: error.message, warning: true });
        reject(error);
      });
    });
  }

  public validate(options = { showProcessingIndicator: true}) {
    return new Promise<IAppGeneratorPair>((resolve, reject) => {
      // update the values to be validated
      let cmd: IAppGeneratorCommand = this._currentResponse.context.validationCommand;
      for (let field of this.fields) {
        let requestField = cmd.parameters.fields.find((f) => f.name === field.name);
        if ( requestField ) {
          requestField.value = field.value;
        }
      }

      let request: IAppGeneratorRequest = {
        command: cmd
      };
      let commandInfo = `${cmd.name}:${cmd.parameters.pipeline.step.name}:${cmd.parameters.pipeline.step.index}`;
      this.log(`Validation request for command ${commandInfo}.`, request, console.groupCollapsed);
      this.processing = options.showProcessingIndicator;
      this._appGeneratorService.getFields(request)
        .subscribe((response) => {
          let validationState = response.payload.state;
          this.log({
            message: `Validation response for command ${commandInfo}.`,
            info: validationState.valid,
            warning: !validationState.valid
          }, response, console.groupEnd);

          // only assign these state fields ... not the entire state object
          this.state.canExecute = validationState.canExecute;
          this.state.canMoveToNextStep = validationState.canMoveToNextStep;
          this.state.canMovePreviousStep = validationState.canMovePreviousStep;
          this.state.valid = validationState.valid;
          this.state.steps = validationState.steps;

          // update any fields with the same name

          for (let field of this.fields) {
            let found = response.payload.fields.find((f) => f.name === field.name);
            if ( found ) {
              field.display = found.display;
              field.value = found.value;
            }
          }
          resolve({ request, response });
          this.processing = false;

        }, (error => {
          this.processing = false;
          reject({
            origin: 'validate',
            name: 'ValidationError',
            message: 'Something went wrong while attempting to validate the request.',
            inner: error
          });
        }));
    });
  }

  /**
   * Create a function that returns a promise inidicating the successful association
   * of a codebase to the current space
   */
  getAddCodebaseDelegate(): IAddCodebaseDelegate {
    let delegate: IAddCodebaseDelegate = () => {
      return new Promise<object>((resolve, reject) => {
        let createTransientCodeBase = (result) => {
          return {
            attributes: {
              type: 'git',
              url: result.gitUrl,
              stackId: result.cheStackId
            },
            type: 'codebases'
          } as Codebase;
        };
        let space = this._configuratorService.currentSpace;
        let codeBase = createTransientCodeBase(this.result);
        this.log(`Adding codebase ${this.result.gitUrl} to space ${space.attributes.name} ...`, this.result, console.groupCollapsed);
        this._codebasesService.addCodebase( space.id, codeBase).subscribe(
          ( codebase ) => {
            this.log(`Successfully added codebase ${this.result.gitUrl} to space ${space.attributes.name} ...`, this.result, console.groupEnd);
            this._broadcaster.broadcast('codebaseAdded', codebase);
            resolve( <IAddCodebaseResult>{
              codebase: codebase,
              forgeResult: this.result,
              space: space
            });
          },
          ( addCodebaseError ) => {
            reject( addCodebaseError );
          }
        );

      });
    };
    return delegate;
  }

  private applyTheNextCommandResponse(next: IAppGeneratorPair) {

    let cmd: IAppGeneratorCommand = next.response.context.currentCommand;

    this.state = next.response.payload.state;
    let previousResponse = this._currentResponse;
    if (previousResponse) {
      this.responseHistory.push(previousResponse);
      this.log(`Stored fieldset[${previousResponse.payload.fields.length}] into fieldset history
                  ... there are ${this.responseHistory.length} responses in history ...`);

    }
    this._currentResponse = next.response;
    this.fields = next.response.payload.fields;
  }

  private applyTheExecuteCommandResponse(execution: IAppGeneratorPair) {
    let results = execution.response.payload.results || [];
    let buildHyperlink = (value) => {
      if ((value || '').toString().toLowerCase().startsWith('http')) {
        return `<a class="col-sm-7 property-value property-value-result property-value-link" target="_blank" href="${value}" >${value}</a></div></div>`;
      } else {
        return `<span class="col-sm-7 property-value property-value-result">${value}</span></div></div>`;
      }
    };
    let result:any = {};
    // build an array of result name/value/labels that can be sorted and augmented for readability and display
    let successMessageProperties = [];
    if (results.length > 0) {
      let msg = ``;
      results = results.filter(r => r !== null);
      // format to display property label/value
      for (let response of results) {
        if (Array.isArray(response)) {
          continue;
        }
        for (let key in response) {
          if (Array.isArray(response[key])) {
            continue;
          }
          if (response.hasOwnProperty(key)) {
            if (!result[key]) {
              successMessageProperties.push( {
                name: key,
                label: _.replace(_.capitalize( _.kebabCase(key)), /\-/g, ' '),
                value: response[key]
              });
              result[key] = response[key];
            }
          }
        }
      }
      // sort the labels alphabetically
      successMessageProperties.sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      });
      // now build the message to be displayed
      successMessageProperties.forEach(property => {
        if (property.value) {
          msg = `${msg}\n<div class="form-group"><label class="col-sm-5 property-name property-name-result" >${property.label}</label>${buildHyperlink(property.value)}`;
        }
      });
      this.result = result;
      this.displaySuccessMessageView(`A starter application was created.`, msg);
    }
  }

  private get responseHistory(): Array<IAppGeneratorResponse> {
    this._responseHistory = this._responseHistory || [];
    return this._responseHistory;
  }

  private set responseHistory(value: Array<IAppGeneratorResponse>) {
    this._responseHistory = value;
  }
  /**
   * Removes and orders source object properties for  better error reporting
   * This is achieved by 'cloning' the source into a target.
   */
  private filterObjectProperties(source): any {
    let target: any = {};
    if (source.hasOwnProperty('name')) {
      target.name = '';
    }
    if (source.hasOwnProperty('origin')) {
      target.origin = '';
    }
    if (source.hasOwnProperty('message')) {
      target.message = '';
    }
    if (source.hasOwnProperty('stack')) {
      target.stack = '';
    }
    if (source.hasOwnProperty('inner')) {
      target.inner = '';
    }
    for (let p of Object.getOwnPropertyNames(source)) {
      if (p.startsWith('_')) {
        continue;
      }
      if (p.startsWith('localizedMessage')) {
        continue;
      }
      if (p.startsWith('stackTrace')) {
        continue;
      }
      if (Array.isArray(source[p]) === true) {
        target[p] = [];
        for (let i of source[p]) {
          target[p].push(this.filterObjectProperties(i));
        }
      } else if (typeof (source[p]) !== 'function') {
        if (typeof (source[p]) === 'object') {
          target[p] = this.filterObjectProperties(source[p]);
        } else {
          target[p] = source[p];
        }
      }
    }
    return target;
  }

  private displayProcessingMessageView(messageTitle: string) {
    this.processingMessage = this.processingMessage || {} as IAppGeneratorMessage;
    this.processingMessage.title = messageTitle;
    this.processingMessage.body = '';
    this.hasProcessingMessage = true;
  }

  private clearProcessingMessageView() {
    this.hasProcessingMessage = false;
    this.processingMessage = this.processingMessage || {} as IAppGeneratorMessage;
    this.processingMessage.title = '';
    this.processingMessage.body = '';
  }

  private displaySuccessMessageView(messageTitle: string, messageBody: string) {
    this.log({ message: messageTitle});
    this.successMessage = {
      title: messageTitle,
      body: messageBody
    } as IAppGeneratorMessage;
    this.hasSuccessMessage = true;
  }

  private clearSuccessMessageView() {
    this.hasSuccessMessage = false;
    this.successMessage = this.successMessage || {} as IAppGeneratorMessage;
    this.successMessage.title = '';
    this.successMessage.body = '';
  }



  private displayErrorMessageView(options: any = { pageTitle: '', error: {} }) {
    options.pageTitle = options.pageTitle || 'Application Generator Error';
    this.clearProcessingMessageView();
    this.clearSuccessMessageView();
    this.log({ message: options.error.message, inner: options.error.inner, error: true });
    this.state.title = options.pageTitle;
    this.hasErrorMessage = true;
    this.errorMessage = {
      title: `Something went wrong while attempting to perform this operation ...`,
      body: [
        `<div class="message-status-failed" >${options.error.name}</div>`,
        `<div class="message-status-failed" >${options.error.message || 'No details available.'}</div>`,
        `<div class="message-details" >${this.formatJson(this.filterObjectProperties(options.error.inner))}</div>`
      ].join('')
    } as IAppGeneratorMessage;
    this.errorMessage.body = this.errorMessage.body.replace(/SUCCESS/g, '<span class="message-status-success" >SUCCESS</span>');
    this.errorMessage.body = this.errorMessage.body.replace(/FAILED/g, '<span class="message-status-failed" >FAILED</span>');
  }

  private clearErrorMessageView() {
    this.hasErrorMessage = false;
    this.errorMessage = this.errorMessage || {} as IAppGeneratorMessage;
    this.errorMessage.title = '';
    this.errorMessage.body = '';
  }

  private formatJson(source: any, indent: number = 0): string {
    return formatJson(source);
  }

  /** return true if delegate invoked , else return false */
  private invokeAddCodebaseDelegate() {
    if ( this.addCodebaseDelegate ) {
      this.addCodebaseDelegate().then(
        (addCodebaseResult: IAddCodebaseResult) => {
          this.log({
                     origin : 'acknowledgeSuccessMessage',
                     message: 'Add codebase completed',
                     info: true }, addCodebaseResult);
          this.showCodebaseAddedNotification(addCodebaseResult);
          this.reset();
          // invoke the workflow complete handler that navigates to the current space
          this.workflow.finish();
        })
      .catch((ex) => {
        this.log({ origin : 'acknowledgeSuccessMessage', message: 'Add codebase error', error: true }, ex);
      });
      return true;
    }
    return false;
  }

  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => { };
  private addCodebaseDelegate: IAddCodebaseDelegate = (): Promise<object> => { return Promise.resolve(<object>{}); };

}
