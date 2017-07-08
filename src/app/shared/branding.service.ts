import { Injectable } from '@angular/core';
import { Fabric8UIConfig } from '../shared/config/fabric8-ui-config';

import openshiftLogo from '../../assets/images/OpenShift-io_logo.png';
import fabric8Logo from '../../assets/images/fabric8_logo.png';

@Injectable()
export class BrandingService {
  private isFabric8: boolean;

  constructor(
    private fabric8UIConfig: Fabric8UIConfig,
  ) {
    this.isFabric8 = this.fabric8UIConfig.branding && this.fabric8UIConfig.branding === "fabric8";
    console.log('isFabric8', this.isFabric8);
  }

  get name(): string {
    return this.isFabric8 ? "fabric8.io" : "OpenShift.io";
  }

  get logo(): string {
    return this.isFabric8 ? fabric8Logo : openshiftLogo;
  }

  get backgroundClass(): string {
    return this.isFabric8 ? "home-fabric8-background-image" : "home-header-background-image";
  }

  get description(): string {
    return this.isFabric8 ? "A free, end-to-end, cloud-native development experience." : "A free, end-to-end, cloud-native development experience.";
  }

  get moreInfoLink(): string {
    return this.isFabric8 ? "https://fabric8.io/" : "https://openshift.io";
  }

}
