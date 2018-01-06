import { Router, ActivatedRoute } from '@angular/router';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Context, Contexts } from 'ngx-fabric8-wit';
import { Broadcaster } from 'ngx-base';
import { Notification, NotificationType, Notifications } from 'ngx-base';

import { Codebase } from '../services/codebase';
import { CodebasesService } from '../services/codebases.service';
import { GitHubRepoDetails } from '../services/github';
import { GitHubService } from '../services/github.service';
import { removeAction } from '../../../../app-routing.module';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-add',
  templateUrl: './codebases-add.component.html',
  styleUrls: ['./codebases-add.component.less']
})
export class CodebasesAddComponent implements AfterViewInit, OnDestroy, OnInit {

  codebases: Codebase[];
  context: Context;
  gitHubRepoDetails: GitHubRepoDetails;
  gitHubRepo: string;
  gitHubRepoFullName: string;
  gitHubRepoInvalid: boolean = false;
  gitHubRepoDuplicated: boolean = false;
  license: string;
  panelState: string = 'out';
  subscriptions: Subscription[] = [];

  constructor(
      private broadcaster: Broadcaster,
      private codebasesService: CodebasesService,
      private contexts: Contexts,
      private gitHubService: GitHubService,
      private notifications: Notifications,
      private router: Router,
      private route: ActivatedRoute) {
    this.subscriptions.push(this.contexts.current.subscribe(val => this.context = val));
  }

  ngOnInit(): void {
    this.updateCodebases();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    // Open the panel
    // Why use a setTimeOut -
    // This is for unit testing.
    // After every round of change detection,
    // dev mode immediately performs a second round to verify
    // that no bindings have changed since the end of the first,
    // as this would indicate that changes are being caused by change detection itself.
    // I had to triggers another round of change detection
    // during that method - emit an event, whatever. Wrapping it in a timeout would do the job
    setTimeout(() => {
      this.togglePanel('in');
    });
  }

  // Actions

  /**
   * Associate codebase with current space
   *
   * @param $event MouseEvent for onclick
   */
  addCodebase($event: MouseEvent): void {
    let codebase = this.createTransientCodebase();

    // Avoid duplicate codebases
    if (this.codebases !== undefined) {
      for (let i = 0; i < this.codebases.length; i++) {
        if (this.codebases[i].attributes.url === codebase.attributes.url) {
          this.gitHubRepoDuplicated = true;
          return;
        }
      }
    }

    // Add codebase to space
    this.subscriptions.push(this.codebasesService.addCodebase(this.context.space.id, codebase)
      .do(() => this.togglePanel('out'))
      .do(codebase => this.broadcaster.broadcast('codebaseAdded', codebase))
      .switchMap(codebase => {
        let fullName = this.getGitHubRepoFullName(codebase.attributes.url);
        this.notifications.message({
          message: `Codebase "${fullName}" added!`,
          type: NotificationType.SUCCESS
        } as Notification);

        // On a successful creation, always navigate to the spaces create screen
        return this.contexts.current.map(context => `${context.path}/create`);
      })
      .do(url => this.close(url))
      .subscribe(() => {
       }, error => {
        this.gitHubRepoInvalid = true;
        this.handleError('Failed to associate codebase with space', NotificationType.DANGER);
      }));
  }

  /**
   * Fetch GitHub details based on repo full name
   *
   * @param $event MouseEvent for onclick
   */
  fetchCodebase($event: MouseEvent): void {
    this.gitHubRepoFullName = this.getGitHubRepoFullName(this.gitHubRepo);
    this.gitHubRepoInvalid = this.isGitHubRepoFullNameInvalid();
    if (this.gitHubRepoInvalid) {
      return;
    }
    this.subscriptions.push(this.gitHubService.getRepoDetailsByFullName(this.gitHubRepoFullName)
      .subscribe(gitHubRepoDetails => {
        this.gitHubRepoDetails = gitHubRepoDetails;
      }, error => {
        this.gitHubRepoInvalid = true;
      }));
    this.subscriptions.push(this.gitHubService.getRepoLicenseByUrl(this.gitHubRepoFullName)
      .subscribe(gitHubRepoLicense => {
        this.license = gitHubRepoLicense.license.name;
      }, error => {
        this.license = 'None';
      }));
  }

  /**
   * Set slider panel state based on component state change
   *
   * @param state Panel state: "in" or "out"
   */
  togglePanel(state: string): void {
    this.panelState = state;
    this.resetAll();

    if (state === 'out') {
      this.close(removeAction(this.router.url));
    }
  }

  // Private

  private close(routeTo: string) {
    // Wait for the animation to finish
    // From in to out it takes 300 ms
    // So wait for 400 ms
    setTimeout(() => {
      this.router.navigateByUrl(routeTo);
    }, 400);
  }

