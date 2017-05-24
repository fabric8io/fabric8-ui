import { Injectable } from '@angular/core';

import { ContextService } from '../../../shared/context.service';
import {
  Space,
  Context,
  SpaceAttributes
} from 'ngx-fabric8-wit';

import {
  FieldWidgetClassificationOptions,
  IAppGeneratorCommand,
  IAppGeneratorResponse,
  IAppGeneratorPair,
  IField,
  IFieldCollection,
  IFieldChoice
} from '../contracts/app-generator-service';
/** dependencies */
import {
  IForgeInput,
  ForgeCommands
} from '../forge.service';

import { ILoggerDelegate, LoggerFactory } from '../../common/logger';


@Injectable()
export class AppGeneratorConfiguratorService {

  static instanceCount: number = 1;

  public currentSpace: Space ;

  /**
   * Helps to specify wizard step names to prevent typos
   */

  public workflowSteps = {
    createSpace: 'space-step',
    forgePanel: 'forge-step',
    forgeQuickStart: 'forge-quick-start-step',
    forgeStarter: 'forge-starter-step',
    forgeImportGit: 'forge-import-git-step'
  };

  public forgeCommands = {
    forgeQuickStart: ForgeCommands.forgeQuickStart,
    forgeStarter: ForgeCommands.forgeStarter,
    forgeImportGit: ForgeCommands.forgeImportGit
  };


  public resetSpace(): Space {
      let space = {} as Space;
      space.name = '';
      space.path = '';
      space.attributes = new SpaceAttributes();
      space.attributes.name = space.name;
      space.type = 'spaces';
      space.privateSpace = false;
      space.process = { name: '', description: ''};
      space.relationships = {
        areas: {
          links: {
            related: ''
          }
        },
        iterations: {
          links: {
            related: ''
          }
        },
        ['owned-by']: {
          data: {
            id: '',
            type: 'identities'
          }
        }
      };
     this.currentSpace = space;
     return space;
  }

