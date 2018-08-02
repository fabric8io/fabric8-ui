import {
  Component,
  ErrorHandler,
  Input,
  OnInit
} from '@angular/core';
import {
  Observable,
  ReplaySubject,
  Subject
} from 'rxjs';

import {
  Broadcaster,
  Logger
} from 'ngx-base';
import {
  Space,
  Spaces,
  SpaceService
} from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';

@Component({
  selector: 'fabric8-recent-spaces-widget',
  templateUrl: './recent-spaces-widget.component.html'
})
export class RecentSpacesWidget implements OnInit {

  @Input() cardSizeClass: string;
  @Input() cardBodySizeClass: string;

  readonly userHasSpaces: Subject<boolean> = new ReplaySubject<boolean>(1);
  readonly recentSpaces: Observable<Space[]>;
  loading: boolean = false;

  constructor(
    spaces: Spaces,
    private spaceService: SpaceService,
    private userService: UserService,
    private errorHandler: ErrorHandler,
    private broadcaster: Broadcaster,
    private logger: Logger
  ) {
    this.recentSpaces = spaces.recent;
  }

  ngOnInit(): void {
    this.loading = true;
    this.spaceService
      .getSpacesByUser(this.userService.currentLoggedInUser.attributes.username)
      .first()
      .map((spaces: Space[]): boolean => spaces.length > 0)
      .subscribe(
        (userHasSpaces: boolean): void => {
          this.userHasSpaces.next(userHasSpaces);
          this.userHasSpaces.complete();
          this.loading = false;
        },
        (error: any): void => {
          this.logger.error(error);
          this.errorHandler.handleError(error);
          this.loading = false;
        }
      );
  }

  showAddSpaceOverlay(): void {
    this.broadcaster.broadcast('showAddSpaceOverlay', true);
  }

}
