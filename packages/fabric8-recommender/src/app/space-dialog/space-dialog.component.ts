import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-login-client';

import { DummyService } from '../shared/dummy.service';
import { Space, SpaceAttributes } from '../models/space';
import { ProcessTemplate } from '../models/process-template';
import { SpaceService } from '../profile/spaces/space.service';



@Component({
  selector: 'space-dialog',
  templateUrl: './space-dialog.component.html',
  styleUrls: ['./space-dialog.component.scss'],
  providers: [SpaceService]
})
export class SpaceDialogComponent {

  newSpace: Space;

  constructor(
    private router: Router,
    public dummy: DummyService,
    private broadcaster: Broadcaster,
    private spaceService: SpaceService) {
      this.resetNewSpace();
  }

  createSpace() {
    console.log(this.newSpace);
    // TODO: Once we have dynamic routing, fix this
    this.newSpace.path = '/pmuir/BalloonPopGame';
    this.newSpace.description = this.newSpace.name;
    this.newSpace.attributes = new SpaceAttributes();
    this.newSpace.attributes.name = this.newSpace.name;
    this.newSpace.type = 'spaces';
    this.spaceService.create(this.newSpace);
    this.dummy.spaces.push(this.newSpace);
    this.broadcaster.broadcast('save', 1);
    this.router.navigate([this.newSpace.path]);
    this.resetNewSpace();
  }

  private resetNewSpace(): void {
    this.newSpace = {} as Space;
    this.newSpace.process = this.dummy.processTemplates[0];
    this.newSpace.privateSpace = false;
  }

}
