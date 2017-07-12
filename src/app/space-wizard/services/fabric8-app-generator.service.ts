import { Inject, Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

import { ILoggerDelegate, LoggerFactory } from '../common/logger';
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
} from './contracts/app-generator-service';
/** dependencies */
import {
  IForgeCommandRequest,
  IForgeCommandResponse,
  IForgeInput,
  IForgeService,
  IForgeServiceProvider,
  IForgeCommandData,
  IForgeMetadata,
  IForgeState
} from './forge.service';

import {
 AppGeneratorConfiguratorService
} from './fabric8-app-generator-configurator.service';
import { ApiLocatorService } from '../../shared/api-locator.service';

@Injectable()
export class Fabric8AppGeneratorService extends AppGeneratorService {
  static instanceCount: number = 1;

  getFields(options: IAppGeneratorRequest): Observable<IAppGeneratorResponse> {
    return this.executeForgeCommand(options);
  }
  private _ssoApiUrl: string;
  private _realm: string;

  constructor(
    @Inject(IForgeServiceProvider.InjectToken) private forgeService: IForgeService,
    loggerFactory: LoggerFactory,
    private _configuratorService: AppGeneratorConfiguratorService,
    apiLocator: ApiLocatorService) {
    super();
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, Fabric8AppGeneratorService.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this._ssoApiUrl = apiLocator.ssoApiUrl;
    this._realm = apiLocator.realm;
    this.log(`New instance...`);
  }

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
          this._configuratorService.scrubAppGeneratorRequest(command, input, field);
        }
      }
      if ( command.parameters.pipeline && command.parameters.pipeline.step && (command.parameters.pipeline.step.name || '').toLowerCase() === 'execute' ) {
        this._configuratorService.appendAppGeneratorRequestMissingFields(command);
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
      .map( (forgeResponse) => this.transformForgeResponseIntoAnAppGeneratorResponse(request, forgeResponse) )
      .map( (response) => this._configuratorService.scrubAppGeneratorResponse({ request, response }) )
      .subscribe( (response: IAppGeneratorResponse) => {
        this.log(`AppGenerator '${cmdDescription}' command completed`, response);
        observer.next(response);
        observer.complete();
      }, (err: Error|any) => {
          let error = {
           origin: 'Fabric8AppGeneratorService',
           name: 'ExecuteForgeCommandError' ,
           message: `The ${cmdDescription} command failed or only partially succeeded`,
           inner: err
         };
        if (err.message == "io.fabric8.forge.generator.keycloak.KeyCloakFailureException") {
          error = {
           origin: 'KeyCloak SSO error',
           name: 'KeyCloakFailureException',
           message: `Please visit <a class="property-value property-value-result property-value-link" target="_blank" href="${this._ssoApiUrl}auth/realms/${this._realm}/account/identity" >${this._ssoApiUrl}auth/realms/${this._realm}/account/identity</a> to unlink your SSO account`,
           inner: err
         };
        }

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
        /** returns the original source data to be used  */
        source: () => sourceInput,
        display: {
          choices: this.mapValueChoices(sourceInput),
          hasChoices: this.mapValueHasOptions(sourceInput),
          description: sourceInput.description,
          // default text is the value
          text: sourceInput.value,
          inputType: this.mapWidgetClassification(sourceInput),
          label: sourceInput.label,
          required: sourceInput.required,
          readonly: false,
          enabled: sourceInput.enabled,
          visible: sourceInput.deprecated === false,
          valid: true,
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
            // if the field has a message then it means that something is not valid
            targetField.display.message = message;
            targetField.display.valid = false;
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
  private transformForgeResponseIntoAnAppGeneratorResponse(
    request: IAppGeneratorRequest,
    response: IForgeCommandResponse ) {
    let forgeResponseData: IForgeCommandData = response.payload.data;
    forgeResponseData.metadata = forgeResponseData.metadata || {} as IForgeMetadata;
    let fields = this.transformForgeDataToFields( forgeResponseData );

    let appGeneratorResponse = {
      payload: {
        fields: fields,
        results: forgeResponseData.results || [],
        state: this.transformState(request, response)
      },
      context: response.context || {}

    } as IAppGeneratorResponse;
    // now update commands with field data from forge data

    this.transformDataToFieldsFields( appGeneratorResponse.context.validationCommand );
    this.transformDataToFieldsFields( appGeneratorResponse.context.nextCommand );
    return appGeneratorResponse;

  }

  private transformState(request: IAppGeneratorRequest,
    response: IForgeCommandResponse ): IAppGeneratorState {
    let forgeResponseData: IForgeCommandData = response.payload.data;
    let forgeState: IForgeState = forgeResponseData.state;
    let state = <IAppGeneratorState>{
      valid: forgeState.valid || false,
      isExecute: forgeState.isExecute,
      canMoveToNextStep: forgeState.canMoveToNextStep || false,
      canMovePreviousStep: forgeState.canMoveToPreviousStep || false,
      canExecute: forgeState.canExecute || false,
      steps: this.transformSteps(forgeState.steps || []),
      currentStep: request.command.parameters.pipeline.step.index || 0,
      title: forgeResponseData.metadata.name || '',
      description: forgeResponseData.metadata.name || ''
    };
    return state;
  }

  private transformSteps(steps: Array<string>= []): Array<any> {
    let index = 0;
    let transformedSteps: Array<any> = steps.map(s => {
       return {
         id: (s || '').trim().toLowerCase(),
         name: '',
         title: '',
         active: false,
         index: index ++
        };
    });
    return transformedSteps;
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
      let index: number = 0;
      for ( let choice of source.valueChoices ) {
        if ( choice.description ) {
          items.push({
            index: index,
            id: choice.id,
            name: choice.id,
            description: choice.description,
            visible: true,
            isDefault: false,
            selected: hash[choice.id] === true
          });
        } else {
          items.push({
            index: index,
            id: choice.id,
            name: choice.id,
            description: choice.id,
            visible: true,
            isDefault: false,
            selected: hash[choice.id] === true
          });
        }
        index ++;
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
        return FieldWidgetClassificationOptions.SingleSelectionDropdown;
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
