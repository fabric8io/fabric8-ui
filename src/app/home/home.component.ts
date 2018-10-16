import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User, UserService } from 'ngx-login-client';
import { first } from 'rxjs/operators';
import { UserSpacesService } from './user-spaces.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  providers: [UserSpacesService]
})
export class HomeComponent implements OnInit {

  loggedInUser: User;
  spacesCount: number = -1;

  constructor(
    private readonly userService: UserService,
    private readonly userSpacesService: UserSpacesService
  ) { }

  ngOnInit() {
    this.loggedInUser = this.userService.currentLoggedInUser;
    this.userSpacesService.getInvolvedSpacesCount()
      .pipe(first())
      .subscribe((spacesCount: number): void => {
        this.spacesCount = spacesCount;
      });
  }

}
