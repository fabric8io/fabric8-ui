import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Broadcaster, Notification, Notifications, NotificationType } from 'ngx-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Space, SpaceAttributes, SpaceService } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { of as observableOf, Subscription } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SpaceNamespaceService } from '../../shared/runtime-console/space-namespace.service';

export type spaceModal = {
  show: boolean;
  flow: string;
};
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-add-space-overlay',
  styleUrls: ['./add-space-overlay.component.less'],
  templateUrl: './add-space-overlay.component.html',
})
export class AddSpaceOverlayComponent implements OnInit {
  @ViewChild('addSpaceOverlayNameInput') spaceNameInput: ElementRef;

  @ViewChild('modalAddSpaceOverlay') modalAddSpaceOverlay: ModalDirective;

  @ViewChild('spaceForm') spaceForm: NgForm;

  spaceName: string;

  spaceDescription: string;

  subscriptions: Subscription[] = [];

  canSubmit: Boolean = true;

  private addAppFlow: string;

  isModalShown: boolean = false;

  constructor(
    private router: Router,
    private spaceService: SpaceService,
    private notifications: Notifications,
    private userService: UserService,
    private spaceNamespaceService: SpaceNamespaceService,
    private broadcaster: Broadcaster,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.broadcaster.on('showAddSpaceOverlay').subscribe((arg: spaceModal | boolean) => {
        if (typeof arg === 'boolean') {
          if (arg) {
            this.addAppFlow = null;
            this.modalAddSpaceOverlay.show();
          } else {
            this.modalAddSpaceOverlay.hide();
          }
        } else if (typeof arg === 'object') {
          if (arg.show) {
            this.modalAddSpaceOverlay.show();
            this.addAppFlow = arg.flow;
          } else {
            this.modalAddSpaceOverlay.hide();
          }
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  /*
   * Creates a persistent collaboration space
   * by invoking the spaceService
   */
  createSpace(showAddAppOverlay: boolean = true) {
    if (!this.userService.currentLoggedInUser || !this.userService.currentLoggedInUser.id) {
      this.notifications.message({
        message: `Failed to create "${this.spaceName}". Invalid user: "${
          this.userService.currentLoggedInUser
        }"`,
        type: NotificationType.DANGER,
      } as Notification);
      return;
    }

    this.canSubmit = false;
    const space = this.createTransientSpace();
    space.attributes.name = this.spaceName;
    space.attributes.description = this.spaceDescription;
    space.relationships['owned-by'].data.id = this.userService.currentLoggedInUser.id;

    this.subscriptions.push(
      this.spaceService
        .create(space)
        .pipe(
          switchMap((createdSpace) =>
            this.spaceNamespaceService.updateConfigMap(observableOf(createdSpace)).pipe(
              map(() => createdSpace),
              // Ignore any errors coming out here, we've logged and notified them earlier
              catchError((err) => observableOf(createdSpace)),
            ),
          ),
        )
        .subscribe(
          (createdSpace) => {
            this.router.navigate([
              createdSpace.relationalData.creator.attributes.username,
              createdSpace.attributes.name,
            ]);
            if (showAddAppOverlay) {
              this.showAddAppOverlay();
            }
            this.hideAddSpaceOverlay();
            this.canSubmit = true;
          },
          (err) => {
            this.canSubmit = true;
            this.notifications.message({
              message: `Failed to create "${this.spaceName}"`,
              type: NotificationType.DANGER,
            } as Notification);
          },
        ),
    );
  }

  hideAddSpaceOverlay(): void {
    this.broadcaster.broadcast('showAddSpaceOverlay', false);
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'add space closed',
    });
  }

  showAddAppOverlay(): void {
    this.broadcaster.broadcast('showAddAppOverlay', { show: true, selectedFlow: this.addAppFlow });
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'add app opened',
      data: {
        source: 'space-overlay',
      },
    });
  }

  onShown(): void {
    this.isModalShown = true;
  }

  onHidden(): void {
    this.spaceForm.reset();
    this.isModalShown = false;
  }

  private createTransientSpace(): Space {
    const space = {} as Space;
    space.name = '';
    space.path = '';
    space.attributes = new SpaceAttributes();
    space.attributes.name = space.name;
    space.type = 'spaces';
    space.privateSpace = false;
    space.relationships = {
      areas: {
        links: {
          related: '',
        },
      },
      iterations: {
        links: {
          related: '',
        },
      },
      workitemtypegroups: {
        links: {
          related: '',
        },
      },
      'owned-by': {
        data: {
          id: '',
          type: 'identities',
        },
      },
    };
    return space;
  }
}
