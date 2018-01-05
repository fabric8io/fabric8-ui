import { AfterViewInit, Component, ElementRef, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { Contexts, Space, SpaceService } from 'ngx-fabric8-wit';
import { IModalHost } from '../../space/wizard/models/modal-host';
import { TenentService } from '../services/tenent.service';
import { ListConfig } from 'patternfly-ng';
import { EventService } from '../../shared/event.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-cleanup',
  templateUrl: 'cleanup.component.html',
  styleUrls: ['./cleanup.component.less'],
  providers: [ TenentService ]
})
export class CleanupComponent implements OnInit, OnDestroy {
  spaces: Space[] = [];
  contextSubscription: Subscription;
  userName: string;
  contextUserName: string;
  tenantResult: string;
  listConfig: ListConfig;
  showNotification: boolean = true;
  notificationClass: string;
  notificationIcon: string;
  notificationText: string;
  notificationTitle: string;
  tenantIcon: string;
  tenantError: string;
  tenantErrorExpanded: boolean = false;

  cleanupStatus: string = "notstarted";

  @ViewChild('confirmCleanup') confirmCleanup: IModalHost;

  constructor( private contexts: Contexts,
               private spaceService: SpaceService,
               private tenantService: TenentService,
               private eventService: EventService,
               private router: Router ) {
  }

  ngOnInit() {
    this.notificationClass = "alert-danger";
    this.notificationIcon = "pficon-error-circle-o";
    this.notificationTitle = "Warning!";
    this.notificationText = "This action is not reversible!";

    this.listConfig = {
      dblClick: false,
      dragEnabled: false,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      useExpandItems: false
    } as ListConfig;

    this.userName = '';
    this.contextSubscription = this.contexts.current.subscribe(val => {
      this.contextUserName = val.user.attributes.username;
      this.spaceService
        .getSpacesByUser(val.user.attributes.username, 100)
        .subscribe(spaces => {
          this.spaces = spaces;
        });
    });
  }

  ngOnDestroy(): void {
    this.contextSubscription.unsubscribe();
  }

  confirmErase(): void {
    this.confirmCleanup.open();
  }
  confirm(): void {
    this.confirmCleanup.close();
    this.tenantError = "";
    this.cleanupStatus = "running";
    this.showNotification = false;
    let observableArray: Observable<any>[] = [];
    let tenantCleanError: boolean = false;
    let spaceDeleteError: boolean = false;

    this.tenantIcon = "spinner spinner-lg";

    this.spaces.forEach((space) => {
      // only try to erase spaces if they are still around after a failed attempt
      if (!space['erased']) {
        space['progress'] = "Erasing space";
        space['statusIcon'] = "spinner spinner-lg";
        let spaceObservable = this.spaceService.deleteSpace(space).map((result) => {
          this.eventService.deleteSpaceSubject.next(space);
          space['erased'] = true;
          space['progress'] = "Space successfully erased";
          space['statusIcon'] = "pficon pficon-ok";
        }).catch((error) => {
          space['progress'] = "Error: Unable to erase";
          space['statusIcon'] = "pficon pficon-warning-triangle-o";
          spaceDeleteError = true;
          this.showWarningNotification();
          return Observable.of(error);
        });
        observableArray.push(spaceObservable);
      }
    });

    this.tenantResult = "Cleaning up tenant";
    let tenantServiceCleanup = this.tenantService.cleanupTenant()
      .catch((error) => {
        tenantCleanError = true;
        this.tenantResult = "Tenant cleanup failed";
        this.tenantError = error;
        this.tenantIcon = "pficon pficon-warning-triangle-o cleanup-row-account-icon";
        return Observable.of(error);
    });

    observableArray.push(tenantServiceCleanup);

    //join all space delete observables and wait for completion before running tenant cleanup
    Observable.forkJoin(...observableArray).subscribe((result) => {
      if (!tenantCleanError) {
        this.tenantService.updateTenent().subscribe(() => {
          if (!spaceDeleteError) {
            this.showSuccessNotification();
          }
          this.tenantIcon = "pficon pficon-ok cleanup-row-account-icon";
          this.tenantResult = "Tenant reset successful";
        }, (error) => {
          this.tenantIcon = "pficon pficon-warning-triangle-o cleanup-row-account-icon";
          this.tenantResult = "Tenant update failed";
          this.tenantError = error;
          this.showWarningNotification();
        });
      } else {
        this.showWarningNotification();
      }
    }, (error) => {
      this.showWarningNotification();
    });
  }

  userNameMatches(): boolean {
    return (this.contextUserName === this.userName);
  }

  showSuccessNotification(): void {
    this.showNotification = true;
    this.notificationClass = "alert-success";
    this.notificationIcon = "pficon-ok";
    this.notificationTitle = "Success!";
    this.notificationText = "Your OpenShift.io environment has been erased!";
    this.cleanupStatus = "completed";
  }

  showWarningNotification(): void {
    this.showNotification = true;
    this.notificationClass = "alert-warning";
    this.notificationIcon = "pficon-warning-triangle-o";
    this.notificationTitle = "Alert!";
    this.notificationText = "We were unable to reset your account or erase some of your spaces.";
    this.cleanupStatus = "completedwitherrors";
  }

  toggleTenantError(): void {
    this.tenantErrorExpanded = !this.tenantErrorExpanded;
  }

  goHome(): void {
    this.router.navigate(['/', '_home']);
  }
}
