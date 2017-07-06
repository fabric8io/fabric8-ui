import { SpacesService } from '../../../shared/spaces.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Notification, NotificationAction, Notifications, NotificationType } from 'ngx-base';
import {
  SpaceService,
  SpaceNamePipe
} from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { DummyService } from '../../../shared/dummy.service';
import { SpaceNamespaceService } from '../../../shared/runtime-console/space-namespace.service';
import { ProcessTemplate } from 'ngx-fabric8-wit';
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { IWorkflow } from '../../models/workflow';
import { AppGeneratorConfiguratorService } from '../../services/app-generator.service';

@Component({
  selector: 'space-creator',
  templateUrl: './space-creator.component.html',
  styleUrls: ['./space-creator.component.less'],
  providers: [SpaceService]
})
export class SpaceCreatorComponent implements OnInit {

  static instanceCount: number = 1;

  @Input() workflow: IWorkflow = null;
  spaceTemplates: ProcessTemplate[];
  selectedTemplate: ProcessTemplate;

  constructor(
    private router: Router,
    public dummy: DummyService,
    private spaceService: SpaceService,
    private notifications: Notifications,
    private userService: UserService,
    private spaceNamespaceService: SpaceNamespaceService,
    private spaceNamePipe: SpaceNamePipe,
    public configurator: AppGeneratorConfiguratorService,
    private spacesService: SpacesService,
    loggerFactory: LoggerFactory
  ) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, SpaceCreatorComponent.instanceCount++);
    if (logger) {
      this.log = logger;
    }
    this.log(`New instance ...`);
    this.spaceTemplates = dummy.processTemplates;
  }

  ngOnInit() {

    this.log(`ngInit ...`);
    const srumTemplates = this.spaceTemplates.filter(template => template.name == "Scenario Driven Planning")
    if (srumTemplates && srumTemplates.length > 0) {
      this.selectedTemplate = srumTemplates[0];
    }
  }

  /*
   * Creates a persistent collaboration space
   * by invoking the spaceService
   */
  createSpace() {
    this.log(`createSpace ...`);
    let space = this.configurator.transientSpace;
    console.log('Creating space', space);
    space.attributes.name = space.name.replace(/ /g, '_');
    this.userService.getUser()
      .switchMap(user => {
        space.relationships['owned-by'].data.id = user.id;
        return this.spaceService.create(space);
      })
      .do(createdSpace => {
        this.spacesService.addRecent.next(createdSpace);
      })
      .switchMap(createdSpace => {
        return this.spaceNamespaceService
          .updateConfigMap(Observable.of(createdSpace))
          .map(() => createdSpace)
          // Ignore any errors coming out here, we've logged and notified them earlier
          .catch(err => Observable.of(createdSpace));
      })
      .subscribe(createdSpace => {
        this.configurator.currentSpace = createdSpace;
        const primaryAction: NotificationAction = {
          name: `Open Space`,
          title: `Open ${this.spaceNamePipe.transform(createdSpace.attributes.name)}`,
          id: 'openSpace'
        };
        this.notifications.message(<Notification>{
          message: `Your new space is created!`,
          type: NotificationType.SUCCESS,
          primaryAction: primaryAction
        })
        .filter(action => action.id === primaryAction.id)
        .subscribe(action => {
          this.router.navigate([createdSpace.relationalData.creator.attributes.username,
          createdSpace.attributes.name]);
          this.workflow.cancel();
        });
        this.workflow.gotoNextStep();
      },
      err => {
        console.log('Error creating space', err);
        this.notifications.message(<Notification>{
          message: `Failed to create "${space.name}"`,
          type: NotificationType.DANGER
        });
        this.workflow.cancel();
      });
  }

  /**
   * used to add a log entry to the logger
   * The default one shown here does nothing.
   */
  log: ILoggerDelegate = () => { };

}
