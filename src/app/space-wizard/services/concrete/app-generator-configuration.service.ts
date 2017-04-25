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

  private augmentTitle(context: string, appGeneratorResponse: IAppGeneratorResponse) {
    let title = appGeneratorResponse.payload.state.title || '';
    switch( title.toLowerCase() ) {
      case 'io.fabric8.forge.generator.github.githubrepostep': {
        appGeneratorResponse.payload.state.title = 'GitHub repository information';
        break;
      }
      case 'fabric8: new project': {
        appGeneratorResponse.payload.state.title = 'Quickstart';
        break;
      }
      case 'launchpad: new project': {
        appGeneratorResponse.payload.state.title = 'Quickstart';
        break;
      }
      case 'obsidian: configure pipeline': {
        appGeneratorResponse.payload.state.title = 'Select a build pipeline ... ';
        break;
      }
      case 'io.fabric8.forge.generator.kubernetes.createbuildconfigstep': {
        appGeneratorResponse.payload.state.title = 'Select the pipeline build options ... ';
        break;
      }
      default: {
        break;
      }
    }
  }

  private getValidationCommandFields( context: string, appGeneratorResponse: IAppGeneratorResponse ) : IFieldCollection {
    let validationFields=[];
    if( appGeneratorResponse.context
        && appGeneratorResponse.context.validationCommand
        && appGeneratorResponse.context.validationCommand.parameters
        && appGeneratorResponse.context.validationCommand.parameters.fields ) {
      validationFields=appGeneratorResponse.context.validationCommand.parameters.fields
    }
    return validationFields
  }

  private augmentStackChoices( field:IField ) {
      field.display.note=field.display.note.replace(/configguration/ig,'configuration');
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
            choice.description = 'Standalone reactive application in Java that exposes a simple HTTP endpoint';
            break;
          }
          default:{
            break;
          }
        }
      }
      field.display.choices=field.display.choices.sort( (c1,c2) => {
        return c1.index - c2.index
      })
      let selected = field.display.choices.find(c=>c.selected);
      if(selected){
        field.display.text=selected.name;
      }
      else {
        if(field.display.choices.length > 0){
          field.display.text=field.display.choices[0].name;
        }
      }

  }

  public augmentGeneratorResponse(context: string, appGeneratorResponse: IAppGeneratorResponse) : IAppGeneratorResponse {

    this.augmentTitle(context,appGeneratorResponse);
    let validationFields=this.getValidationCommandFields(context,appGeneratorResponse);
    for( let field of appGeneratorResponse.payload.fields ) {
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
              this.augmentStackChoices(field);
            break;
          }
          case 'named' : {
            if( this.currentSpace && (this.currentSpace.attributes.name || '' ).length > 0 ) {
              let spaceName = this.currentSpace.attributes.name;
              field.value = spaceName ;
              field.value = spaceName ;
            }
            field.display.label = 'Name';
            if( field.display.note ){
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
    return appGeneratorResponse;
  }


  private log: ILoggerDelegate = () => {};


}
