import { Feature } from './feature';

export class FeatureFlagConfig {
    'user-level'?: string;
    showBanner?: string;
    featuresPerLevel?: {
        internal: Feature[];
        experimental: Feature[];
        beta: Feature[];
    };
}
