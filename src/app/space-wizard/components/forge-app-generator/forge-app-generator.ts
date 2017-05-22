//
import { Observable } from 'rxjs/Rx';
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { IWorkflow } from '../../models/workflow';
import { formatJson } from '../../common/utilities';
import * as _ from 'lodash';
import {
  IAppGeneratorCommand,
  IAppGeneratorPair,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IAppGeneratorService,
  IAppGeneratorState,
  IFieldCollection,
  IAppGeneratorError,
  IAppGeneratorMessage

} from '../../services/app-generator.service';

import { CodebasesService } from '../../../create/codebases/services/codebases.service';
import { Codebase } from '../../../create/codebases/services/codebase';
import { SpacesService } from '../../../shared/spaces.service';

interface ICodebaseCreationDelegate{
  ():Promise<object>
}

export class ForgeAppGenerator {
  static instanceCount: number = 1;

  public workflow: IWorkflow;
  public name: string;
  public state: IAppGeneratorState;

  public hasErrorMessage: boolean;
  public errorMessage: IAppGeneratorMessage;

  public hasResultMessage: boolean;
  public resultMessage: IAppGeneratorMessage;
  public result:any;

  public processing: boolean = false;
  public hasProcessingMessage: boolean;
  public processingMessage: IAppGeneratorMessage;

  private _fieldSet: IFieldCollection;
  private _responseHistory: Array<IAppGeneratorResponse>;
  private _currentResponse: IAppGeneratorResponse;
  private _onBeginStep: boolean = false;

  constructor(
    private _appGeneratorService: IAppGeneratorService,
    private _codebasesService: CodebasesService,
    private _spacesService:SpacesService,
    loggerFactory: LoggerFactory
    ) {

    this.log = loggerFactory.createLoggerDelegate(this.constructor.name, ForgeAppGenerator.instanceCount++);

    this.state = {
      canExecute: false,
      isExecute: false,
      canMovePreviousStep: false,
      canMoveToNextStep: false,
      currentStep: 0,
      steps: [''],
      title: '',
      description: '',
      valid: false
    } as IAppGeneratorState;

    this.fields = [];
    this.clearErrorView();
    this.clearResult();
    this.clearProcessingView();
    this.processing = false;

  }
  public get onBeginStep(): boolean {
    return this._onBeginStep;
  }
  public set onBeginStep(value: boolean) {
    this._onBeginStep = value;
  }

  public get fields(): IFieldCollection {
    this._fieldSet = this._fieldSet || [];
    return this._fieldSet;
  }

  public set fields(value: IFieldCollection) {
    this._fieldSet = value;
  }

  public clearResult() {
    this.hasResultMessage = false;
    this.resultMessage = this.resultMessage || {} as IAppGeneratorMessage;
    this.resultMessage.title = '';
    this.resultMessage.body = '';
  }

  public reset() {
    this.responseHistory = [];
    this._currentResponse = null;
    this.fields = [];
    this.clearErrorView();
    this.clearResult();
    this.clearProcessingView();
  }
  /**
   * When an error occurs the error area will be displayed. On the beginning step
   * and acknowldge will take back to the forge selector
   */
  public acknowledgeError() {
    this.clearErrorView();
    if (this.onBeginStep) {
      //if on the first step
      this.reset();
      // go back to forge selector
      this.workflow.gotoPreviousStep();
    }
  }

  public acknowledgeResult() {
    this.reset();
    // add code base
    this.workflow.gotoPreviousStep();
  }

