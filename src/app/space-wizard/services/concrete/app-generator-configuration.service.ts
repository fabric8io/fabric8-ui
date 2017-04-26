import { Injectable } from '@angular/core';

import { ContextService } from '../../../shared/context.service'
import {
  Space,
  Context,
  Contexts,
  ContextTypes,
  SpaceService,
  SpaceNamePipe
} from 'ngx-fabric8-wit';

import {
  AppGeneratorService,
  FieldCollection,
  FieldWidgetClassification,
  FieldWidgetClassificationOptions,
  IAppGeneratorCommand,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IAppGeneratorPair,
  IAppGeneratorResponseContext,
  IAppGeneratorState,
  IField,
  IFieldCollection,
  IFieldChoice
} from '../contracts/app-generator-service';
/** dependencies */
import {
  IForgeCommandRequest,
  IForgeCommandResponse,
  IForgeCommandPipeline,
  IForgeInput,
  IForgeService,
  IForgeServiceProvider,
  IForgeCommandData,
  IForgeState,
  IForgeMetadata
} from '../forge.service';

import { ILoggerDelegate, LoggerFactory } from '../../common/logger';

@Injectable()
export class AppGeneratorConfigurationService {

  static instanceCount: number = 1;

  public currentSpace: Space;

  constructor(loggerFactory: LoggerFactory, private context:ContextService){

    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, AppGeneratorConfigurationService.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance...`);
    this.context.current.subscribe( (ctx:Context) => {
      if(ctx.space){
        this.currentSpace = ctx.space;
        this.log(`the current space is updated to ${this.currentSpace.attributes.name}`);
      }
    })

  }

  private augmentTitle(context: string, execution: IAppGeneratorPair) {
    let response = execution.response;
    let title = response.payload.state.title || '';
    switch( title.toLowerCase() ) {
      case 'io.fabric8.forge.generator.github.githubrepostep': {
        response.payload.state.title = 'GitHub repository information';
        break;
      }
      case 'fabric8: new project': {
        response.payload.state.title = 'Quickstart';
        break;
      }
      case 'launchpad: new project': {
        response.payload.state.title = 'Quickstart';
        break;
      }
      case 'obsidian: configure pipeline': {
        response.payload.state.title = 'Select a build pipeline strategy ... ';
        break;
      }
      case 'io.fabric8.forge.generator.kubernetes.createbuildconfigstep': {
        response.payload.state.title = 'Select the pipeline build options ... ';
        break;
      }
      default: {
        break;
      }
    }
  }

  private getValidationCommandFields( context: string, execution: IAppGeneratorPair ) : IFieldCollection {
    let response = execution.response;
    let validationFields=[];
    if( response.context
        && response.context.validationCommand
        && response.context.validationCommand.parameters
        && response.context.validationCommand.parameters.fields ) {
      validationFields=response.context.validationCommand.parameters.fields
    }
    return validationFields;
  }

  private has(obj, keys):boolean {
    var next = keys.shift();
    let tmp = false;
    if(obj.hasOwnProperty(next)) {
      tmp = true;
      if( keys.length > 0 ) {
        tmp = this.has(obj[next], keys);
      }
    }
    //let tmp= obj[next] && (! keys.length || this.has(obj[next], keys));
    return tmp;
  }

  private isFirstNonValidationStep(context: string, execution: IAppGeneratorPair): boolean
  {
     let hasProperty = this.has(execution,['request','command','parameters','pipeline','step','index']);
     if( hasProperty && execution.request.command.parameters.pipeline.step.name !== 'validate' ) {
        return execution.request.command.parameters.pipeline.step.index === 0;
     }
     return false;
  }

  private augmentPipelineChoices( field:IField, context:string, execution: IAppGeneratorPair ) {
    // augment display properties
    for( let choice of <Array<IFieldChoice>>field.display.choices ) {
      choice.default = false;
      switch(choice.id.toLowerCase()){
        case 'canaryrelease': {
          choice.index = 0;
          choice.default = true;
          choice.name = 'Canary Release'
          choice.description = 'A canary - release continuous delivery pipeline strategy.';
          break;
        }
        case 'canaryreleaseandstage': {
          choice.index = 1;
          choice.name = 'Canary Release and Stage'
          choice.description = 'A canary - stage - release continuous delivery pipeline strategy.';
          break;
        }
        case 'canaryreleasestageandapprovepromote': {
          choice.index = 2;
          choice.name = 'Canary Release and Stage with Approvals'
          choice.description = 'A canary - stage - release - approval - promote continuous delivery pipeline strategy.';
          break;
        }
        default:{
          break;
        }
      }
    }
    // set the default for the first non validation step
    if( this.isFirstNonValidationStep(context,execution)===true ) {
      this.setFieldDefaults( field );
    }
    else {
      this.setFieldSelection( field );
    }
    this.sortFieldOptionsByIndex(field);
  }

  private augmentStackChoices( field:IField ,context:string, execution: IAppGeneratorPair ) {
      field.display.label = 'Technology Stack';
      for( let choice of <Array<IFieldChoice>>field.display.choices ) {
        switch(choice.id.toLowerCase()){
          case 'configmaps - wildfly swarm':{
            choice.index = 10;
            choice.name = 'WildFly Swarm - ConfigMap'
            choice.description = 'Adds externalised environment configuration to WildFly Swarm - Basic';
            break;
          }
          case 'http api - wildfly swarm':{
            choice.index = 8;
            choice.name = 'WildFly Swarm - Basic';
            choice.description = 'Standalone Java EE application that exposes a simple HTTP endpoint';
            break;
          }
          case 'http crud - wildfly swarm':{
            choice.index = 9;
            choice.name = 'WildFly Swarm - CRUD';
            choice.description = 'Adds Create, Update and Delete to WildFly Swarm - Basic';
            break;
          }
          case 'health checks - wildfly swarm':{
            choice.index = 11;
            choice.name = 'WildFly Swarm - Health Check';
            choice.description = 'Adds health checks to WildFly Swarm - Basic';
            break;
          }
          case 'spring boot - crud':{
            choice.index = 5;
            choice.name = 'Spring Boot - CRUD';
            choice.description = 'Adds Create, Update and Delete to Spring Boot - Basic';
            break;
          }
          case 'spring boot - configmap':{
            choice.index = 6;
            choice.name = 'Spring Boot - ConfigMap';
            choice.description = 'Adds externalised environment configuration to Spring Boot - Basic';
            break;
          }
          case 'spring boot - http':{
            choice.index = 4;
            choice.name = 'Spring Boot - Basic';
            choice.description = 'Standalone Spring application that exposes a simple HTTP endpoint';
            break;
          }
          case 'spring boot health check example':{
            choice.index = 7;
            choice.name = 'Spring Boot - Health Check';
            choice.description = 'Adds health checks to Spring Boot - Basic';
            break;
          }
          case 'vert.x - http & config map':{
            choice.index = 3;
            choice.name = 'Vert.x - ConfigMap';
            choice.description = 'Adds externalised environment configuration to Vert.x - Basic';
            break;
          }
          case 'vert.x crud example using jdbc':{
            choice.index = 2;
            choice.name = 'Vert.x - CRUD';
            choice.description = 'Adds Create, Update and Delete to Vert.x - Basic';
            break;
          }
          case 'vert.x http booster':{
            choice.index = 1;
            choice.name = 'Vert.x - Basic';
            choice.default = true
            choice.description = 'Standalone reactive application in Java that exposes a simple HTTP endpoint';
            break;
          }
          default:{
            break;
          }
        }
      }
      // set the default for the first non validation step
      if( this.isFirstNonValidationStep(context,execution)===true ) {
        this.setFieldDefaults( field );
      }
      else {
        this.setFieldSelection( field );
      }
      this.sortFieldOptionsByIndex(field);

  }

  private sortFieldOptionsByIndex(field:IField) {
    field.display.choices = field.display.choices.sort( (c1,c2) => {
      return c1.index - c2.index;
    });
  }

  private setFieldSelection(field:IField) {
    let choice:IFieldChoice = field.display.choices.find( (c)=>c.selected === true );
    if(!choice) {
      choice = field.display.choices.find( (c)=>c.default === true );
    }
    field.value = choice.id;
    field.display.text = choice.name;
    field.display.note = choice.description;

  }

  private setFieldDefaults(field:IField) {
    let choice:IFieldChoice = field.display.choices.find( (c)=>c.default === true );
    field.value = choice.id;
    field.display.text = choice.name;
    field.display.note = choice.description;
    field.display.choices.filter((o) => {
        // set everything to not selected, except for default
        o.selected = false;
        if (o.default === true) {
          o.selected = true;
        }
    })
  }

  public cleanseAppGeneratorRequest(command:IAppGeneratorCommand, input:IForgeInput, field:IField){
      switch(input.name.toLowerCase()) {
          case "named":{
            if( !Array.isArray(input.value) ) {
              let value: string = input.value||'';
              if( value ) {
                // convert to lower case
                value = value.trim().toLowerCase();
                //replace white space with dash
                value = value.replace(/\s+/g,'-');
                // replace underscores with dash
                value = value.replace(/[_]+/g,'-');
                input.value = value;
              }
            }
            break;
          }
          default:{
            break;
          }
      }
  }

  public augmentAppGeneratorResponse(context: string, execution: IAppGeneratorPair) : IAppGeneratorResponse {
    let response = execution.response;
    this.augmentTitle(context,execution);
    let validationFields=this.getValidationCommandFields(context,execution);
    for( let field of response.payload.fields ) {
        if( field.display.message) {
          if(!field.display.valid) {
            field.display.message.description = field.display.message.description.trim();
            if(!field.display.message.description.endsWith('.') && !field.display.message.description.endsWith('!') ){
              field.display.message.description = `${field.display.message.description}.`
            }
            field.display.message.description =`${field.display.message.description} ${field.display.description}`;
          }
        }
        switch(field.name.toLowerCase()){
          case 'gitrepository' : {
            if( this.currentSpace && (this.currentSpace.attributes.name || '' ).length > 0 ) {
              let spaceName = this.currentSpace.attributes.name;
              field.value = spaceName ;
              let namedField = validationFields.find( f => f.name ==='named');
              // handle the scenario when someone chages the name (that is defaulted to the space name) to something else
              // and the expecation that this defaults to the repo name. Do if that changes then default repo name needs to
              // change too !!
              if( namedField &&  (namedField.value||'').toString() !== spaceName ) {
                  field.value= namedField.value
              }
            }
            field.display.label = 'Repository name';
            break;
          }
          case 'version' : {
            field.display.label='Version';
            break;
          }
          case 'type' : {
            field.display.note=field.display.note.replace(/configguration/ig,'configuration');
            field.display.label = 'Technology Stack';
            this.augmentStackChoices( field, context, execution );
            break;
          }
          case 'pipeline' : {
              this.augmentPipelineChoices(field , context, execution);
            break;
          }
          case 'named' : {
            if(this.isFirstNonValidationStep(context,execution) === true ) {
              // for first non validation step set default name to be space name
              if( this.currentSpace && (this.currentSpace.attributes.name || '' ).length > 0 ) {
                let spaceName = this.currentSpace.attributes.name;
                field.value = spaceName ;
              }
            }
            field.display.label = 'Name';
            if( field.display.message) {
              if(!field.display.valid){
                field.display.message.description=field.display.message.description.replace(/project name/ig,'Name');
                field.display.message.description=field.display.message.description.replace(/the repository/ig,'The GitHub repository');
                field.display.message.description=field.display.message.description.replace(/-a-z0-9/ig,' dashes, letters, numbers ');
              }
            }
            if( field.display.note ) {
              field.display.note=field.display.note.replace(/Downloadable project zip and/ig,'');
              field.display.note=field.display.note.replace(/project name/ig,'name');
              field.display.note=field.display.note.replace(/are based/ig,'is based');
              field.display.note=field.display.note.replace(/application/ig,'Application');
              field.display.note=field.display.note.replace(/application jar is/ig,'Application generated assets are');

            }


            break;
          }
          default:{
            break;
          }
        }
    }
    return response;
  }


  private log: ILoggerDelegate = () => {};


}
