import { Injectable, Inject } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

/** contracts  */
import { IAppGeneratorResponse, IAppGeneratorRequest, IAppGeneratorCommand, IFieldSet, FieldSet, IFieldInfo, FieldWidgetClassificationOptions, FieldWidgetClassification, IFieldValueOption, IAppGeneratorService, AppGeneratorService } from '../contracts/app-generator-service'

/** dependencies */
import { IForgeService, IForgeResponse, IForgeRequest, IForgeServiceProvider, IForgeInput, IForgeValueChoice, IForgeCommandPayload } from '../forge.service'


import { LoggerFactory, ILoggerDelegate } from '../../common/logger';

@Injectable()
export class Fabric8AppGeneratorService extends AppGeneratorService {
  static instanceCount: number = 1;
  // default logger does nothing when called
  private log: ILoggerDelegate = () => { };

  constructor(
    @Inject(IForgeServiceProvider.InjectToken) private forgeService: IForgeService,
    loggerFactory: LoggerFactory
  ) {
    super();
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, Fabric8AppGeneratorService.instanceCount++);
    if (logger) {
      this.log = logger;
    }
    this.log(`New instance...`);
  }
  getFieldSet(options: IAppGeneratorRequest): Observable<IAppGeneratorResponse> {
    let service: IForgeService = this.forgeService;
    let observable = this.executeCommand(options)
    return observable;
  }
  private handleError(err): Observable<any> {
    let errMessage = err.message ? err.message : err.status ? `${err.status} - ${err.statusText}` : 'Server Error';
    this.log({ message: errMessage, inner: err, error: true })
    return Observable.throw(new Error(errMessage));
  }
  private updateForgeInputsWithAppInputs(command: any): any {
    if (command.parameters.inputs) {
      for (let input of command.parameters.inputs) {
        let field: IFieldInfo = input;
        let data: Array<IForgeInput> = command.parameters.data.inputs;
        let forgeField = data.find(i => i.name === field.name);
        if (forgeField) {
          forgeField.value = field.value;
        }

      }
    }
    return command;
  }
  private executeCommand(options:IAppGeneratorRequest ): Observable<IAppGeneratorResponse> {
    let command = this.updateForgeInputsWithAppInputs(options.command);
    this.log(`Invoking forge service for command = ${options.command.name} ...`);
    console.dir(command);
    let observable: Observable<IAppGeneratorResponse> = Observable.create((observer: Observer<IAppGeneratorResponse>) => {
      this.forgeService.ExecuteCommand({
        command: options.command
      })
        .map((fr) => this.updateForgeResponseContext(fr, options.command))
        .map((fr) => this.mapForgeResponseToAppGeneratorResponse(fr))
        .map((ar) => this.updateAppGeneratorResponseContext(ar))
        .catch((err) => this.handleError(err))
        .subscribe((appGeneratorResponse: IAppGeneratorResponse) => {
          console.dir(appGeneratorResponse);
          observer.next(appGeneratorResponse);
          observer.complete();
        })
    });
    return observable;
  }
  private updateForgeResponseContext(forgeResponse: IForgeResponse, command: any): IForgeResponse {
    let forgePayload: IForgeCommandPayload = forgeResponse.payload;
    this.log({ message: "Forge Response...", warning: true });
    console.dir(forgeResponse);
    let workflow: any = {};
    if (forgePayload) {
      // the state we get from forge helps to determine the next workflow steps
      let forgeState = forgePayload.state
      if (forgeState.wizard === true) {
        if (forgeState.canMoveToNextStep === true) {
          workflow.step = { name: "next", index: 1 };
        }
        if (forgeState.canExecute === true) {
          workflow.step = { name: "execute" };
        }
        if (forgeState.valid == false) {
          workflow.step = { name: "validate" };
        }
      }
      else {
        if (forgeState.canExecute === true) {
          workflow.step = { name: "execute" };
        }
        if (forgeState.valid == false) {
          workflow.step = { name: "validate" };
        }
      }
    }
    forgeResponse.context = forgeResponse.context || {};
    // shape the command that will be used for the next command
    forgeResponse.context.nextCommand = {
      name: command.name,
      parameters: {
        workflow: workflow || {},
        data: forgePayload
      }
    }
    return forgeResponse;
  }
  private updateAppGeneratorResponseContext(response: IAppGeneratorResponse): IAppGeneratorResponse {
    this.log("updateAppGeneratorResponseContext...")
    return response;
  }
  private mapForgeResponseToAppGeneratorResponse(source: IForgeResponse): IAppGeneratorResponse {
    let targetItems = new FieldSet();
    this.log("mapForgeResponseToAppGeneratorResponse...")
    source.payload = source.payload || { inputs: [] };
    source.payload.inputs = source.payload.inputs || [];
    for (let input of source.payload.inputs) {
      let sourceItem: IForgeInput = input;
      let targetItem: IFieldInfo = {
        name: sourceItem.name,
        value: sourceItem.value,
        valueType: this.mapFieldValueDataType(sourceItem),
        display: {
          options: this.mapValueOptions(sourceItem),
          hasOptions: this.mapValueHasOptions(sourceItem),
          inputType: this.mapWidgetClassification(sourceItem),
          label: sourceItem.label,
          required: sourceItem.required,
          enabled: sourceItem.enabled,
          visible: sourceItem.deprecated === false,
          index: 0
        },
      };
      if (targetItem.display.hasOptions && targetItem.display.inputType === FieldWidgetClassificationOptions.MultipleSelection) {
        //change to an array for binding purposes
        targetItem.value = [];
      }
      // add dynamic fields that vary with payload
      if (input.note) {
        targetItem.display.note = input.note;
      }
      if (source.payload.messages) {
        for (let message of source.payload.messages) {
          if (message.input == input.name) {
            targetItem.display.message = message
          }
        }
      }
      targetItems.push(targetItem);
    }
    let response: IAppGeneratorResponse = {
      payload: targetItems,
      context: source.context
    };
    return response;
  }

  private mapValueHasOptions(source: IForgeInput): boolean {
    if (source.valueChoices) {
      return source.valueChoices.length > 0;
    }
    return false;
  }
  private mapValueOptions(source: IForgeInput): Array<IFieldValueOption> {
    let items: Array<IFieldValueOption> = []
    if (source.valueChoices) {
      for (let choice of source.valueChoices) {
        if (source.description) {
          items.push({ id: choice.id, name: choice.description, description: choice.description })
        }
        else {
          items.push({ id: choice.id, name: choice.id })

        }
      }
    }
    return items;
  }
  private mapFieldValueDataType(source: IForgeInput): string {
    if (!source.valueType) {
      return "string";
    }
    switch ((source.valueType || "").toLowerCase()) {
      case "java.lang.string":
        {
          return "string";
        }
      case "java.lang.boolean":
        {
          return "boolean";
        }
      case "java.lang.integer": {
        return "number";
      }
      case "org.jboss.forge.addon.projects.projectType":
        {
          return "projectType"
        }
      default:
        {
          return "string";
        }
    }
  }

  private mapWidgetClassification(source: IForgeInput): FieldWidgetClassification {
    switch ((source.class || "").toLowerCase()) {
      case "uiinput":
        {
          return FieldWidgetClassificationOptions.SingleInput;
        }
      case "uiselectone":
        {
          return FieldWidgetClassificationOptions.SingleSelection;
        }
      case "uiselectmany": {
        return FieldWidgetClassificationOptions.MultipleSelection;
      }
      default:
        {
          return FieldWidgetClassificationOptions.SingleInput;
        }
    }
  }

  private mapFieldSetToRequest(source: IFieldSet): IForgeRequest {
    return { command: { name }, payload: {} };
  }

}



