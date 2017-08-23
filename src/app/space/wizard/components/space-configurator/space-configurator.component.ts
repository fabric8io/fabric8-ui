import { Component, Input, OnDestroy, OnInit, Host, Output, EventEmitter } from '@angular/core';
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { AppGeneratorConfiguratorService } from '../../services/app-generator.service';
import { WizardComponent } from "patternfly-ng";
import { SpaceWizardComponent } from '../../space-wizard.component';

@Component({
  selector: 'space-configurator',
  templateUrl: './space-configurator.component.html',
  styleUrls: [ './space-configurator.component.less' ]
})
export class SpaceConfiguratorComponent implements OnInit, OnDestroy {

  // keep track of the number of instances
  static instanceCount: number = 1;

  @Input() wizard: WizardComponent;
  @Output('onCancel') onCancel = new EventEmitter();
  spaceWizard: SpaceWizardComponent;

  constructor(
    @Host() spaceWizard: SpaceWizardComponent,
    public configurator: AppGeneratorConfiguratorService,
    loggerFactory: LoggerFactory) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, SpaceConfiguratorComponent.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.spaceWizard = spaceWizard;
    this.log(`New instance ...`);
  }

  ngOnInit() {
    this.log(`ngOnInit ...`);
  }

  ngOnDestroy() {
    this.log(`ngOnDestroy ...`);
  }
  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => {};

  gotoStep(index: number) {
    this.wizard.goToStep(index, true); // start one of the ForgeAppGenerator wizard
    //this.wizard.config.hideHeader = true; // hide SpaceWizard header to avoid double header
  }

  finish() {
    // emit event to close modal
    this.onCancel.emit({});
    // navigate to dashboard
    this.spaceWizard.finish();
  }
}
