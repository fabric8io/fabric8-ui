import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-base';
import { User, UserService } from 'ngx-login-client';
import { Team, Space, Contexts } from 'ngx-fabric8-wit';

import { DummyService } from './../shared/dummy.service';

@Component({
  selector: 'team-membership-dialog',
  templateUrl: './team-membership-dialog.component.html',
  styleUrls: ['./team-membership-dialog.component.scss']
})
export class TeamMembershipDialogComponent implements OnInit{

  public searchString: string;
  public space: Space;

  constructor(
    public dummy: DummyService,
    private context: Contexts,
    private broadcaster: Broadcaster,
    private userService: UserService

  ) { }

  ngOnInit() {
    this.context.current.subscribe(val => this.space = val.space);
  }

  get team(): Team {
    return this.space ? this.space.defaultTeam : null;
  }

  remove(remove: User) {
    let res: User[] = new Array<User>();
    for (let u of this.team.members) {
      if (u !== remove) {
        res.push(u);
      }
    }
    this.team.members = res;
    this.broadcaster.broadcast('save', 1);
  }

  add() {
    this.userService
    .getUserByUsername(this.searchString)
    .subscribe(user => {
      // TODO Hacky check to make sure we don't dupe members
      for (let u of this.team.members) {
        if (u === user) {
          // TODO make this a form error
          console.log(this.searchString + ' is already part of the team');
          return;
        }
      }
      this.team.members.push(user);
      this.broadcaster.broadcast('save', 1);
    });
    // TODO Add user not found
  }
}
