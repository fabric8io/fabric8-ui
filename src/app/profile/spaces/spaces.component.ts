import { Component, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';

import { Broadcaster, Logger } from 'ngx-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Context, Contexts, Space, SpaceService } from 'ngx-fabric8-wit';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-spaces',
  templateUrl: 'spaces.component.html',
  styleUrls: ['./spaces.component.less']
})
export class SpacesComponent implements OnInit {

  @Input() spaceId: string;
  contentItemHeight: number = 54;
  _spaces: Space[] = [];
  modalRef: BsModalRef;
  pageSize: number = 20;
  searchTermStream = new Subject<string>();
  context: Context;
  spaceToDelete: Space;
  private space: string;

  constructor(
    private spaceService: SpaceService,
    private logger: Logger,
    private contexts: Contexts,
    private modalService: BsModalService,
    private broadcaster: Broadcaster
  ) {
    this.space = '';
    this.contexts.current.subscribe(val => this.context = val);
  }

  ngOnInit() {
    this.searchTermStream.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchText: string) => {
        return this.spaceService.search(searchText);
      })
    ).subscribe(values => {
      this._spaces = values;
    });
  }

  initSpaces(event: any): void {
    this.pageSize = event.pageSize;
    if (this.context && this.context.user) {
      this.spaceService
        .getSpacesByUser(this.context.user.attributes.username, this.pageSize)
        .subscribe(spaces => {
          this._spaces = spaces;
        });
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
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
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  removeSpace(): void {
    if (this.context && this.context.user && this.spaceToDelete) {
      let space = this.spaceToDelete;
      this.spaceService.deleteSpace(space)
        .subscribe(() => {
          let index = this._spaces.indexOf(space);
          this._spaces.splice(index, 1);
          this.broadcaster.broadcast('spaceDeleted', space);
          this.spaceToDelete = undefined;
          this.modalRef.hide();
        },
        err => {
          this.logger.error(err);
          this.spaceToDelete = undefined;
          this.modalRef.hide();
        });
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  canDeleteSpace(creatorId: string): boolean {
    return creatorId === this.context.user.id;
  }

  confirmDeleteSpace(space: Space, deleteSpace: TemplateRef<any>): void {
    this.spaceToDelete = space;
    this.modalRef = this.modalService.show(deleteSpace, {class: 'modal-lg'});
  }

  get spaces(): Space[] {
    return this._spaces;
  }

  searchSpaces(searchText: string) {
    this.searchTermStream.next(searchText);
  }

  closeModal($event: any): void {
    this.modalRef.hide();
  }

  cancel() {
    this.modalRef.hide();
  }

  showAddSpaceOverlay(): void {
    this.broadcaster.broadcast('showAddSpaceOverlay', true);
  }

}
