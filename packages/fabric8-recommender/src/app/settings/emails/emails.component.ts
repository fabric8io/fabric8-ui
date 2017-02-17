import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileService } from './../../profile/profile.service';
import { Email } from './../../models/email';

@Component({
  selector: 'alm-settingsOverview',
  templateUrl: 'emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent {

  email: string;
  keepPrivate: boolean;

  constructor(
    private router: Router, public profile: ProfileService) {
  }

  del(del: string): void {
    this.profile.removeEmailFromCurrent(del);
    this.profile.save();
  }

  add() {
    let add: string = this.email
    this.profile.current.emails.push(add);
    this.profile.save();
  }

  makePrimary(primary: string): void {
    this.profile.current.primaryEmail = primary;
  }

  savePreferences(): void {
    this.profile.save();
  }

  updatePrivateEmail(event): void {
    this.profile.current.primaryEmailPrivate = event.target.checked;
    this.profile.save();
  }

}
