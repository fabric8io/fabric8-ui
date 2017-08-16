import {ScalableResource} from './scalableresource.model';

export class Deployment extends ScalableResource {
  defaultKind() {
    return 'Deployment';
  }
}

export class Deployments extends Array<Deployment>{
}
