import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Notification, NotificationAction, Notifications, NotificationType } from 'ngx-base';
import { Space, SpaceAttributes, SpaceService, SpaceNamePipe } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';

import { Observable } from 'rxjs';
import { DummyService } from '../shared/dummy.service';

import { SpaceNamespaceService } from '../shared/runtime-console/space-namespace.service';

import { ILoggerDelegate, LoggerFactory } from './common/logger';
import { SpaceConfigurator } from './models/codebase';
import { IModalHost } from './models/modal-host';
import { IWorkflow, WorkflowFactory } from './models/workflow';
import { ForgeCommands } from './services/forge.service';
import { FieldLookupService } from './services/app-generator.service';

@Component({
  host: {
    'class': 'wizard-container'
  },
  selector: 'space-wizard',
  templateUrl: './space-wizard.component.html',
  styleUrls: [ './space-wizard.component.scss' ],
  providers: [ SpaceService ]
})
export class SpaceWizardComponent implements OnInit {

  static instanceCount: number = 1;

  /**
   * Helps to specify wizard step names to prevent typos
   */
  steps = {
    space: 'space-step',
    forge: 'forge-step',
    forgeQuickStart: 'forge-quick-start-step',
    forgeStarter: 'forge-starter-step',
    forgeImportGit: 'forge-import-git-step'
  };

  commands = {
    forgeQuickStart: ForgeCommands.forgeQuickStart,
    forgeStarter: ForgeCommands.forgeStarter,
    forgeImportGit: ForgeCommands.forgeImportGit
  };

  @Input() host: IModalHost;

  /**
   * The configurator stores configuration settings
   * gleaned from the wizard information gathering
   * process.
   */
  configurator: SpaceConfigurator = SpaceConfigurator.default();

  private _workflow: IWorkflow = null;
  @Input()
  get workflow(): IWorkflow {
    if ( !this._workflow ) {
      this._workflow = this.workflowFactory.create();
    }
    return this._workflow;
  }

  set workflow(value: IWorkflow) {
    this._workflow = value;
  }

  constructor(
    private router: Router,
    public dummy: DummyService,
    private spaceService: SpaceService,
    private notifications: Notifications,
    private userService: UserService,
    private workflowFactory: WorkflowFactory,
    loggerFactory: LoggerFactory,
    private spaceNamespaceService: SpaceNamespaceService,
    private spaceNamePipe: SpaceNamePipe,
    private _fieldLookupService: FieldLookupService) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, SpaceWizardComponent.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance ...`);
  }

  ngOnInit() {
    this.log(`ngInit ...`);
    this.configureComponentHost();
    this._fieldLookupService.configurator = this.configurator;
  }

  /**
   * Create and initializes a new workflow object.
   */
  createAndInitializeWorkflow(): IWorkflow {
    let component = this;
    return this.workflowFactory.create({
      steps: () => {
        return [
          { name: this.steps.space, index: 0, nextIndex: 1 },
          { name: this.steps.forge, index: 1, nextIndex: 1 },
          { name: this.steps.forgeQuickStart, index: 5, nextIndex: 1 },
          { name: this.steps.forgeStarter, index: 6, nextIndex: 1 },
          { name: this.steps.forgeImportGit, index: 7, nextIndex: 1 }
        ];
      },
      firstStep: () => {
        return {
          index: 0
        };
      },
      cancel: (... args) => {
        /**
        * Ensure 'finish' has the correct 'this'.
        * That is why apply is being used.
        */
        component.cancel.apply(component, args);
      },
      finish: (... args) => {
        /**
        * Ensure 'finish' has the correct 'this'.
        * That is why apply is being used.
        */
        component.finish.apply(component, args);
      }
    });
  }


  /**
   * Creates a persistent collaboration space
   * by invoking the spaceService
   */
  createSpace() {
    this.log(`createSpace ...`);
    let space = this.configurator.space;
    console.log('Creating space', space);
    space.attributes.name = space.name.replace(' ', '_');
    this.userService.getUser()
    .switchMap(user => {
      space.relationships[ 'owned-by' ].data.id = user.id;
      return this.spaceService.create(space);
    })
    .switchMap(createdSpace => {
      return this.spaceNamespaceService
      .updateConfigMap(Observable.of(createdSpace))
      .map(() => createdSpace)
      // Ignore any errors coming out here, we've logged and notified them earlier
      .catch(err => Observable.of(createdSpace));
    })
    .subscribe(createdSpace => {
      this.configurator.space = createdSpace;
      this._fieldLookupService.configurator = this.configurator;
      let actionObservable = this.notifications.message({
        message: `Your new space is created!`,
        type: NotificationType.SUCCESS,
        primaryAction: {
          name: `Open Space`,
          title: `Open ${this.spaceNamePipe.transform(createdSpace.attributes.name)}`,
          id: 'openSpace'
        } as NotificationAction
      } as Notification);
      actionObservable
        .filter(action => action.id === 'openSpace')
        .subscribe(action => {
          this.router.navigate([ createdSpace.relationalData.creator.attributes.username,
                                 createdSpace.attributes.name ]);
          if ( this.host ) {
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
        if ( this.host ) {
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
    this.configurator = SpaceConfigurator.default();
    this.workflow = this.createAndInitializeWorkflow();
  }

  finish() {
    this.log(`finish ...`);
    this.router.navigate([
                           this.configurator.space.relationalData.creator.attributes.username,
                           this.configurator.space.attributes.name
                         ]);
    if ( this.host ) {
      this.host.close();
    }
  }

  cancel() {
    this.log(`cancel...`);
    if ( this.host ) {
      this.host.close();
    }
  }

  /**
   * Configures this component host dialog settings.
   */
  configureComponentHost() {

    this.host.closeOnEscape = true;
    this.host.closeOnOutsideClick = false;

    let me = this;

    /**
     * Configure modal open and close intercept handlers.
     * perform initialization and settings adjustments.
     */
    let originalOpenHandler = this.host.open;
    this.host.open = function(... args) {
      me.log(`Opening wizard modal dialog ...`);
      me.reset();
      /**
       * note: 'this' is not me ... but an instance of Modal.
       * That is why  => is not being used here
       */
      return originalOpenHandler.apply(this, args);
    };
    let originalCloseHandler = this.host.close;
    this.host.close = function(... args) {
      me.log(`Closing wizard modal dialog ...`);
      /**
       * note: 'this' is not me ... but an instance of Modal.
       * That is why  => is not being used here
       */
      return originalCloseHandler.apply(this, args);
    };
  }

  /**
   * used to add a log entry to the logger
   * The default one shown here does nothing.
   */
  log: ILoggerDelegate = () => {};

}

