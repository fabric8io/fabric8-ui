import {FeatureTogglesService} from '../../app/service/feature-toggles.service';

export class NavbarItems {
  static readonly COMPONENTS: any[] = [{
     id: 'f8-feature-toggle',
     path: 'f8-feature-toggle',
     title: 'f8-feature-toggle'
  },
  {
    id: 'f8-feature-toggle-loader',
     path: 'f8-feature-toggle-loader',
     title: 'f8-feature-toggle-loader'
  }];
  static readonly SERVICES: any[] = [{
    id: 'FeatureTogglesService',
    path: 'FeatureTogglesService',
    title: 'FeatureTogglesService'
  }];
  static readonly GETSTARTED: any[] = [{
    hasChildren: false,
    id: 'getstarted',
    path: 'welcome',
    title: 'Welcome'
  },
  {
    hasChildren: true,
    id: 'components',
    path: 'f8-feature-toggle',
    title: 'Components'
  },
  {
    hasChildren: true,
    id: 'services',
    path: 'FeatureTogglesService',
    title: 'Services'
  }];
}
