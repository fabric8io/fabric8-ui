import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { Codebase } from '../services/codebase';
import { CodebasesService } from '../services/codebases.service';
import { Logger } from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-create',
  templateUrl: './codebases-create.component.html',
  styleUrls: ['./codebases-create.component.scss'],
  providers: [CodebasesService]
})
export class CodebasesCreateComponent implements OnInit {
  @Output('onCreate') onCreate = new EventEmitter();

  context: Context;
  gitHubRepo: string;
  panelState: string = 'out';

  constructor(
      private codebasesService: CodebasesService,
      private contexts: Contexts,
      private logger: Logger) {
    this.contexts.current.subscribe(val => this.context = val);
  }

  ngOnInit() {
  }

  create($event: MouseEvent): void {
    if (this.gitHubRepo === undefined || this.gitHubRepo.trim().length === 0) {
      return;
    }
    let codebase = this.createTransientCodebase();
    this.codebasesService.create(this.context.space.id, codebase).subscribe(codebase => {
      this.onCreate.emit(codebase);
      this.togglePanelState('out');
    });
  }

  createTransientCodebase(): Codebase {
    return {
      attributes: {
        type: 'git',
        url: this.gitHubRepo
      },
      type: 'codebases'
    } as Codebase;
  }

  togglePanel($event: MouseEvent): void {
    if (this.panelState === 'in') {
      this.panelState = 'out';
    } else {
      this.panelState = 'in';
    }
  }

  togglePanelState($event: any): void {
    this.panelState = $event;
  }
}
