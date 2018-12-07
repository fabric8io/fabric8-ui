import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Broadcaster, Notification, Notifications, NotificationType } from 'ngx-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Context, SpaceService } from 'ngx-fabric8-wit';
import { Space, SpaceAttributes } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { of as observableOf, Subscription } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SpaceNamespaceService } from '../../shared/runtime-console/space-namespace.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-add-space-overlay',
  styleUrls: ['./add-space-overlay.component.less'],
  templateUrl: './add-space-overlay.component.html'
})
export class AddSpaceOverlayComponent implements OnInit {
  @HostListener('document:keyup.escape', ['$event']) onKeydownHandler(evt: KeyboardEvent) {
    this.hideAddSpaceOverlay();
  }

  @ViewChild('addSpaceOverlayNameInput') spaceNameInput: ElementRef;
  @ViewChild('modalAddSpaceOverlay') modalAddSpaceOverlay: ModalDirective;
  @ViewChild('spaceForm') spaceForm: NgForm;

  spaceName: string;
  spaceDescription: string;
  subscriptions: Subscription[] = [];
  canSubmit: Boolean = true;
  private addAppFlow: string;

  constructor(
    private router: Router,
    private spaceService: SpaceService,
    private notifications: Notifications,
    private userService: UserService,
    private spaceNamespaceService: SpaceNamespaceService,
    private broadcaster: Broadcaster
  ) {}

  ngOnInit() {
    setTimeout(() => this.spaceNameInput.nativeElement.focus());

    this.subscriptions.push(this.broadcaster.on('showAddSpaceOverlay').subscribe((arg: any) => {
      if (typeof arg === 'boolean') {
        if (arg) {
          this.addAppFlow = null;
          this.modalAddSpaceOverlay.show();
        } else {
          this.modalAddSpaceOverlay.hide();
        }
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
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
        message: `Failed to create "${this.spaceName}". Invalid user: "${this.userService.currentLoggedInUser}"`,
        type: NotificationType.DANGER
      } as Notification);
      return;
    }

    this.canSubmit = false;
    let space = this.createTransientSpace();
    space.attributes.name = this.spaceName;
    space.attributes.description = this.spaceDescription;
    space.relationships['owned-by'].data.id = this.userService.currentLoggedInUser.id;

    this.subscriptions.push(this.spaceService.create(space).pipe(
      switchMap(createdSpace => {
        return this.spaceNamespaceService
          .updateConfigMap(observableOf(createdSpace)).pipe(
          map(() => createdSpace),
          // Ignore any errors coming out here, we've logged and notified them earlier
          catchError(err => observableOf(createdSpace)));
      }))
      .subscribe(createdSpace => {
          this.router.navigate([createdSpace.relationalData.creator.attributes.username,
            createdSpace.attributes.name]);
          if (showAddAppOverlay) {
            this.showAddAppOverlay();
          }
          this.hideAddSpaceOverlay();
          this.canSubmit = true;
          this.spaceForm.reset();
        },
        err => {
          this.canSubmit = true;
          this.notifications.message({
            message: `Failed to create "${this.spaceName}"`,
            type: NotificationType.DANGER
        } as Notification);
    }));
  }

  hideAddSpaceOverlay(): void {
    this.broadcaster.broadcast('showAddSpaceOverlay', false);
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'add space closed'
    });
    this.spaceNameInput.nativeElement.blur();
  }

  showAddAppOverlay(): void {
    this.broadcaster.broadcast('showAddAppOverlay', true);
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'add app opened',
      data: {
        source: 'space-overlay'
      }
    });
  }

  private createTransientSpace(): Space {
    let space = {} as Space;
    space.name = '';
    space.path = '';
    space.attributes = new SpaceAttributes();
    space.attributes.name = space.name;
    space.type = 'spaces';
    space.privateSpace = false;
    space.relationships = {
      areas: {
        links: {
          related: ''
        }
      },
      iterations: {
        links: {
          related: ''
        }
      },
      workitemtypegroups: {
        links: {
          related: ''
        }
      },
      'owned-by': {
        data: {
          id: '',
          type: 'identities'
        }
      }
    };
    return space;
  }
}
