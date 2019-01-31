import {
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Broadcaster } from 'ngx-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Context, Space } from 'ngx-fabric8-wit';
import { DependencyCheckService } from 'ngx-launcher';
import { User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';
import { ContextService } from '../../shared/context.service';
import { PipelinesService } from '../../shared/runtime-console/pipelines.service';
import { BuildConfig } from '../../../a-runtime-console';

export type appModal = {
  show: boolean;
  selectedFlow: string;
};
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-add-app-overlay',
  styleUrls: ['./add-app-overlay.component.less'],
  templateUrl: './add-app-overlay.component.html',
})
export class AddAppOverlayComponent implements OnInit, OnDestroy {
  @ViewChild('projectNameInput') projectNameInput: ElementRef;

  @ViewChild('modalAddAppOverlay') modalAddAppOverlay: ModalDirective;

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

  isModalShown: boolean = false;

  private pipelinesService: PipelinesService;

  constructor(
    private contextService: ContextService,
    private dependencyCheckService: DependencyCheckService,
    public broadcaster: Broadcaster,
    private userService: UserService,
    private router: Router,
    private injector: Injector,
  ) {
    this.loggedInUser = this.userService.currentLoggedInUser;
    this.subscriptions.push(
      this.dependencyCheckService.getDependencyCheck().subscribe((val) => {
        this.projectName = val.projectName;
      }),
    );
    if (this.contextService && this.contextService.current) {
      this.subscriptions.push(
        this.contextService.current.subscribe((ctx: Context) => {
          this.currentSpace = ctx.space;
        }),
      );
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.broadcaster.on('showAddAppOverlay').subscribe((arg: appModal | boolean) => {
        if (typeof arg === 'boolean') {
          if (arg) {
            this.showModal();
          } else {
            this.modalAddAppOverlay.hide();
          }
        } else if (typeof arg === 'object') {
          if (arg.show) {
            this.selectedFlow = arg.selectedFlow;
            this.showModal();
          } else {
            this.modalAddAppOverlay.show();
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

  showModal(): void {
    if (!this.pipelinesService) {
      this.pipelinesService = this.injector.get(PipelinesService);
      this.subscriptions.push(
        this.pipelinesService.current.subscribe((buildConfigs: BuildConfig[]) => {
          if (buildConfigs) {
            this.applications = buildConfigs.map((bc) => bc.name);
          }
        }),
      );
    }
    this.modalAddAppOverlay.show();
  }

  /**
   * Helper to route to create app
   */
  hideAddAppOverlay(): void {
    this.broadcaster.broadcast('showAddAppOverlay', false);
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'add app closed',
    });
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
      flow: this.selectedFlow,
    });
    this.router
      .navigate([
        '/',
        this.userService.currentLoggedInUser.attributes.username,
        this.currentSpace.attributes.name,
        'applauncher',
        this.selectedFlow,
        this.projectName,
      ])
      .then(() => {
        this.hideAddAppOverlay();
        this.navigationInProgress = false;
      });
  }

  /**
   * Validate the application name
   */
  validateProjectName(): void {
    if (this.projectName) {
      this.projectName = this.projectName.toLowerCase();
      this.isProjectNameValid = this.isValidProjectName(this.projectName);
      this.isProjectNameAvailable = this.applications.indexOf(this.projectName) === -1;
    }
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

  onShown(): void {
    this.isModalShown = true;
  }

  onHidden(): void {
    this.appForm.reset();
    this.isModalShown = false;
  }
}
