import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { has } from 'lodash';
import { Context, Contexts, Space } from 'ngx-fabric8-wit';
import { Action, ActionConfig } from 'patternfly-ng';
import { Subscription } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'my-spaces-item-actions',
  templateUrl: './my-spaces-item-actions.component.html'
})
export class MySpacesItemActionsComponent implements OnDestroy, OnInit {
  @Input() space: Space;

  @Output('onDeleteSpace') onDeleteSpace = new EventEmitter();
  @Output('onPinChange') onPinChange = new EventEmitter();

  actionConfig: ActionConfig;
  context: Context;
  private subscriptions: Subscription[] = [];

  constructor(private contexts: Contexts) {
    this.subscriptions.push(this.contexts.current.subscribe(val => this.context = val));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    let showPin: boolean = has(this.space, 'showPin')
      ? (this.space as any).showPin : false;

    this.actionConfig = {
      moreActions: [{
        id: 'pinSpace',
        title: showPin ? 'Remove Pin' : 'Add Pin',
        tooltip: showPin ? 'Remove Pin' : 'Add Pin'
      }, {
        id: 'removeSpace',
        title: 'Remove space',
        tooltip: 'Remove space'
      }]
    } as ActionConfig;
  }

  // Actions

  handleAction($event: Action): void {
    if ($event.id === 'removeSpace') {
      this.confirmDeleteSpace();
    } else if ($event.id === 'pinSpace') {
      this.pinSpace();
    }
  }

  // Private

  private canDeleteSpace(): boolean {
    return (this.context.user.id === this.space.relationalData.creator.id);
  }

  private confirmDeleteSpace(): void {
    this.onDeleteSpace.emit(this.space);
  }

  private pinSpace() {
    this.onPinChange.emit(this.space);
  }
}
