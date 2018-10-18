import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  Observable,
  of,
  Subscription
} from 'rxjs';
import {
  catchError,
  concatMap,
  map
} from 'rxjs/operators';

import {
  CollaboratorService,
  Space
} from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'my-spaces-item',
  styleUrls: ['./my-spaces-item.component.less'],
  templateUrl: './my-spaces-item.component.html'
})
export class MySpacesItemComponent implements OnInit, OnDestroy {

  @Input() space: Space;
  collaboratorCount: string = '-';

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly collaboratorService: CollaboratorService
  ) { }

  ngOnInit(): void {
    this.loadCollaboratorCount();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

  private loadCollaboratorCount(): void {
    this.subscriptions.push(
      this.collaboratorService.getInitialBySpaceId(this.space.id)
        .pipe(
          map((users: User[]): number => users.length),
          concatMap((count: number): Observable<number> => this.loadFurtherCollaborators(count))
        )
      .subscribe((count: number): void => {
        this.collaboratorCount = String(count);
      })
    );
  }

  // TODO: replace these cascading requests with a single request returning the meta totalCount property
  // of the response
  private loadFurtherCollaborators(accum: number): Observable<number> {
    return this.collaboratorService.getNextCollaborators()
      .pipe(
        map((users: User[]): number => users.length),
        concatMap((count: number): Observable<number> => this.loadFurtherCollaborators(accum + count)),
        catchError(() => of(accum))
      );
  }

}
