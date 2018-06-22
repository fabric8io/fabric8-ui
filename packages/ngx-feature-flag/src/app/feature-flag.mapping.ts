import {Component, Injectable, Type} from '@angular/core';

@Injectable()
export class FeatureFlagMapping {
  convertFeatureNameToComponent(name: string): Type<any> {
    switch (name) {
      case 'Test': {
        return Component;
      }
      default: {
        return null;
      }
    }
  }
}
