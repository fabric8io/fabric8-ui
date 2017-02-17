import { Observable } from 'rxjs/Observable';
import { ProfileService } from './../../profile/profile.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface NotificationMethod {
  value: string;
  display: string;
  active?: boolean;
}

@Component({
  selector: 'alm-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {



  readonly NOTIFICATION_METHODS: NotificationMethod[] = [
    {
      value: 'email',
      display: 'Email'
    }, {
      value: 'web',
      display: 'Web'
    }];

  notificationMethods: NotificationMethod[];

  constructor(
    private router: Router,
    public profile: ProfileService
  ) {
  }

  ngOnInit() {
    this.notificationMethods = JSON.parse(JSON.stringify(this.NOTIFICATION_METHODS));
    for (let m of this.notificationMethods) {
      for (let n of this.profile.current.notificationMethods) {
        if (m.value === n) {
          m.active = true;
        }
      }
    }
  }

  save() {
    this.profile.current.notificationMethods = [];
    this.notificationMethods.map(m => {
      if (m.active) {
        this.profile.current.notificationMethods.push(m.value);
      }
    });
    this.profile.save();
  }

}
