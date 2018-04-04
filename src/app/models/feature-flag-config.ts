import { Feature } from '../feature-flag/service/feature-toggles.service';

export class FeatureFlagConfig {
  name: string;
  showBanner: string;
  enabled: boolean;
  featuresPerLevel?: {
    internal: Feature[];
    experimental: Feature[];
    beta: Feature[];
    released: Feature[];
  };
}