  /**
   * Create transient codebase with GitHub repo URL
   *
   * @returns {Codebase}
   */
  private createTransientCodebase(): Codebase {
    return {
      attributes: {
        type: 'git',
        url: 'https://github.com/' + this.gitHubRepoFullName + '.git'
      },
      type: 'codebases'
    } as Codebase;
  }

  /**
   * Get GitHub full name
   *
   * @param repoUrl The GitHub repo URL
   * @returns {string} The GitHub full name (e.g., fabric8-services/fabric8-wit)
   */
  private getGitHubRepoFullName(repoUrl: string): string {
    let url = repoUrl.trim();
    let fullName = this.getGitHubRepoFullNameFromBrowserUrl(url);
    if (fullName !== null) {
      return fullName;
    }
    fullName = this.getGitHubRepoFullNameFromHttpsUrl(url);
    if (fullName !== null) {
      return fullName;
    }
    fullName = this.getGitHubRepoFullNameFromSshUrl(url);
    if (fullName !== null) {
      return fullName;
    }
    return url;
  }

  /**
   * Get GitHub full name from browser URL
   *
   * @param url The GitHub browser URL (e.g., https://github.com/fabric8-services/fabric8-wit)
   * @returns {string} The GitHub full name (e.g., fabric8-services/fabric8-wit)
   */
  private getGitHubRepoFullNameFromBrowserUrl(url: string): string {
    let prefix = 'https://github.com/';
    let postfix = '.git';
    let start = url.indexOf(prefix);
    let end = url.lastIndexOf('.git');
    return (start !== -1 && end === -1) ? url.substring(prefix.length, url.length) : null;
  }

  /**
   * Get GitHub full name from HTTPS URL
   *
   * @param url The GitHub HTTPS URL (e.g., https://github.com/fabric8-services/fabric8-wit.git)
   * @returns {string} The GitHub full name (e.g., fabric8-services/fabric8-wit)
   */
  private getGitHubRepoFullNameFromHttpsUrl(url: string): string {
    let prefix = 'https://github.com/';
    let postfix = '.git';
    let start = url.indexOf(prefix);
    let end = url.lastIndexOf('.git');
    let trueEnd = (end + postfix.length === url.length); // No chars after postfix
    return (start !== -1 && end !== -1 && trueEnd) ? url.substring(prefix.length, end) : null;
  }

  /**
   * Get GitHub full name from SSH URL
   *
   * @param url The GitHub clone URL (e.g., git@github.com:fabric8-services/fabric8-wit.git)
   * @returns {string} The GitHub full name (e.g., fabric8-services/fabric8-wit)
   */
  private getGitHubRepoFullNameFromSshUrl(url: string): string {
    let prefix = 'git@github.com:';
    let postfix = '.git';
    let start = url.indexOf(prefix);
    let end = url.lastIndexOf('.git');
    let trueEnd = (end + postfix.length === url.length); // No chars after postfix
    return (start !== -1 && end !== -1 && trueEnd) ? url.substring(prefix.length, end) : null;
  }

  /**
   * Validate GitHub repo full name (e.g., fabric8-services/fabric8-wit)
   *
   * @returns {boolean}
   */
  private isGitHubRepoFullNameInvalid(): boolean {
    return (this.gitHubRepoFullName === undefined
        || this.gitHubRepoFullName.trim().length === 0
        || this.gitHubRepoFullName.split('/').length !== 2
        || this.gitHubRepoFullName.indexOf(':') !== -1
        || this.gitHubRepoFullName.indexOf('git@github.com') !== -1
        || this.gitHubRepoFullName.indexOf('https://github.com') !== -1
        || this.gitHubRepoFullName.indexOf('.git') !== -1);
  }

  /**
   * Helper to reset slider panel
   */
  private resetAll(): void {
    this.gitHubRepo = undefined;
    this.resetFetch();
  }

  /**
   * Helper to reset invalid properties
   */
  private resetFetch(): void {
    this.gitHubRepoDetails = undefined;
    this.gitHubRepoFullName = undefined;
    this.gitHubRepoInvalid = false;
    this.gitHubRepoDuplicated = false;
    this.license = undefined;
  }

  // Private

  /**
   * Update latest codebases for current space
   */
  private updateCodebases(): void {
    // Get codebases
    this.subscriptions.push(this.codebasesService.getCodebases(this.context.space.id)
      .subscribe(codebases => {
        if (codebases != null) {
          this.codebases = codebases;
        }
      }, error => {
        this.handleError('Failed to retrieve codebases', NotificationType.WARNING);
      }));
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
