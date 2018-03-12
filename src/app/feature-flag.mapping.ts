import { Injectable, Type } from '@angular/core';
import { EnvironmentWidgetComponent } from './dashboard-widgets/environment-widget/environment-widget.component';

@Injectable()
export class FeatureFlagMapping {
  convertFeatureNameToComponent(name: string): Type<any> {
    switch (name) {
      case 'Test': {
        return EnvironmentWidgetComponent;
      }
      default: {
        return null;
      }
    }
  }
}