  public finish() {
    this.execute()
      .then(
        (execution) => {
          this.createCodebase = this.createCodebaseCreationDelegate(execution);
          if(this.createCodebase){
            this.createCodebase();
          }
        }
      )
      .then(
        (createCodeBaseResult) => {
          this.workflow.finish();
        }
      )
      .catch(
        (ex) => {
          this.log({ origin :'finish', message:'App generator finish error', error: true }, ex);
      });

  }
  /**
   * Create a function that returns a promise containing the successful codebase creation
   */
  public createCodebaseCreationDelegate(execution: IAppGeneratorPair): ICodebaseCreationDelegate {
    let delegate: ICodebaseCreationDelegate = () => {
      return new Promise<object>((resolve, reject) => {
        let createTransientCodeBase = (url) => {
          return {
            attributes: {
              type: 'git',
              url: url
            },
            type: 'codebases'
          } as Codebase;
        };
        this._spacesService.current.subscribe(
          (space) => {
              let codeBase = createTransientCodeBase(this.result.gitUrl);
              this.log(`Adding codebase ${this.result.gitUrl} to space ${space.attributes.name} ...`,this.result,console.groupCollapsed);
              this._codebasesService.addCodebase(space.id,codeBase).subscribe(
                (codebase) => {
                  this.log(`Successfully added codebase ${this.result.gitUrl} to space ${space.attributes.name} ...`,this.result,console.groupEnd);
                  resolve( <object>{
                  complete:true,
                  codebase: null,
                  result:this.result,
                  space:space,
                  });
                },
                (addCodebaseError) => {
                  reject(addCodebaseError)
                }
              );

          },
          (spaceError) => {
            reject(spaceError);
          }
        );
      });
    };
    return delegate;
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
    this.onBeginStep = true;
    this.reset();
    let title = 'Application Generator';
    this.state.title = title;
    this.displayProcessingView('Loading ...');
    let request: IAppGeneratorRequest = {
      command: {
        name: `${this.name}`
      }
    };
    let commandInfo = `${request.command.name}`;
    this.log(`Begin request for command ${commandInfo}.`, request,console.groupCollapsed);
    return this._appGeneratorService.getFields(request)
      .subscribe(response => {
        this.log(`Begin response for command ${commandInfo}.`, request,console.groupEnd);
        this.applyTheNextCommandResponse({ request, response });
        // do an initial validate
        title = this.state.title;
        this.processingMessage.title = `Validating ...`;
        this.validate(false).then((validation) => {
          this.state.title = title;
          this.clearProcessingView();
        }, (error) => {
          this.state.title = title;
          this.clearProcessingView();
          this.displayErrorView(error);
        });
      }, (error) => {
        this.state.title = title;
        this.clearProcessingView();
        this.displayErrorView(error);
      });
  }

  public gotoPreviousStep() {
    let response = this.responseHistory.pop();
    this.fields = response.payload.fields;
    this.log(`Restored fieldset[${response.payload.fields.length}] from fieldset history
              ... there are ${this.responseHistory.length} items in history ...`);
  }

