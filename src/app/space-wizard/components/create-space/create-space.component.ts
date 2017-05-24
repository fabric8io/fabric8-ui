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

import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { IWorkflow } from '../../models/workflow';
import { AppGeneratorConfiguratorService } from '../../services/app-generator.service';

@Component({
  selector: 'create-space',
  templateUrl: './create-space.component.html',
  styleUrls: ['./create-space.component.scss'],
  providers: [SpaceService]
})
export class CreateSpaceComponent implements OnInit {

  static instanceCount: number = 1;


  get configurator(): AppGeneratorConfiguratorService {
     return this._configuratorService;
  }

  @Input() workflow: IWorkflow = null;

  constructor(
    private router: Router,
    public dummy: DummyService,
    private spaceService: SpaceService,
    private notifications: Notifications,
    private userService: UserService,
    private spaceNamespaceService: SpaceNamespaceService,
    private spaceNamePipe: SpaceNamePipe,
    private _configuratorService: AppGeneratorConfiguratorService,
    private spacesService: SpacesService,
    loggerFactory: LoggerFactory
  ) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, CreateSpaceComponent.instanceCount++);
    if (logger) {
      this.log = logger;
    }
    this.log(`New instance ...`);

  }

  ngOnInit() {
    this.log(`ngInit ...`);
  }

  /*
   * Creates a persistent collaboration space
   * by invoking the spaceService
   */
  createSpace() {
    this.log(`createSpace ...`);
    let space = this.configurator.currentSpace;
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
            this.router.navigate([createdSpace.relationalData.creator.attributes.username,
            createdSpace.attributes.name]);
            this.workflow.cancel();
          });
        this.workflow.gotoNextStep();
      },
      err => {
        console.log('Error creating space', err);
        this.notifications.message({
          message: `Failed to create "${space.name}"`,
          type: NotificationType.DANGER
        } as Notification);
        this.workflow.cancel();
      });
  }

  /**
   * used to add a log entry to the logger
   * The default one shown here does nothing.
   */
  log: ILoggerDelegate = () => { };

}

