import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { ILoggerDelegate, LoggerFactory } from './common/logger';
import { IModalHost } from './models/modal-host';
import { IWorkflow, WorkflowFactory } from './models/workflow';
import { AppGeneratorConfiguratorService } from './services/app-generator.service';

@Component({
  selector: 'space-wizard',
  templateUrl: './space-wizard.component.html',
  styleUrls: ['./space-wizard.component.less']
})
export class SpaceWizardComponent implements OnInit {

  static instanceCount: number = 1;

  @Input() host: IModalHost;

  /*
   * facilitates specifying a specific starting step when opening the host dialog
   */
  public get steps() {
    return this.configurator.workflowSteps;
  }

  private _workflow: IWorkflow = null;
  @Input()
  get workflow(): IWorkflow {
    if (!this._workflow) {
      this._workflow = this.workflowFactory.create();
    }
    return this._workflow;
  }

  set workflow(value: IWorkflow) {
    this._workflow = value;
  }

  constructor(
    private router: Router,
    private workflowFactory: WorkflowFactory,
    loggerFactory: LoggerFactory,
    public configurator: AppGeneratorConfiguratorService
  ) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, SpaceWizardComponent.instanceCount++);
    if (logger) {
      this.log = logger;
    }
    this.log(`New instance ...`);

  }

  ngOnInit() {
    this.log(`ngInit ...`);
    this.configureComponentHost();
  }

  /**
   * Create and initializes a new workflow object.
   */
  createAndInitializeWorkflow(): IWorkflow {
    let component = this;
    return this.workflowFactory.create({
      steps: () => {
        return [
          { name: this.configurator.workflowSteps.spaceCreator, index: 0, nextIndex: 1 },
          { name: this.configurator.workflowSteps.spaceConfigurator, index: 1, nextIndex: 1 },
          { name: this.configurator.workflowSteps.forgeQuickStart, index: 5, nextIndex: 1 },
          { name: this.configurator.workflowSteps.forgeImportGit, index: 7, nextIndex: 1 }
        ];
      },
      firstStep: () => {
        return {
          index: 0
        };
      },
      cancel: (...args) => {
        /*
         * Ensure 'finish' has the correct 'this'.
         * That is why apply is being used.
         */
        component.cancel.apply(component, args);
      },
      finish: (...args) => {
        /*
         * Ensure 'finish' has the correct 'this'.
         * That is why apply is being used.
         */
        component.finish.apply(component, args);
      }
    });
  }

  /**
   * Resets the configurator, space and workflow object
   * into a default empty state.
   */
  reset() {
    this.configurator.resetTransientSpace();
    this.workflow = this.createAndInitializeWorkflow();
  }

  finish() {
    this.log(`finish ...`);
    // navigate to the users space
    this.router.navigate([
      this.configurator.currentSpace.relationalData.creator.attributes.username,
      this.configurator.currentSpace.attributes.name
    ]);
    if (this.host) {
      this.host.close();
    }
  }

  cancel() {
    this.log(`cancel...`);
    // just close the host dialog
    if (this.host) {
      this.host.close();
    }
  }

  /**
   * Configures this component host dialog settings.
   * host is an instance of the modal dialog object
   * cast to IModalHost interface
   */
  configureComponentHost() {

    this.host.closeOnEscape = true;
    this.host.closeOnOutsideClick = false;

    let me = this;

    /**
     * Configure the modal dialog open and close intercept handlers.
     */
    let originalOpenHandler = this.host.open;
    this.host.open = function (...args) {
      me.log(`Opening wizard modal dialog ...`, args);
      me.reset();
      if ( args.length > 0 && typeof args[0] === 'string' ) {
        let step = args[0];
        me.workflow.gotoStep(step);
      }
      /**
       * note: 'this' in this context is not me ( i.e component)
       * ... but an instance of Modal.
       * That is why  => is not being used here
       */
      return originalOpenHandler.apply(this, args);
    };
    let originalCloseHandler = this.host.close;
    this.host.close = function (...args) {
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
  log: ILoggerDelegate = () => { };

}
