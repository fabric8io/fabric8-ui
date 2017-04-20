import { Injectable } from '@angular/core';

import { ContextService } from '../../../shared/context.service'

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
import { SpaceConfigurator } from '../../models/codebase';

@Injectable()
export class FieldLookupService {

  static instanceCount: number = 1;

  public configurator:SpaceConfigurator = SpaceConfigurator.default();


  constructor(loggerFactory: LoggerFactory, private context:ContextService){

    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, FieldLookupService.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance...`);

  }

  public UpdateFields(context: string, appGeneratorResponse: IAppGeneratorResponse) : IAppGeneratorResponse {

    this.context.current.subscribe(ctx=>{
      let space= ctx.space;
      this.log(`the current space is ${space.name}`);
    })

    let title=appGeneratorResponse.payload.state.title || '';
    switch( title.toLowerCase() ) {
      case 'io.fabric8.forge.generator.github.githubrepostep': {
        appGeneratorResponse.payload.state.title = 'GitHub repository information';
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

      }
      default: {
        break;
      }

    }

    for( let field of appGeneratorResponse.payload.fields ) {
        switch(field.name.toLowerCase()){
          case 'gitrepository' : {
            if( this.configurator
              && this.configurator.space
              && this.configurator.space.attributes
              && (this.configurator.space.attributes.name || '' ).length > 0 ) {
              let spaceName = this.configurator.space.attributes.name;
              field.value = spaceName ;
              this.log(`Updating ${field.name} field to space name = '${spaceName}'  ...`);
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
            break;
          }
          case 'named' : {
            if( this.configurator
              && this.configurator.space
              && this.configurator.space.attributes
              && (this.configurator.space.attributes.name || '' ).length > 0 ) {
              let spaceName = this.configurator.space.attributes.name;
              field.value = spaceName ;
              this.log(`Updating ${field.name} field to space name = '${spaceName}'  ...`);
            }
            field.display.label = 'GitHub repository name';
            if( field.display.note ){
              field.display.note=field.display.note.replace(/Downloadable project zip and/ig,'');
              field.display.note=field.display.note.replace(/project name/ig,'repository name');
              field.display.note=field.display.note.replace(/are based/ig,'is based');
              field.display.note=field.display.note.replace(/application/ig,'Application');

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
