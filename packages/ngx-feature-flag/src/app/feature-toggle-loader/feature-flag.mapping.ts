import { Injectable, Type } from '@angular/core';
import { DynamicallyLoadedComponent } from './dynamically-loaded.component';

@Injectable()
export class MyFeatureFlagMapping {
  convertFeatureNameToComponent(name: string): Type<any> {
    switch (name) {
      case 'Test': {
        return DynamicallyLoadedComponent;
      }
      default: {
        return null;
      }
    }
  }
}
