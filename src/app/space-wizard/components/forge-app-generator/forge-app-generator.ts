//
import { Observable, Observer } from 'rxjs/Rx';
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { IWorkflow } from '../../models/workflow';
import { formatJson } from '../../common/utilities';

import {
  IAppGeneratorCommand,
  IAppGeneratorPair,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IAppGeneratorResponseContext,
  IAppGeneratorService,
  IAppGeneratorState,
  IField,
  IFieldCollection,
  IAppGeneratorError,
  IAppGeneratorMessage

} from '../../services/app-generator.service';

export class ForgeAppGenerator {
  static instanceCount: number = 1;

  public workflow: IWorkflow;
  public name: string;
  public state: IAppGeneratorState;
  public processing: Boolean = false;
  public hasError: Boolean;
  public error: IAppGeneratorError;
  public errorClassification: string = 'information'; 
  public hasResult: Boolean;
  public result: IAppGeneratorMessage;
  public hasMessage: Boolean;
  public message: IAppGeneratorMessage;

  private _fieldSet: IFieldCollection;
  private _responseHistory: Array<IAppGeneratorResponse>;
  private _currentResponse: IAppGeneratorResponse;

  constructor(private _appGeneratorService: IAppGeneratorService, loggerFactory: LoggerFactory) {
    this.log = loggerFactory.createLoggerDelegate(this.constructor.name, ForgeAppGenerator.instanceCount++);
    this.state = {
      canExecute: false,
      isExecute: false,
      canMovePreviousStep : false ,
      canMoveToNextStep : false,
      currentStep: 0,
      steps: [''],
      title: '',
      description: '',
      valid: false
    } as IAppGeneratorState;
    this.fields = [];
    this.clearErrors();
    this.clearResult();
    this.clearMessage();
    this.processing = false;
  }

  public get fields(): IFieldCollection {
    this._fieldSet = this._fieldSet || [];
    return this._fieldSet;
  }

  public set fields(value: IFieldCollection) {
    this._fieldSet = value;
  }

  public clearErrors() {
    this.hasError = false;
    this.error = this.error || {} as IAppGeneratorError;
    this.error.message = '';
    this.error.details = '';
    this.error.inner = '';
  }
  public clearMessage() {
    this.hasMessage = false;
    this.message = this.message || {} as IAppGeneratorMessage;
    this.message.title = '';
    this.message.body = '';
  }

  public clearResult() {
    this.hasResult = false;
    this.result = this.result || {} as IAppGeneratorMessage;
    this.result.title = '';
    this.result.body = '';
  }

  public reset() {
    this.responseHistory = [];
    this._currentResponse = null;
    this.fields = [];
    this.clearErrors();
    this.clearResult();
    this.clearMessage();
  }

  public acknowledgeStarterApp() {
    this.reset();
    this.workflow.gotoPreviousStep();
  }

  public addResultToSpace() {
    alert('does not do any thing yet...');
  }

