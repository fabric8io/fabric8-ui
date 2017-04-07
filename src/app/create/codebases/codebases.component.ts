import { Component, ContentChild, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Codebase } from './services/codebase';
import { CodebasesService } from './services/codebases.service';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { GitHubService } from "./services/github.service";
import { ListViewConfig, EmptyStateConfig } from 'ngx-widgets';
import { Broadcaster, Logger, Notification, NotificationType, Notifications } from 'ngx-base';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases',
  templateUrl: './codebases.component.html',
  styleUrls: ['./codebases.component.scss'],
  providers: [CodebasesService, GitHubService]
})
export class CodebasesComponent implements OnInit {
  @ContentChild('actionTemplate') actionTemplate: TemplateRef<any>;
  @ContentChild('itemTemplate') itemTemplate: TemplateRef<any>;
  @ContentChild('itemExpandedTemplate') itemExpandedTemplate: TemplateRef<any>;

  codebases: Codebase[];
  context: Context;
  emptyStateConfig: EmptyStateConfig;
  listViewConfig: ListViewConfig;

  constructor(
      private broadcaster: Broadcaster,
      private codebasesService: CodebasesService,
      private contexts: Contexts,
      private gitHubService: GitHubService,
      private logger: Logger,
      private notifications: Notifications,
      private router: Router) {
    this.contexts.current.subscribe(val => this.context = val);
    this.gitHubService.clearCache();
    this.broadcaster
      .on('codebaseAdded')
      .subscribe((codebase: Codebase) => {
        this.addCodebase(codebase);
      });
  }

  ngOnInit(): void {
    this.updateCodebases();

    this.emptyStateConfig = {
      actions: [{
        id: 'action1',
        name: 'Add a Codebase',
        title: 'Add a Codebase',
        type: 'main'
      }],
      icon: 'pficon-add-circle-o',
      title: 'Add a Codebase',
      info: "Start by importing your code repository."
    } as EmptyStateConfig;

    this.listViewConfig = {
      dblClick: false,
      dragEnabled: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      //selectionMatchProp: 'name',
      showSelectBox: false,
      useExpandingRows: true
    } as ListViewConfig;
  }

  // Actions

  openAddCodebasePanel(): void {
    this.router.navigate([`${this.context.path}/create`, { outlets: { action: 'add-codebase' }}]);
  }

  // Private

  /**
   * Add latest codebase
   */
  private addCodebase(codebase: Codebase): void {
    if (this.codebases === undefined) {
      this.codebases = [];
    }
    this.codebases.push(codebase);
  }

  /**
   * Update latest codebases for current space
   */
  private updateCodebases(): void {
    // Get codebases
    this.codebasesService.getCodebases(this.context.space.id).subscribe(codebases => {
      if (codebases != null) {
        this.codebases = codebases;
      }
    }, error => {
      this.handleError("Failed to retrieve codebases", NotificationType.DANGER);
    });
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
