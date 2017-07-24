import { Profile } from 'ngx-login-client';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-base';

import { ProfileService } from './../../profile/profile.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {

  private _profile: Profile;

  constructor(
    private router: Router,
    public profileService: ProfileService,
    private broadcaster: Broadcaster
  ) {
  }

  ngOnInit() {
    this.profileService.current.subscribe(profile => this._profile = profile);
  }

  save() {
    this.profileService.save(this._profile).subscribe(val => console.log('Profile update'));
  }

  get profile(): Profile {
    return this._profile;
  }

}
