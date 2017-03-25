import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-base';

import { ProfileService } from './../../profile/profile.service';

@Component({
  selector: 'alm-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private router: Router,
    public profile: ProfileService,
    private broadcaster: Broadcaster
  ) {
  }

  ngOnInit() {
  }

  save() {
    this.profile.save().subscribe(val => console.log('Profile update'));
  }

}