  public gotoNextStep() {
    this.onBeginStep = false;
    this.processing = false;
    this.displayProcessingView('Validating ...');
    this.validate(false).then((validated) => {
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
        this.displayProcessingView('Loading the next step ...');
        this._appGeneratorService.getFields(request)
          .subscribe((response) => {
            this.log(`Next response for command ${cmdInfo}.`, request ,console.groupEnd);
            this.applyTheNextCommandResponse({ request, response });
            this.clearProcessingView();
            this.processing = false;
          }, (error) => {
            this.clearProcessingView();
            this.processing = false;
            this.displayErrorView(error);
          });

      } else {
        this.clearProcessingView();
        this.processing = false;
      }

    }).catch(error => {
      this.processing = false;
      this.clearProcessingView();
      this.displayErrorView(error);
      this.log({ origin:'gotoNextStep', message: error.message, warning: true });
    });

  }

  public execute():Promise<IAppGeneratorPair> {
    this.onBeginStep = false;
    return new Promise<IAppGeneratorPair>((resolve, reject) => {

      this.state.title = 'Generating the application ...';

      this.displayProcessingView('Validating ...');

      this.validate(false).then((validated) => {
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
          this.displayProcessingView('Generating ...');
          this.log(`Execute request for command ${cmdInfo}.`, request, console.groupCollapsed);
          this._appGeneratorService.getFields(request)
            .subscribe((response) => {
              this.log(`Execute response for command ${cmdInfo}.`, response, console.groupEnd);

              this.applyTheExecuteCommandResponse({ request, response });
              this.state.title = 'Application Generator Results';
              resolve({ request, response });
              this.clearProcessingView();
            }, (error) => {
              this.clearProcessingView();
              this.displayErrorView(error);
              reject(error)
            });
        } else {
          this.clearProcessingView();
        }
      },(validationError => {
        reject(validationError);
      })).catch(error => {
        this.clearProcessingView();
        this.displayErrorView(error);
        this.log({ origin:'execute', message: error.message, warning: true });
        reject(error);
      });
    });
  }

  public validate(showProcessingIndicator: boolean = true) {
    return new Promise<IAppGeneratorPair>((resolve, reject) => {
      // update the values to be validated
      let cmd: IAppGeneratorCommand = this._currentResponse.context.validationCommand;
      for (let field of this.fields) {
        let requestField = cmd.parameters.fields.find((f) => f.name === field.name);
        requestField.value = field.value;
      }

      let request: IAppGeneratorRequest = {
        command: cmd
      };
      let commandInfo = `${cmd.name}:${cmd.parameters.pipeline.step.name}:${cmd.parameters.pipeline.step.index}`;
      this.log(`Validation request for command ${commandInfo}.`, request, console.groupCollapsed);
      this.processing = showProcessingIndicator;
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
          // update any fields with the same name
          for (let field of this.fields) {
            let found = response.payload.fields.find((f) => f.name === field.name);
            field.display = found.display;
            field.value = found.value;
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
        return `<a class="property-value property-value-result property-value-link" target="_blank" href="${value}" >${value}</a>`;
      } else {
        return `<span class="property-value property-value-result" >${value}</span>`;
      }
    };
    let result = {};
    let resultMessageProperties = [];
    if (results.length > 0) {
      let msg = ``;
      for (let response of results.filter(r => r !== null)) {
        if (Array.isArray(response)) {
          continue;
        }
        for (let key in response) {
          if (Array.isArray(response[key])) {
            continue;
          }
          if (response.hasOwnProperty(key)) {
            if(!result[key]) {
              resultMessageProperties.push( {
                name:key,
                label:_.replace(_.capitalize( _.kebabCase(key)),/\-/g,' '),
                value:response[key]
              });
              result[key] = response[key];
           }
          }
        }
      }
      // sort labels alphabetically
      resultMessageProperties.sort((a,b) => {
        if(a.label < b.label){
          return -1;
        }
        if(a.label > b.label){
          return 1;
        }
        return 0;
      });
      resultMessageProperties.forEach(property=>{
        msg = `${msg}\n<span class="property-name property-name-result" >${property.label}</span>${buildHyperlink(property.value)}`;
      });

      this.resultMessage = {
        title: `A starter application was created.`,
        body: `${msg}`
      } as IAppGeneratorMessage;
      this.hasResultMessage = true;
      this.result = result;
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


  private displayProcessingView(title: string) {
    this.hasProcessingMessage = true;
    this.processingMessage = this.processingMessage || {} as IAppGeneratorMessage;
    this.processingMessage.title = title;
    this.processingMessage.body = '';
  }

  private clearProcessingView() {
    this.hasProcessingMessage = false;
    this.processingMessage = this.processingMessage || {} as IAppGeneratorMessage;
    this.processingMessage.title = '';
    this.processingMessage.body = '';
  }

  private displayErrorView(error) {
    this.log({ message: error.message, inner: error.inner, error: true });
    this.state.title = 'Application Generator Error';
    this.hasErrorMessage = true;
    this.errorMessage = {
      title: `Something went wrong while attempting to perform this operation ...`,
      body: [
        `<div class="message-status-failed" >${error.name}</div>`,
        `<div class="message-status-failed" >${error.message || 'No details available.'}</div>`,
        `<div class="message-details" >${this.formatJson(this.filterObjectProperties(error.inner))}</div>`
      ].join('')
    } as IAppGeneratorMessage;
    this.errorMessage.body = this.errorMessage.body.replace(/SUCCESS/g, '<span class="message-status-success" >SUCCESS</span>');
    this.errorMessage.body = this.errorMessage.body.replace(/FAILED/g, '<span class="message-status-failed" >FAILED</span>');
  }

  private clearErrorView() {
    this.hasErrorMessage = false;
    this.errorMessage = this.errorMessage || {} as IAppGeneratorMessage;
    this.errorMessage.title = '';
    this.errorMessage.body = '';
  }

  private formatJson(source: any, indent: number = 0): string {
    return formatJson(source);
  }

  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => { };
  private createCodebase: ICodebaseCreationDelegate = () => { };

}
