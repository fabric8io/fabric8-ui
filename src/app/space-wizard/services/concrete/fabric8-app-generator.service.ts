import { Inject, Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
/** contracts  */
import {
  AppGeneratorService,
  FieldCollection,
  FieldWidgetClassification,
  FieldWidgetClassificationOptions,
  IAppGeneratorCommand,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IAppGeneratorState,
  IField,
  IFieldCollection,
  IFieldChoice
} from '../contracts/app-generator-service';
/** dependencies */
import {
  IForgeCommandRequest,
  IForgeCommandResponse,
  IForgeInput,
  IForgeService,
  IForgeServiceProvider,
  IForgeCommandData,
  IForgeMetadata
} from '../forge.service';

import {
 AppGeneratorConfigurationService
} from './app-generator-configuration.service';

@Injectable()
export class Fabric8AppGeneratorService extends AppGeneratorService {
  static instanceCount: number = 1;

  getFields(options: IAppGeneratorRequest): Observable<IAppGeneratorResponse> {
    return this.executeForgeCommand(options);
  }

  constructor(
    @Inject(IForgeServiceProvider.InjectToken) private forgeService: IForgeService,
    loggerFactory: LoggerFactory,
    private _configService: AppGeneratorConfigurationService) {
    super();
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, Fabric8AppGeneratorService.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance...`);
  }

  // private handleError(err): Observable<any> {
  //   let errMessage = err.message ? err.message : err.status ? `${err.status} - ${err.statusText}` : 'Server Error';
  //   this.log({ message: errMessage, inner: err, error: true });
  //   return Observable.throw(new Error(errMessage));
  // }

  /**
   * update the values that will be transmitted to forge with the form
   * field values transmitted from the application.
   */
  private updateForgeInputsWithFieldValues( command: IAppGeneratorCommand ): IAppGeneratorCommand {
    if ( command.parameters && command.parameters.fields ) {
      for ( let field of <IFieldCollection>command.parameters.fields ) {
        let inputs: Array<IForgeInput> = command.parameters.data.inputs;
        let input: IForgeInput = inputs.find( i => i.name === field.name );
        if ( input ) {
          input.value = field.value;
        }
      }
    }
    return command;
  }
  /** Initializes the command with default values */
  private initializeCommand( command: Partial<IAppGeneratorCommand> ): IAppGeneratorCommand {
    let emptyCommand: IAppGeneratorCommand = {
      name: '',
      parameters: {
        pipeline: {
          name: '',
          step: {
            name: '',
            index: 0
          }
        },
        fields: [],
        validatedData: {
          inputs: []
        },
        data: {
          inputs: []
        }
      }
    };
    command = command || { name: '' };
    command.parameters = command.parameters || emptyCommand.parameters;
    // fields
    command.parameters.fields = command.parameters.fields || [];
    // data
    command.parameters.data = command.parameters.data || { inputs: [] };
    command.parameters.validatedData = command.parameters.validatedData || { inputs: [] };
    // pipeline
    command.parameters.pipeline = command.parameters.pipeline || emptyCommand.parameters.pipeline;
    command.parameters.pipeline.name = command.parameters.pipeline.name || emptyCommand.parameters.pipeline.name;
    command.parameters.pipeline.step = command.parameters.pipeline.step || emptyCommand.parameters.pipeline.step;
    command.parameters.pipeline.step.name = command.parameters.pipeline.step.name || 'begin';
    command.parameters.pipeline.step.index = command.parameters.pipeline.step.index || 0;

    return command as IAppGeneratorCommand;

  }
  /**
   * Executes the command by invoking the forge api.
   * Before the api is called, the forge inputs are updated with the values from the app form fields.
   * After the api is called, the response is transformed back into form fields again, but preserving
   * the original forge fields in response context.
   */
  private executeForgeCommand( request: IAppGeneratorRequest ): Observable<IAppGeneratorResponse> {
    let cmd = this.updateForgeInputsWithFieldValues(this.initializeCommand(request.command));
    let cmdDescription = `${cmd.name} :: ${cmd.parameters.pipeline.step.name} :: ${cmd.parameters.pipeline.step.index}`;
    this.log(`AppGenerator executing the '${cmdDescription}' command ...`, cmd);
    return Observable.create( (observer: Observer<IAppGeneratorResponse>) => {

      let commandRequest: IForgeCommandRequest = {
        payload: {
          command: request.command
        }
      };
      this.forgeService.executeCommand( commandRequest )
      .map( (forgeResponse) => this.transformForgeResponseToAppGeneratorResponse(request, forgeResponse) )
      .map( (forgeResponse) => this._configService.updateGeneratorResponse('', forgeResponse) )
      .subscribe( (response: IAppGeneratorResponse) => {
        this.log(`AppGenerator '${cmdDescription}' command completed`, response);
        observer.next(response);
        observer.complete();
      }, (err: Error|any) => {
         let error = {
           origin: 'Fabric8AppGeneratorService',
           name: 'ExecuteForgeCommandError' ,
           message: `The <strong><i>${cmdDescription}</i></strong> command failed or only partially succeeded`,
           inner: err
         };
         this.log({ message: error.message , error: true }, err);
         return observer.error(error);
      });
    });
  }
  private transformForgeDataToFields( source: IForgeCommandData   ): IFieldCollection {
    let fields = new FieldCollection();
    source.inputs = source.inputs || [];
    for ( let sourceInput of <IForgeInput[]>source.inputs ) {
      let targetField: IField = {
        name: sourceInput.name,
        value: sourceInput.value,
        valueType: this.mapFieldValueDataType(sourceInput),
        display: {
          choices: this.mapValueChoices(sourceInput),
          hasChoices: this.mapValueHasOptions(sourceInput),
          description: sourceInput.description,
          inputType: this.mapWidgetClassification(sourceInput),
          label: sourceInput.label,
          required: sourceInput.required,
          enabled: sourceInput.enabled,
          visible: sourceInput.deprecated === false,
          index: 0
        }
      };
      if ( targetField.display.hasChoices
        && targetField.display.inputType === FieldWidgetClassificationOptions.MultipleSelection ) {
        // change to an array for binding purposes
        targetField.value = [];
      }
      // add dynamic fields that vary with payload
      if ( sourceInput.note ) {
        targetField.display.note = sourceInput.note;
      }
      if ( source.messages ) {
        for ( let message of source.messages ) {
          if ( message.input === sourceInput.name ) {
            targetField.display.message = message;
          }
        }
      }
      fields.push(targetField);
    }
    return fields;
  }
  private transformDataToFieldsFields( command: IAppGeneratorCommand ) {
    if (command && command.parameters ) {
      command.parameters.fields = this.transformForgeDataToFields(
        command.parameters.data || { inputs: []} as IForgeCommandData);
    }
  }
  private transformForgeResponseToAppGeneratorResponse( request: IAppGeneratorRequest, source: IForgeCommandResponse ) {
    let forgeData: IForgeCommandData = source.payload.data;
    forgeData.metadata = forgeData.metadata || {} as IForgeMetadata;
    let fields = this.transformForgeDataToFields( forgeData );

    let commandResponse = {
      payload: {
        fields: fields,
        results: forgeData.results || [],
        state: {
          valid: forgeData.state.valid || false,
          isExecute: forgeData.state.isExecute,
          canMoveToNextStep: forgeData.state.canMoveToNextStep || false,
          canMovePreviousStep: forgeData.state.canMoveToPreviousStep || false,
          canExecute: forgeData.state.canExecute || false,
          steps: forgeData.state.steps || [],
          currentStep: request.command.parameters.pipeline.step.index || 0,
          title: forgeData.metadata.name || '',
          description: forgeData.metadata.name || ''
        } as IAppGeneratorState
      },
      context: source.context || {}
    } as IAppGeneratorResponse;
    // now update commands with field data from forge data

    this.transformDataToFieldsFields( commandResponse.context.validationCommand );
    this.transformDataToFieldsFields( commandResponse.context.nextCommand );
    return commandResponse;

  }

  private mapValueHasOptions( source: IForgeInput ): boolean {
    if ( source.valueChoices ) {
      return source.valueChoices.length > 0;
    }
    return false;
  }

  private mapValueChoices( source: IForgeInput ): Array<IFieldChoice> {
    let items: Array<IFieldChoice> = [];
    if ( source.valueChoices ) {
      //
      let selection: string[] = [];
      if (!Array.isArray(source.value)) {
        selection.push(source.value  as string);
      } else {
        selection = source.value || [];
      }
      let hash: any = {};
      for (let item of selection)
      {
        hash[item] = true;
      }
      for ( let choice of source.valueChoices ) {

        if ( source.description ) {
          items.push({
            id: choice.id,
            name: choice.description,
            description: choice.description,
            visible: true,
            selected: hash[choice.id] === true
          });
        } else {
          items.push({
            id: choice.id,
            name: choice.id,
            description: choice.id,
            visible: true,
            selected: hash[choice.id] === true
          });

        }
      }
    }
    return items;
  }

  private mapFieldValueDataType( source: IForgeInput ): string {
    if ( !source.valueType ) {
      return 'string';
    }
    switch ( (source.valueType || '').toLowerCase() ) {
      case 'java.lang.string': {
        return 'string';
      }
      case 'java.lang.boolean': {
        return 'boolean';
      }
      case 'java.lang.integer': {
        return 'number';
      }
      case 'org.jboss.forge.addon.projects.projectType': {
        return 'stackVariant';
      }
      default: {
        return 'string';
      }
    }
  }

  private mapWidgetClassification( source: IForgeInput ): FieldWidgetClassification {
    switch ( (source.class || '').toLowerCase() ) {
      case 'uiinput': {
        return FieldWidgetClassificationOptions.SingleInput;
      }
      case 'uiselectone': {
        return FieldWidgetClassificationOptions.SingleSelection;
      }
      case 'uiselectmany': {
        return FieldWidgetClassificationOptions.MultipleSelection;
      }
      default: {
        return FieldWidgetClassificationOptions.SingleInput;
      }
    }
  }

  private mapFieldSetToRequest( source: IFieldCollection ): IForgeCommandRequest {
    return { payload: { command: { name: '' } } };
  }

  // default logger does nothing when called
  private log: ILoggerDelegate = () => {};

}



