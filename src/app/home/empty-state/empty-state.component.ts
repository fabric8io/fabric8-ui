import { Component, ViewEncapsulation } from '@angular/core';
import { Broadcaster } from 'ngx-base';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-home-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.less']
})
export class EmptyStateComponent {

  constructor(
    private readonly broadcaster: Broadcaster
  ) { }

  showAddSpaceOverlay(): void {
    this.broadcaster.broadcast('showAddSpaceOverlay', true);
  }

}
