import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { Broadcaster, Logger } from 'ngx-base';

import { FeatureTogglesService } from '../../../../feature-flag/service/feature-toggles.service';

@Component({
  selector: 'flow-selector',
  templateUrl: './flow-selector.component.html',
  styleUrls: ['./flow-selector.component.less']
})
export class FlowSelectorComponent implements OnDestroy {
  @Input() space: string;
  @Output('onSelect') onSelect = new EventEmitter();
  @Output('onCancel') onCancel = new EventEmitter();

  appLauncherEnabled: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(
    private broadcaster: Broadcaster,
    private featureTogglesService: FeatureTogglesService
  ) {
    this.subscriptions.push(featureTogglesService.getFeature('AppLauncher').subscribe((feature) => {
      this.appLauncherEnabled = feature.attributes['enabled'] && feature.attributes['user-enabled'];
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  select(flow: string) {
    switch (flow) {
      case 'import': {
        this.onSelect.emit({flow: flow});
        break;
      }
      case 'quickstart': {
        this.onSelect.emit({flow: flow});
        break;
      }
      default: {
        // TODO close modal and navigate;
        break;
      }
    }
  }

  cancel() {
    this.onCancel.emit({});
  }

  showAddAppOverlay(): void {
    this.broadcaster.broadcast('showAddAppOverlay', true);
  }

}
