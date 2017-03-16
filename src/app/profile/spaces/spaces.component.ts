import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Subject } from 'rxjs';

import { Logger } from 'ngx-base';
import { Space, SpaceService, Context, Contexts } from 'ngx-fabric8-wit';



@Component({
  selector: 'alm-spaces',
  templateUrl: 'spaces.component.html',
  styleUrls: ['./spaces.component.scss'],
  providers: [SpaceService]
})
export class SpacesComponent implements OnInit {

  contentItemHeight: number = 54;
  _spaces: Space[] = [];
  pageSize: number = 20;
  searchTermStream = new Subject<string>();
  context: Context;

  constructor(
    private router: Router,
    private spaceService: SpaceService,
    private logger: Logger,
    private contexts: Contexts) {
      this.contexts.current.subscribe(val => this.context = val);
  }

  ngOnInit() {
    this.searchTermStream
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((searchText: string) => {
        return this.spaceService.search(searchText);
      })
      .subscribe(values => {
        this._spaces = values;
      });
  }

  initSpaces(event: any): void {
    this.pageSize = event.pageSize;
    if (this.context && this.context.user) {
      this.spaceService.getSpacesByUser(this.context.user.attributes.username, this.pageSize)
        .subscribe(spaces => {
          this._spaces = spaces;
        });
    } else {
      this.logger.error("Failed to retrieve list of spaces owned by user");
    }
  }

  fetchMoreSpaces($event): void {
    if (this.context && this.context.user) {
      this.spaceService.getMoreSpacesByUser()
        .subscribe(spaces => {
            this._spaces = this._spaces.concat(spaces);
          },
          err => {
            this.logger.error(err);
          });
    } else {
      this.logger.error("Failed to retrieve list of spaces owned by user");
    }
  }

  get spaces(): Space[] {
    return this._spaces;
  }

  searchSpaces(searchText: string) {
    this.searchTermStream.next(searchText);
  }
}