  constructor(loggerFactory: LoggerFactory, private context: ContextService) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name,
                                                    AppGeneratorConfiguratorService.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance...`);
    this.context.current.subscribe( (ctx: Context) => {
      if (ctx.space) {
        this.currentSpace = ctx.space;
        this.log(`the current space is updated to ${this.currentSpace.attributes.name}`);
      }
    });
    this.resetSpace();
  }

  // appends fields that are needed but may only be entered at a later stage in the wizard
  public appendAppGeneratorRequestMissingFields(command: IAppGeneratorCommand){
    if ( command.parameters && command.parameters.data && command.parameters.data.inputs ) {
        let inputs: Array<IForgeInput> = command.parameters.data.inputs||[];

        let field =inputs.find(i => i.name.toLowerCase() === 'labelspace')
        if( !field ) {
          inputs.push(<IForgeInput>{name:'labelSpace',value:this.currentSpace.attributes.name});
        }
        else {
          if( !field.value ) {
            field.value=this.currentSpace.attributes.name;
          }
        }
    }

  }
  public scrubAppGeneratorRequest(command: IAppGeneratorCommand, input: IForgeInput, field: IField) {
    switch (input.name.toLowerCase()) {
      case 'named':
      case 'gitrepository': {
        if ( !Array.isArray(input.value) ) {
          let value: string = input.value || '';
          if ( value ) {
            // convert to lower case
            value = value.trim().toLowerCase();
            // replace white space with dash
            value = value.replace(/\s+/g, '-');
            // replace underscores with dash
            value = value.replace(/[_]+/g, '-');
            input.value = value;
          }
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  public scrubAppGeneratorResponse(context: string, execution: IAppGeneratorPair): IAppGeneratorResponse {
    let response = execution.response;
    this.augmentTitle(context, execution);
    let validationFields = this.getValidationCommandFields(context, execution);
    for ( let field of response.payload.fields ) {
      // update validation messages to be more descriptive
      if ( field.display.message) {
        if (!field.display.valid) {
          field.display.message.description = field.display.message.description.trim();
          if (!field.display.message.description.endsWith('.') && !field.display.message.description.endsWith('!') ) {
            field.display.message.description = `${field.display.message.description}.`;
          }
          field.display.message.description = `${field.display.message.description} ${field.display.description}`;
        }
      }
      switch (field.name.toLowerCase()) {
        case 'kubernetesspace': {
          field.display.label = 'Kubernetes Space';
          field.display.enabled = false;

          break;
        }
        case 'labelspace': {
          field.display.label = 'Kubernetes Label Space';
          field.display.enabled = false;
          // set label space to the current space by default
          if ( this.currentSpace && (this.currentSpace.attributes.name || '' ).length > 0 ) {
            let spaceName = this.currentSpace.attributes.name;
            field.value = spaceName ;
            field.display.text = spaceName;
          }
          break;
        }
        case 'jenkinsspace': {
          field.display.enabled = false;
          break;
        }
        case 'triggerbuild': {
          field.display.enabled = true;
          break;
        }
        case 'addciwebhooks': {
          field.display.enabled = true;
          field.display.label = 'Add continuous integration web hooks';
          break;
        }
        case 'gitrepository' : {
          field.display.label = 'GitHub repository name';
          break;
        }
        case 'version' : {
          field.display.label = 'Version';
          break;
        }
        case 'type' : {
          field.display.note = field.display.note.replace(/configguration/ig, 'configuration');
          field.display.label = 'Technology Stack';
          this.augmentStackChoices( field, context, execution );
          break;
        }
        case 'pipeline' : {
          field.display.showLabel = false;
          field.display.note = null;
          field.display.inputType = FieldWidgetClassificationOptions.SingleSelectionList;
          this.augmentPipelineChoices(field , context, execution);
          break;
        }
        case 'named' : {
          if (this.isFirstNonValidationStep(context, execution) === true ) {
            // for first non validation step set default name to be space name
            if ( this.currentSpace && (this.currentSpace.attributes.name || '' ).length > 0 ) {
              let spaceName = this.currentSpace.attributes.name;
              field.value = spaceName ;
            }
          }
          field.display.label = 'Name';
          if ( field.display.message) {
            if (!field.display.valid) {
              field.display.message.description = field.display.message.description.replace(/project name/ig, 'Name');
              field.display.message.description = field.display.message.description.replace(/the repository/ig, 'The GitHub repository');
              field.display.message.description = field.display.message.description.replace(/-a-z0-9/ig, ' dashes, letters, numbers ');
            }
          }
          if ( field.display.note ) {
            field.display.note = field.display.note.replace(/Downloadable project zip and/ig, '');
            field.display.note = field.display.note.replace(/project name/ig, 'name');
            field.display.note = field.display.note.replace(/are based/ig, 'is based');
            field.display.note = field.display.note.replace(/application/ig, 'Application');
            field.display.note = field.display.note.replace(/application jar is/ig, 'Application generated assets are');

          }


          break;
        }
        default: {
          break;
        }
      }
    }
    return response;
  }


  private augmentTitle(context: string, execution: IAppGeneratorPair) {
    let response = execution.response;
    let title = response.payload.state.title || '';
    switch ( title.toLowerCase() ) {
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
      case 'io.fabric8.forge.generator.github.githubimportpickrepositoriesstep': {
        response.payload.state.title = 'Select the GitHub repository that you wish to import ...';
        break;
      }
      default: {
        break;
      }
    }
  }

  private getValidationCommandFields( context: string, execution: IAppGeneratorPair ): IFieldCollection {
    let response = execution.response;
    let validationFields = [];
    if ( response.context
        && response.context.validationCommand
        && response.context.validationCommand.parameters
        && response.context.validationCommand.parameters.fields ) {
      validationFields = response.context.validationCommand.parameters.fields;
    }
    return validationFields;
  }

  private has(obj, keys): boolean {
    let next = keys.shift();
    let tmp = false;
    if (obj.hasOwnProperty(next)) {
      tmp = true;
      if ( keys.length > 0 ) {
        tmp = this.has(obj[next], keys);
      }
    }
    // let tmp= obj[next] && (! keys.length || this.has(obj[next], keys));
    return tmp;
  }

  private isFirstNonValidationStep(context: string, execution: IAppGeneratorPair): boolean {
     let hasProperty = this.has(execution, ['request', 'command', 'parameters', 'pipeline', 'step', 'index']);
     if ( hasProperty && execution.request.command.parameters.pipeline.step.name !== 'validate' ) {
        return execution.request.command.parameters.pipeline.step.index === 0;
     }
     return false;
  }

  private augmentPipelineChoices( field: IField, context: string, execution: IAppGeneratorPair ) {
    // augment display properties
    let source = field.source();
    let index: number = 0;
    let defaultIndex = 0;
    for ( let choice of <Array<IFieldChoice>>field.display.choices ) {
      choice.isDefault = false;
      choice.hasIcon = false;
      choice.view = 'pipelineView';
      let choiceSource = source.valueChoices.find(vc => vc.id === choice.id) || { environments: [], stages: [], color: 'success' , icon: 'fa-check-circle'};
      let determineColor = (value: string): string => {
        let found = (value || '').toLowerCase().includes('approve');
        if (found) {
          return 'warning';
        }
        return 'success';
      };
      let determineIcon = (value: string): string => {
        let found = (value || '').toLowerCase().includes('approve');
        if (found) {
          return 'fa-pause-circle';
        }
        return 'fa-check-circle';
      };
      let buildStages = (value): Array<string> => {
        let stages = [];
        let n: number = 0;
        for (let s of value.stages){
          let stage = {
            name: s,
            index: n,
            icon: determineIcon(s),
            color: determineColor(s)
          };
          n++;
          stages.push(stage);

        }
        return stages;
      };
      choice.model = {
        environments: choiceSource.environments || [],
        stages: buildStages(choiceSource)
      };

      choice.description = choiceSource.descriptionMarkdown;
      choice.description = choice.description.replace(/\n\n/g, '\n');
      choice.index = index ;
      choice.name = choice.id;
      choice.isDefault = index === defaultIndex;
      choice.verticalLayout = true;
      // suppress note
      choice.note = null;
      index ++;
    }
    // set the default for the first non validation step
    if ( this.isFirstNonValidationStep(context, execution) === true ) {
      this.setFieldDefaults( field );
    } else {
      this.setFieldSelection( field );
    }
    this.sortFieldOptionsByIndex(field);
    // suppress field note
    field.display.note = null;
  }

  private augmentStackChoices( field: IField , context: string, execution: IAppGeneratorPair ) {
      field.display.label = 'Technology Stack';
      for ( let choice of <Array<IFieldChoice>>field.display.choices ) {
        choice.hasIcon = false;
        switch ( choice.id.toLowerCase() ) {
          case 'configmaps - wildfly swarm': {
            choice.index = 10;
            // choice.hasIcon=true;
            choice.icon = 'icon-stack icon-stack-wildfly';
            choice.name = 'WildFly Swarm - ConfigMap';
            choice.description = 'Adds externalised environment configuration to WildFly Swarm - Basic';
            break;
          }
          case 'http api - wildfly swarm': {
            choice.index = 8;
            // choice.hasIcon=true;
            choice.icon = 'icon-stack icon-stack-wildfly';
            choice.name = 'WildFly Swarm - Basic';
            choice.description = 'Standalone Java EE application that exposes a simple HTTP endpoint';
            break;
          }
          case 'http crud - wildfly swarm': {
            choice.index = 9;
            // choice.hasIcon=true;
            choice.icon = 'icon-stack  icon-stack-wildfly';
            choice.name = 'WildFly Swarm - CRUD';
            choice.description = 'Adds Create, Update and Delete to WildFly Swarm - Basic';
            break;
          }
          case 'health checks - wildfly swarm': {
            choice.index = 11;
            // choice.hasIcon=true;
            choice.icon = 'icon-stack icon-stack-wildfly';
            choice.name = 'WildFly Swarm - Health Check';
            choice.description = 'Adds health checks to WildFly Swarm - Basic';
            break;
          }
          case 'spring boot - crud': {
            choice.index = 5;
            // choice.hasIcon=true;
            choice.icon = 'icon-stack icon-stack-spring';
            choice.name = 'Spring Boot - CRUD';
            choice.description = 'Adds Create, Update and Delete to Spring Boot - Basic';
            break;
          }
          case 'spring boot - configmap': {
            choice.index = 6;
            // choice.hasIcon=true;
            choice.icon = 'icon-stack icon-stack-spring';
            choice.name = 'Spring Boot - ConfigMap';
            choice.description = 'Adds externalised environment configuration to Spring Boot - Basic';
            break;
          }
          case 'spring boot - http': {
            choice.index = 4;
            // choice.hasIcon=true;
            choice.icon = 'icon-stack icon-stack-spring';
            choice.name = 'Spring Boot - Basic';
            choice.description = 'Standalone Spring application that exposes a simple HTTP endpoint';
            break;
          }
          case 'spring boot health check example': {
            choice.index = 7;
            // choice.hasIcon=true;
            choice.icon = 'icon-stack icon-stack-spring';
            choice.name = 'Spring Boot - Health Check';
            choice.description = 'Adds health checks to Spring Boot - Basic';
            break;
          }
          case 'vert.x - http & config map': {
            choice.index = 3;
            // choice.hasIcon=true;
            choice.icon = 'icon-stack icon-stack-vertx';
            choice.name = 'Vert.x - ConfigMap';
            choice.description = 'Adds externalised environment configuration to Vert.x - Basic';
            break;
          }
          case 'vert.x crud example using jdbc': {
            choice.index = 2;
            // choice.hasIcon=true;
            choice.icon = 'icon-stack icon-stack-vertx';
            choice.name = 'Vert.x - CRUD';
            choice.description = 'Adds Create, Update and Delete to Vert.x - Basic';
            break;
          }
          case 'vert.x http booster': {
            choice.index = 1;
            // choice.hasIcon=true;
            // choice.verticalLayout=true;
            choice.icon = 'icon-stack icon-stack-vertx';
            choice.name = 'Vert.x - Basic';
            choice.isDefault = true;
            choice.description = 'Standalone reactive application in Java that exposes a simple HTTP endpoint';
            break;
          }
          default: {
            break;
          }
        }
      }
      // set the default for the first non validation step
      if ( this.isFirstNonValidationStep(context, execution) === true ) {
        this.setFieldDefaults( field );
      } else {
        this.setFieldSelection( field );
      }
      this.sortFieldOptionsByIndex(field);

  }

  private sortFieldOptionsByIndex(field: IField) {
    field.display.choices = field.display.choices.sort( (c1, c2) => {
      return c1.index - c2.index;
    });
  }

  private setFieldSelection(field: IField) {
    let choice: IFieldChoice = field.display.choices.find( (c) => c.selected === true );
    if (!choice) {
      choice = field.display.choices.find( (c) => c.isDefault === true );
    }
    field.value = choice.id;
    field.display.text = choice.name;
    field.display.note = choice.description;

  }

  private setFieldDefaults(field: IField) {
    let choice: IFieldChoice = field.display.choices.find( (c) => c.isDefault === true );
    field.value = choice.id;
    field.display.text = choice.name;
    field.display.note = choice.description;
    field.display.choices.filter((o) => {
        // set everything to not selected, except for default
        o.selected = false;
        if (o.isDefault === true) {
          o.selected = true;
        }
    });
  }


  private log: ILoggerDelegate = () => {};


}
