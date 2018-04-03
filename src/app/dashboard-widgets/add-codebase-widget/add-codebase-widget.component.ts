import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { Subscription } from 'rxjs';

import { Broadcaster } from 'ngx-base';
import {
  Context,
  Contexts
} from 'ngx-fabric8-wit';

import { Codebase } from '../../space/create/codebases/services/codebase';
import { CodebasesService } from '../../space/create/codebases/services/codebases.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-add-codebase-widget',
  templateUrl: './add-codebase-widget.component.html',
  styleUrls: ['./add-codebase-widget.component.less']
})
export class AddCodebaseWidgetComponent implements OnInit, OnDestroy {

  codebases: Codebase[] = [];
  context: Context;
  contextPath: string;
  subscriptions: Subscription[] = [];
  @Output() addToSpace = new EventEmitter();

  constructor(
    private broadcaster: Broadcaster,
    private contexts: Contexts,
    private codebaseService: CodebasesService
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.broadcaster
      .on('codebaseAdded')
      .subscribe((codebase: Codebase) => {
        this.addCodebase(codebase);
      }));

    this.subscriptions.push(this.broadcaster
      .on('codebaseDeleted')
      .subscribe((codebase: Codebase) => {
        this.removeCodebase(codebase);
      }));

    this.subscriptions.push(this.contexts.current.subscribe(context => {
      this.context = context;
      this.contextPath = context.path;
      if (context.space) {
        this.updateCodebases();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }

  private addCodebase(codebase: Codebase): void {
    this.codebases.push(codebase);
    this.sortCodebases();
  }

  private removeCodebase(codebase: Codebase): void {
    this.codebases = this.codebases.filter((cb: Codebase): boolean => cb.id !== codebase.id);
  }

  private updateCodebases(): void {
    this.subscriptions.push(
      this.codebaseService.getCodebases(this.context.space.id).subscribe((codebases) => {
        this.codebases = codebases;
        this.sortCodebases();
      })
    );
  }

  private sortCodebases(): void {
    this.codebases.sort((a: Codebase, b: Codebase): number => -1 * a.name.localeCompare(b.name));
  }

}
