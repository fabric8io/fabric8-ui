import { Injectable } from '@angular/core';
import { Fabric8UIConfig } from '../shared/config/fabric8-ui-config';

import openshiftLogo from '../../assets/images/OpenShift-io_logo.png';
import fabric8Logo from '../../assets/images/fabric8_logo.png';

@Injectable()
export class BrandingService {
  private isFabric8: boolean;
  private _logo: string;
  private _backgroundClass: string;
  private _description: string;
  private _name: string;
  private _moreInfoLink: string;

  constructor(
    private fabric8UIConfig: Fabric8UIConfig
  ) {
    this.isFabric8 = this.fabric8UIConfig.branding && this.fabric8UIConfig.branding === 'fabric8';

    if (this.isFabric8) {
      this._logo = fabric8Logo;
      // replace background image with fabric8 background once available
      this._backgroundClass = 'home-fabric8-background-image';
      this._description = 'A free, end-to-end, cloud-native development experience.';
      this._name = 'fabric8.io';
      this._moreInfoLink = 'https://fabric8.io/';
    } else {
      // default openshift.io branding
      this._logo = openshiftLogo;
      this._backgroundClass = 'home-header-background-image';
      this._description = 'A free, end-to-end, cloud-native development experience.';
      this._name = 'OpenShift.io';
      this._moreInfoLink = 'https://openshift.io';
    }
  }

  get name(): string {
    return this._name;
  }

  get logo(): string {
    return this._logo;
  }

  get backgroundClass(): string {
    return this._backgroundClass;
  }

  get description(): string {
    return this._description;
  }

  get moreInfoLink(): string {
    return this._moreInfoLink;
  }

}
