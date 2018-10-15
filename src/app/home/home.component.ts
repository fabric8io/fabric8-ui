import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Space, SpaceService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { first, map } from 'rxjs/operators';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  loggedInUser: User;
  spacesCount: number = -1;

  constructor(
    private readonly userService: UserService,
    private readonly spaceService: SpaceService
  ) { }

  ngOnInit() {
    this.loggedInUser = this.userService.currentLoggedInUser;
    this.spaceService.getSpacesByUser(this.loggedInUser.attributes.username)
      .pipe(
        first(),
        map((spaces: Space[]): number => spaces.length)
      )
      .subscribe((spacesCount: number): void => {
        this.spacesCount = spacesCount;
      });
  }

}
