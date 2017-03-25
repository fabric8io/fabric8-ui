import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { Observable } from 'rxjs';

import { Broadcaster, Notification, NotificationType, NotificationAction, Notifications } from 'ngx-base';
import {
  SpaceService,
  Space,
  ProcessTemplate,
  SpaceAttributes,
  Context,
  Contexts
} from 'ngx-fabric8-wit';
import { User, HttpService, UserService } from 'ngx-login-client';

import { DummyService } from '../shared/dummy.service';
import { Modal } from '../shared-component/modal/modal';

import { LoggerFactory, ILoggerDelegate } from './common/logger';
import { INotifyPropertyChanged } from './core/component'
import { IModalHost } from './models/modal-host';
import { WorkflowFactory, IWorkflow, IWorkflowStep } from './models/workflow';
import { SpaceConfigurator } from './models/codebase';
import {ForgeCommands} from './services/forge.service';

@Component({
  host: {
    'class': 'wizard-container'
  },
  selector: 'space-wizard',
  templateUrl: './space-wizard.component.html',
  styleUrls: ['./space-wizard.component.scss'],
  providers: [SpaceService]

})
export class SpaceWizardComponent implements OnInit {

  static instanceCount: number = 1;

  @Input() host: IModalHost;
  /**
   * used to add a log entry to the logger
   * The default one shown here does nothing.
   */
  log: ILoggerDelegate = () => { };

  /**
   * The configurator stores configuration settings
   * gleaned from the wizard information gathering
   * process.
   */
  configurator: SpaceConfigurator;

  private _workflow: IWorkflow = null;
  @Input()
  get workflow(): IWorkflow {
    if (!this._workflow) {
      this._workflow = this.workflowFactory.create();
    }
    return this._workflow;
  };
  set workflow(value: IWorkflow) {
    this._workflow = value;
  }

  constructor(
    private router: Router,
    public dummy: DummyService,
    private broadcaster: Broadcaster,
    private spaceService: SpaceService,
    private notifications: Notifications,
    private userService: UserService,
    context: Contexts,
    private workflowFactory: WorkflowFactory,
    loggerFactory: LoggerFactory) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, SpaceWizardComponent.instanceCount++);
    if (logger) {
      this.log = logger;
    }
    this.log(`New instance ...`);
  }

  ngOnInit() {
    this.log(`ngInit ...`)
    this.configureComponentHost();
    this.configurator = this.createSpaceConfigurator();
  }
  /**
   * Helps to spacify wizard step names to prevent typos
   * */
  steps={
    space:"space-step",
    forge:"forge-step",
    forgeQuickStart:"forge-quick-start-step",
    forgeStarter:"forge-starter-step",
    quickStart:"proto-quickStart-step",
    stack:"proto-stack-step",
    pipeline:"pipeline-step"

  };
  commands={
    forgeQuickStart:ForgeCommands.forgeQuickStart,
    forgeStarter:ForgeCommands.forgeStarter,
  }
  /**
   * Create and initializes a new workflow object.
   * */
  createAndInitializeWorkflow(): IWorkflow {
    let component = this;
    let workflow = this.workflowFactory.create({
      steps: () => {
        return [
          { name:this.steps.space, index: 0, nextIndex: 1 },
          { name:this.steps.forge, index: 1, nextIndex: 1 },
          { name: this.steps.quickStart, index: 2, nextIndex: 3 },
          { name: this.steps.stack, index: 3, nextIndex: 4 },
          { name: this.steps.pipeline, index: 4, nextIndex: 4 },
          { name: this.steps.forgeQuickStart, index: 5, nextIndex: 1 },
          { name: this.steps.forgeStarter, index: 6, nextIndex: 1 }
        ];
      },
      firstStep: () => {
        return {
          index: 0
        };
      },
      cancel: (...args) => {
        /**
         * Ensure 'finish' has the correct 'this'.
         * That is why apply is being used.
         */
        component.cancel.apply(component, args);
      },
      finish: (...args) => {
        /**
         * Ensure 'finish' has the correct 'this'.
         * That is why apply is being used.
         */
        component.finish.apply(component, args);
      },
    })
    return workflow;
  }

  /**
   * creates and initializes the default space configurator
   * */
  createSpaceConfigurator(): SpaceConfigurator {
    let configurator = new SpaceConfigurator();
    configurator.space = this.createTransientSpace();
    return configurator;
  }

  /**
   * Creates and initializes a default
   * transient collaboration space.
   * */
  createTransientSpace(): Space {
    let space = {} as Space;
    space.name = '';
    space.path = '';
    space.attributes = new SpaceAttributes();
    space.attributes.name = space.name;
    space.type = 'spaces';
    space.privateSpace = false;
    space.process = this.dummy.processTemplates[0];
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
    return space;
  }
  /**
   * Creates a persistent collaboration space
   * by invoking the spaceService
   */
  createSpace() {
    this.log(`createSpace ...`);
    let space = this.configurator.space;
    console.log('Creating space', space);
    space.attributes.name = space.name;
    this.userService.getUser().switchMap(user => {
      space.relationships['owned-by'].data.id = user.id;
      return this.spaceService.create(space);
    })
      .subscribe(createdSpace => {
        this.configurator.space = createdSpace;
        let actionObservable = this.notifications.message({
          message: `Your new space is created!`,
          type: NotificationType.SUCCESS,
          primaryAction: {
            name: `Open Space`,
            title: `Open ${createdSpace.attributes.name}`,
            id: 'openSpace'
          } as NotificationAction
        } as Notification);
        actionObservable
          .filter(action => action.id === 'openSpace')
          .subscribe(action => {
            this.router
              .navigate([createdSpace.relationalData.creator.attributes.username, createdSpace.attributes.name]);
            if (this.host) {
              this.host.close();
              this.reset();
            }
          });
        this.workflow.gotoNextStep();
      },
      err => {
        this.notifications.message({
          message: `Failed to create "${space.name}"`,
          type: NotificationType.DANGER

        } as Notification);
        if (this.host) {
          this.host.close();
          this.reset();
        }
      });
  }
  /**
   * Resets the configurator, space and workflow object
   * into a default empty state.
   */
  reset() {
    this.log(`reset ...`);
    this.configurator = this.createSpaceConfigurator();
    this.workflow = this.createAndInitializeWorkflow();
  }


  finish() {
    this.log(`finish ...`);
    this.router.navigate([
      this.configurator.space.relationalData.creator.attributes.username,
      this.configurator.space.attributes.name
    ]);
    if (this.host) {
      this.host.close();
    }
  }

  cancel() {
    this.log(`cancel...`);
    if (this.host) {
      this.host.close();
    }
  }

  /**
   * Configures this component host dialog settings.
   * */
  configureComponentHost() {

    this.host.closeOnEscape = true;
    this.host.closeOnOutsideClick = false;

    let me = this;

    /**
     * Configure modal open and close intercept handlers.
     * perform initialization and settings adjustments.
     */
    let originalOpenHandler = this.host.open;
    this.host.open = function (...args) {
      me.log(`Opening wizard modal dialog ...`);
      me.reset();
     /**
      * note: 'this' is not me ... but an instance of Modal.
      * That is why  => is not being used here
      */
      return originalOpenHandler.apply(this, args);
    }
    let originalCloseHandler = this.host.close;
    this.host.close = function (...args) {
      me.log(`Closing wizard modal dialog ...`);
     /**
      * note: 'this' is not me ... but an instance of Modal.
      * That is why  => is not being used here
      */
      return originalCloseHandler.apply(this, args);
    }
  }
};
