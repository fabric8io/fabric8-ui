//
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { IForgeCommandData, IForgeState } from '../../models/forge';
import { IWorkflow } from '../../models/workflow';

import {
  IAppGeneratorCommand,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IAppGeneratorResponseContext,
  IAppGeneratorService,
  IField,
  IFieldCollection
} from '../../services/app-generator.service';

export class ForgeAppGenerator {
  static instanceCount: number = 1;

  workflow: IWorkflow;
  name: string;
  state: IForgeState;

  private _fieldSet: IFieldCollection;
  private _responseHistory: Array<IAppGeneratorResponse>;
  private currentResponse: IAppGeneratorResponse;

  constructor(private _appGeneratorService: IAppGeneratorService, loggerFactory: LoggerFactory) {
    this.log = loggerFactory.createLoggerDelegate(this.constructor.name, ForgeAppGenerator.instanceCount++);
  }

  private get responseHistory(): Array<IAppGeneratorResponse> {
    this._responseHistory = this._responseHistory || [];
    return this._responseHistory;
  };

  private set responseHistory(value: Array<IAppGeneratorResponse>) {
    this._responseHistory = value;
  };

  get fields(): IFieldCollection {
    this._fieldSet = this._fieldSet || [];
    return this._fieldSet;
  }

  set fields(value: IFieldCollection) {
    this._fieldSet = value;
  }

  begin() {
    this.responseHistory=[];
    let request: IAppGeneratorRequest = {
      command: {
        name: `${this.name}`
      }
    };
    this.log('command being sent to the app generator service:');
    return this._appGeneratorService.getFields(request)
    .subscribe(response => {
      this.applyServiceResponse(request, response);
    });
  }

  applyServiceResponse(request: IAppGeneratorRequest, 
                response: IAppGeneratorResponse) {
    
    this.log({ message: `received a response for command = ${request.command.name}`, info: true });
    console.dir(response);
    let cmd: IAppGeneratorCommand = response.context.nextCommand;//.currentCommand;
    let currentCommandForgeData: IForgeCommandData = cmd.parameters.data;
    this.state = currentCommandForgeData.state;
    if(this.state.valid)
    {
      let previousResponse = this.currentResponse;
      if( previousResponse )
      {
        this.responseHistory.push(previousResponse);
        this.log(`Stored fieldset[${previousResponse.payload.fields.length}] into fieldset history
                  ... there are ${this.responseHistory.length} responses in history ...`);

      }
    }
    this.currentResponse = response;
    this.fields = response.payload.fields;
  }

  validate(){

    let validationCommand: IAppGeneratorCommand = this.currentResponse.context.validationCommand;
    //set command fields parameter
    validationCommand.parameters.fields = this.fields;
    this.log('validation command being sent to the app generator service:');
    console.dir( validationCommand );

    let validationRequest: IAppGeneratorRequest = {
      command: validationCommand
    };

    this._appGeneratorService.getFields( validationRequest )
      .subscribe( (validationResponse) => {
        this.applyServiceResponse( validationRequest, validationResponse );
      });
    
  }

  gotoNextStep() {
    
    let validationCommand: IAppGeneratorCommand = this.currentResponse.context.validationCommand;
    //set command fields parameter
    validationCommand.parameters.fields = this.fields;
    this.log('validation command being sent to the app generator service:');
    console.dir( validationCommand );

    let validationRequest: IAppGeneratorRequest = {
      command: validationCommand
    };

    this._appGeneratorService.getFields( validationRequest )
      .subscribe( (validationResponse) => {
        this.applyServiceResponse( validationRequest, validationResponse );
        if( this.state.valid === true ) {
          let command: IAppGeneratorCommand = this.currentResponse.context.nextCommand;
          command.parameters.fields = this.fields;
          let request: IAppGeneratorRequest = {
            command: command
          };
          this.log( 'command being sent to the app generator service:' );
          console.dir( command );
          this._appGeneratorService.getFields( request )
            .subscribe( (response) => {
              this.applyServiceResponse( request, response );
            });
        }
      });
    // TODO: need a way to be aware that the app generator pipeline is complete
    // if(this.workflow)
    // {
    //   this.workflow.gotoNextStep();
    // }

  }

  gotoPreviousStep() {
    let response = this.responseHistory.pop();
    this.fields = response.payload.fields;
    this.log(`Restored fieldset[${response.payload.fields.length}] from fieldset history
              ... there are ${this.responseHistory.length} items in history ...`);
  }

  execute() {
    if ( this.state && this.state.canExecute ) {

    }
  }

  reset() {
    this.responseHistory = [];
    this.currentResponse = null;
    this.fields = [];
  }

  finish() {
    this.workflow.finish();
    this.reset();
  }

  cancel() {
    this.reset();
    this.workflow.cancel();
  }

  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => { };

}
