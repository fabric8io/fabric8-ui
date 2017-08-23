import {
  ViewEncapsulation, Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild,
  Host, Output, EventEmitter} from '@angular/core';
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { Fabric8AppGeneratorClient } from '../../services/fabric8-app-generator.client';
import { WizardComponent, WizardConfig, WizardEvent } from 'patternfly-ng';
import { SpaceWizardComponent } from '../../space-wizard.component';

@Component({
  host: {
   'class': 'wizard-step'
  },
  // ensure that dynamically added html message get styles applied
  encapsulation: ViewEncapsulation.None,

  selector: 'forge-app-generator',
  templateUrl: './forge-app-generator.component.html',
  styleUrls: [ './forge-app-generator.component.less' ],
  providers: [
    Fabric8AppGeneratorClient.factoryProvider
  ]
})
export class ForgeAppGeneratorComponent implements OnInit, OnDestroy {
  @ViewChild('wizard') wizard: WizardComponent;
  // Wizard
  wizardConfig: WizardConfig;
  spaceWizard: SpaceWizardComponent;

  // keep track of the number of instances
  static instanceCount: number = 1;

  @Input() title: string = 'Forge Wizard'; // default title
  @Input() forgeCommandName: string = 'none';
  @Output('onCancel') onCancel = new EventEmitter();

  constructor(
    public appGenerator: Fabric8AppGeneratorClient,
    loggerFactory: LoggerFactory,
    @Host() spaceWizard: SpaceWizardComponent) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, ForgeAppGeneratorComponent.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.spaceWizard = spaceWizard;
    this.log(`New instance ...`);
  }

  /**
   * All inputs are bound and values assigned, but the 'workflow' get a new instance every time the parents host dialog
   * is opened.
   */
  ngOnInit() {
    this.log(`ngOnInit ...`);
    this.appGenerator.commandName = this.forgeCommandName;
    // init Forge flow
    this.appGenerator.begin();
    ///// Wizard
    this.wizardConfig = {
      title: this.title,
      hidePreviousButton: true, // TODO wizard: wait for merged and released https://github.com/patternfly/patternfly-ng/pull/112
      hideIndicators: true, // TODO wizard: remove custom AppGeneratorStepViewComponent to reuse patterfly wizard step
    } as WizardConfig;
  }

  stepChanged($event: WizardEvent): void {
    // this.onStepChange.emit({
    //   index: index,
    //   step: step
    // } as WizardEvent);

    // TODO wizard: check if next enabled
    // if (this.appGenerator.state.currentStep != 0 && this.appGenerator.state.canMoveToNextStep == false) {
    //    this.wizard.steps[$event.index].nextEnabled = false;
    // }
  }
  nextClicked($event: WizardEvent): void {
    // Check last step
    if (this.appGenerator.state.currentStep == 2) { //this.appGenerator.state.steps.length - 1 /*last*/) { // TODO wizard: test with https://issues.jboss.org/browse/FORGE-2757
      this.wizard.config.nextTitle = "Finish";
      this.appGenerator.gotoNextStep();
    } else if (this.appGenerator.state.currentStep == 3) { // TODO wizard: be able to have both next and finish button in patternfly wizard
      if (this.wizard.config.nextTitle == "Finish") {
        this.appGenerator.finish();
        this.wizard.config.nextTitle = "Ok"
      } else { // once finish is done, go back to this step for acknoledgement
        if (this.appGenerator.hasErrorMessage) {
          this.appGenerator.acknowledgeErrorMessage();
        } else {
          this.appGenerator.acknowledgeSuccessMessage();
        }
        this.cancel(); // close modal
        }
    } else {
      this.appGenerator.gotoNextStep();
    }
  }

  ngOnDestroy() {
    this.log(`ngOnDestroy ...`);
  }

  cancel() {
    console.log('cancel from ForgeAppGenerator');
    this.spaceWizard.finish();
    this.onCancel.emit({}); // TODO send forge wizard step
  }
  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => {};

}
