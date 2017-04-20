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

  public updateGeneratorResponse(context: string, appGeneratorResponse: IAppGeneratorResponse) : IAppGeneratorResponse {


    let title=appGeneratorResponse.payload.state.title || '';
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

      }
      default: {
        break;
      }

    }
    let validationFields=[];
    if( appGeneratorResponse.context
        && appGeneratorResponse.context.validationCommand
        && appGeneratorResponse.context.validationCommand.parameters
        && appGeneratorResponse.context.validationCommand.parameters.fields ) {
      validationFields=appGeneratorResponse.context.validationCommand.parameters.fields
    }
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
