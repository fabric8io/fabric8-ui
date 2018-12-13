import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Broadcaster } from 'ngx-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Context, Space } from 'ngx-fabric8-wit';
import { DependencyCheckService } from 'ngx-launcher';
import { User, UserService } from 'ngx-login-client';
import { empty as observableEmpty, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ContextService } from '../../shared/context.service';
import { Application, DeploymentApiService } from '../create/deployments/services/deployment-api.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-add-app-overlay',
  styleUrls: ['./add-app-overlay.component.less'],
  templateUrl: './add-app-overlay.component.html'
})
export class AddAppOverlayComponent implements OnInit, OnDestroy {
  @HostListener('document:keyup.escape', ['$event']) onKeydownHandler(evt: KeyboardEvent) {
    this.hideAddAppOverlay();
  }
  @ViewChild('projectNameInput') projectNameInput: ElementRef;
  @ViewChild('modalAddAppOverlay') modalAddAppOverlay: ModalDirective;
  @Input() preselectedFlow: string;
  @ViewChild('appForm') appForm: NgForm;

  currentSpace: Space;
  isProjectNameValid: boolean = false;
  loggedInUser: User;
  projectName: string = '';
  selectedFlow: string = '';
  spaces: Space[] = [];
  subscriptions: Subscription[] = [];
  applications: string[] = [];
  isProjectNameAvailable: boolean = false;
  navigationInProgress: boolean = false;

  constructor(private contextService: ContextService,
              private dependencyCheckService: DependencyCheckService,
              public broadcaster: Broadcaster,
              private userService: UserService,
              private router: Router,
              private deploymentApiService: DeploymentApiService) {
    this.loggedInUser = this.userService.currentLoggedInUser;
    this.subscriptions.push(this.dependencyCheckService.getDependencyCheck().subscribe((val) => {
      this.projectName = val.projectName;
    }));
    if (this.contextService && this.contextService.current) {
      this.subscriptions.push(
        this.contextService.current.pipe(
          map((ctx: Context) => ctx.space),
          switchMap(space => {
            if (space) {
              this.currentSpace = space;
              return this.deploymentApiService.getApplications(space.id);
            } else {
              return observableEmpty();
            }
          }))
          .subscribe((response: Application[]) => {
            if (response) {
              const applications: string[] = response.map(app => {
                return app.attributes.name ? app.attributes.name.toLowerCase() : '';
              });
              this.applications = applications;
            }
          })
      );
    }
  }

  ngOnInit(): void {
    if (this.preselectedFlow) {
      this.selectedFlow = this.preselectedFlow;
    }
    setTimeout(() => this.projectNameInput.nativeElement.focus());

    this.subscriptions.push(this.broadcaster.on('showAddAppOverlay').subscribe((show: boolean) => {
      if (show) {
        this.appForm.reset();
        this.modalAddAppOverlay.show();
      } else {
        this.modalAddAppOverlay.hide();
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  /**
   * Helper to route to create app
   */
  hideAddAppOverlay(): void {
    this.broadcaster.broadcast('showAddAppOverlay', false);
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'add app closed'
    });
    this.projectName = '';
    this.selectedFlow = '';
    this.validateProjectName();
    setTimeout(() => this.projectNameInput.nativeElement.blur());
  }

  /**
   * Helper to update launcher selection
   */
  updateLauncherFlowSelection(selLaunch: string): void {
    this.selectedFlow = selLaunch;
  }

  /**
   * Helper to route to create/import app
   */
  routeToLaunchApp(): void {
    this.navigationInProgress = true;
    this.broadcaster.broadcast('clickContinueAppOverlay', {
      appName: this.projectName,
      flow: this.selectedFlow
    });
    this.router.navigate(['/',
      this.userService.currentLoggedInUser.attributes.username, this.currentSpace.attributes.name,
      'applauncher', this.selectedFlow, this.projectName]).then(() => {
        this.hideAddAppOverlay();
        this.navigationInProgress = false;
      });
  }

  /**
   * Validate the application name
   */
  validateProjectName(): void {
    this.projectName = this.projectName.toLowerCase();
    this.isProjectNameValid =
      this.isValidProjectName(this.projectName);
    this.isProjectNameAvailable = this.applications.indexOf(this.projectName) === -1 ? true : false;
  }

   /**
   * Validate the project name and returns a boolean value
   *
   * @param  {string} projectName
   * @returns boolean
   */
  isValidProjectName(projectName: string): boolean {
    // allows only '-' and 4-40 characters (must start with alphabetic and end with alphanumeric)
    // no continuous '-' is allowed
    const pattern = /^[a-z](?!.*--)[a-z0-9-]{2,38}[a-z0-9]$/;
    return pattern.test(projectName);
  }
}