  public finish() {
    this.execute().then(execution => {
      this.workflow.finish();
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



  private spinnerMessage(title:string):IAppGeneratorMessage {
    this.hasMessage=true;
    return {
      title:title||'',
      body:`<div class="busy-indicator"><div class="spinner spinner-lg"></div></div>`
    }
  }

  public begin() {
    this.reset();
    this.message = this.spinnerMessage('Loading application generator ...');
    let request: IAppGeneratorRequest = {
      command: {
        name: `${this.name}`
      }
    };
    let commandInfo = `${request.command.name}`;
    this.log(`Begin request for command ${commandInfo}.`, request);
    return this._appGeneratorService.getFields(request)
    .subscribe(response => {
      this.log(`Begin response for command ${commandInfo}.`, request);
      this.applyTheNextCommandResponse({ request, response });
      // do an initial validate
      this.validate().then( (validation) => {
        this.clearMessage();
      }, (error) => {
        this.clearMessage();
        this.handleError(error);
      });
    }, (error) => {
      this.clearMessage();
      this.handleError(error);
    });
  }

  public gotoPreviousStep() {
    let response = this.responseHistory.pop();
    this.fields = response.payload.fields;
    this.log(`Restored fieldset[${response.payload.fields.length}] from fieldset history
              ... there are ${this.responseHistory.length} items in history ...`);
  }

  public gotoNextStep() {
    this.processing = true;
    this.validate().then((validated) => {
      this.processing = true;
      let cmd: IAppGeneratorCommand = this._currentResponse.context.nextCommand;
      cmd.parameters.fields = this.fields;
      // pass along the validated data and fields
      cmd.parameters.validatedData = validated.request.command.parameters.data;
      let request: IAppGeneratorRequest = {
        command: cmd
      };
      let cmdInfo = `${cmd.name} :: ${cmd.parameters.pipeline.step.name} :: ${cmd.parameters.pipeline.step.index}`;
      this.log(`Next request for command ${cmdInfo}.`, request, console.group);
      this._appGeneratorService.getFields( request )
        .subscribe( (response) => {
          this.log(`Next response for command ${cmdInfo}.`, request);
          this.applyTheNextCommandResponse( { request, response } );
          this.processing = false;
        }, (error) => {
          this.processing = false;
          this.handleError(error);
        });

    }).catch(error => {
      this.processing = false;
      this.handleError(error);
      this.log({ message: error.message, warning: true } );
    });

  }

public execute() {
    return new Promise<IAppGeneratorPair>((resolve, reject) => {
      this.processing = true;
      this.validate().then((validated) => {
        this.processing = true;
        let cmd: IAppGeneratorCommand = validated.response.context.executeCommand;
        // pass along the validated data and fields
        let request: IAppGeneratorRequest = {
          command: cmd
        };
        let cmdInfo = `${cmd.name}:${cmd.parameters.pipeline.step.name}:${cmd.parameters.pipeline.step.index}`;
        this.log(`Execute request for command ${cmdInfo}.`, request, console.group);
        this._appGeneratorService.getFields( request )
          .subscribe( (response) => {
            this.log(`Execute response for command ${cmdInfo}.`, response , console.groupEnd);
            this.applyTheExecuteCommandResponse({request, response});
            resolve({request, response});
            this.processing = false;
          }, (error) => {
            this.processing = false;
            this.handleError(error);
          });

      }).catch(error => {
        this.processing = false;
        this.handleError(error);
        this.log({ message: error.message, warning: true } );
      });
    });
  }

  public validate() {
    return new Promise<IAppGeneratorPair>((resolve, reject) => {
      // update the values to be validated
      let cmd: IAppGeneratorCommand = this._currentResponse.context.validationCommand;
      for ( let field of this.fields)
      {
        let requestField = cmd.parameters.fields.find((f) => f.name === field.name);
        requestField.value = field.value;
      }

      let request: IAppGeneratorRequest = {
        command: cmd
      };
      let commandInfo = `${cmd.name}:${cmd.parameters.pipeline.step.name}:${cmd.parameters.pipeline.step.index}`;
      this.log(`Validation request for command ${commandInfo}.`, request, console.group );
      this.processing = true;
      this._appGeneratorService.getFields( request )
        .subscribe( (response) => {
          let validationState = response.payload.state;
          this.log({
            message: `Validation response for command ${commandInfo}.`,
            info: validationState.valid,
            warning: !validationState.valid
          }, response, console.groupEnd);

          // only assign these state fields ... not the entire state
          this.state.canExecute = validationState.canExecute;
          this.state.canMoveToNextStep = validationState.canMoveToNextStep;
          this.state.canMovePreviousStep = validationState.canMovePreviousStep;
          this.state.valid = validationState.valid;

          let validatedFields: IFieldCollection = [];
          for ( let field of this.fields)
          {
            let found = response.payload.fields.find((f) => f.name === field.name);
            // only need to update the display properties
            field.display = found.display;
          }
          if (this.state.valid) {
            resolve({request, response});
          }
          this.processing = false;

        }, ( error => {
          this.processing = false;
          reject({
                   message: 'Something went wrong while attempting to validate the information on this page.',
                   inner: error} );
        }));
    });
  }

  private applyTheNextCommandResponse( next: IAppGeneratorPair ) {

    let cmd: IAppGeneratorCommand = next.response.context.currentCommand;

    this.state = next.response.payload.state;
    let previousResponse = this._currentResponse;
    if ( previousResponse ) {
        this.responseHistory.push(previousResponse);
        this.log(`Stored fieldset[${previousResponse.payload.fields.length}] into fieldset history
                  ... there are ${this.responseHistory.length} responses in history ...`);

    }
    this._currentResponse = next.response;
    this.fields = next.response.payload.fields;
  }

  private applyTheExecuteCommandResponse( execution: IAppGeneratorPair ) {
    let results = execution.response.payload.results || [];
    let buildHyperlink = (obj, property) => {
      if ((obj[property] || '').toString().toLowerCase().startsWith('http')) {
        return `<a class=' wizard-result-property-value wizard-result-property-value-link' target='_blank' href='${obj[property]}' > ${obj[property]} </a> `;
      } else {
        return obj[property];
      }
    };
    if ( results.length > 0 ) {
      let msg = `<span class='wizard-status-success'>[SUCCESS]</span> :`;
      for (let response of results.filter(r => r !== null)) {
        if ( Array.isArray(response) ) {
          continue;
        }
        for (let property in response) {
          if (Array.isArray(response[property])) {
            continue;
          }
          if ( response.hasOwnProperty(property) ) {
            msg = `${msg}\n<span class='wizard-result-property-name'>${property}</span>${buildHyperlink(response, property)}`;
          }
        }
      }
      this.result = {
        title: `A starter application was successfully created.`,
        body: this.formatConsoleText(`\n`, `${msg}`)
      } as IAppGeneratorMessage;
      this.hasResult = true;
    }
  }

  private get responseHistory(): Array<IAppGeneratorResponse> {
    this._responseHistory = this._responseHistory || [];
    return this._responseHistory;
  }

  private set responseHistory(value: Array<IAppGeneratorResponse>) {
    this._responseHistory = value;
  }

  private hasResults(error:any) {
    if( error ) {
      if( error.descriptor ) {
        return error.descriptor.hasResults||false;
      }
      if(error.inner){
        return this.hasResults( error.inner )
      }
    }
    return false;
  }
  private hasException(error:any) {
    if( error ) {
      if( error.descriptor ) {
        return error.descriptor.hasException||false;
      }
      if(error.inner){
        return this.hasResults( error.inner )
      }
    }
    return false;
  }
  private handleError(error): Observable<any> {
    this.log({ message: error.message, inner: error.inner, error: true });
    let hasResults = this.hasResults(error);
    let hasException = this.hasException(error);
    this.errorClassification = hasResults ===true ? 'information' : 'error';
    this.hasError = true;
    this.error = {
      message: `Something went wrong while attempting to perform this operation ...`,
      details: this.formatConsoleText(
        `<span class='wizard-status-warning' >${error.message || 'No details available.'}</span>`,
        `${this.formatJson(error.inner)}`)
    } as IAppGeneratorError;
    return Observable.empty();
  }

  private formatConsoleText(...lines: string[]) {
    lines = lines || [];
    return lines.join('\n');
  }

  private formatJson(source: any, indent: number= 0): string {
    return formatJson(source);
  }

  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => { };

}
