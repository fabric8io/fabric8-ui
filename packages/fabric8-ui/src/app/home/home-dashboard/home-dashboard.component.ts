import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User, UserService } from 'ngx-login-client';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserSpacesService } from '../../shared/user-spaces.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.less'],
  providers: [UserSpacesService],
})
export class HomeDashboardComponent implements OnInit {
  loggedInUser: User;

  spacesCount: number = -1;

  subscriptions: Subscription[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly userSpacesService: UserSpacesService,
  ) {}

  ngOnInit() {
    this.loggedInUser = this.userService.currentLoggedInUser;
    const userSpaceCount = this.userSpacesService
      .getInvolvedSpacesCount()
      .pipe(first())
      .subscribe(
        (spacesCount: number): void => {
          this.spacesCount = spacesCount;
        },
      );
    this.subscriptions.push(userSpaceCount);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
