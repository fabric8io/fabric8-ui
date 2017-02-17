import { Injectable, OnInit } from '@angular/core';

import { Toggle } from './toggle';
import { TOGGLES } from './toggle-options';

@Injectable()
export class ToggleService implements OnInit{
  private _featureToggle: Toggle = null;

  // TODO: init the default toggle
  ngOnInit(): void {
    this.featureToggle = TOGGLES[0];
  }

  getToggles(): Promise<Toggle[]> {
    return Promise.resolve(TOGGLES)
  }

  get featureToggle(): Toggle {
    if (this._featureToggle == null) {
      this.featureToggle = TOGGLES[0];
      return this._featureToggle;
    } else {
      return this._featureToggle;
    }
  }

  set featureToggle(newToggle: Toggle) {
    this._featureToggle = newToggle;
  }

}
