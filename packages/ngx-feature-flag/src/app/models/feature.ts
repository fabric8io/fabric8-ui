export class Feature {
    attributes: FeatureAttributes;
    id?: string;
}

export class FeatureAttributes {
    'name': string;
    'description'?: string;
    // feature is enabled at feature level.
    'enabled'?: boolean;
    'enablement-level'?: string;
    // user has the enablement-level that make this feature enabled.
    'user-enabled'?: boolean;
}
