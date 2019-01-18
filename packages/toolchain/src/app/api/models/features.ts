import { ResourceObject } from './jsonapi';

export type FeatureType = 'features';

export interface FeatureAttributes {
  /**
   * The feature name
   */
  description?: string;

  /**
   * Is the feature enabled at feature level
   */
  enabled: boolean;

  /**
   * The feature enablement level
   */
  'enablement-level': FeatureLevel;

  /**
   * The feature name
   */
  name: string;

  /**
   * Is this feature enabled for the current user
   */
  'user-enabled': boolean;
}

export type FeatureLevel = 'notApplicable' | 'internal' | 'experimental' | 'beta' | 'released';

export interface FeatureResource extends ResourceObject<FeatureAttributes, FeatureType> {}
