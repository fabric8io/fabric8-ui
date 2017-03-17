import {
    STACK_DETAILS_CONSTANT,
    STACK_RECOMMENDER_CONSTANT,
    OVERVIEW_CONSTANT,
    STACK_COMPONENTS_CONSTANT
} from './global-constants';

/**
 * MESSAGE_MAP stores the constants against their keys.
 * eg.) stackDetails is the key to load the constants
 * (STACK_DETAILS_CONSTANT) for the component (StackDetails)
 * 
 * Whenever a new constant file is being added, the same has to be imported on top and
 * entered here for the services to pick and render the respective messages.
 */

export const MESSAGE_MAP: any = {
    'stackDetails': STACK_DETAILS_CONSTANT,
    'stackRecommender': STACK_RECOMMENDER_CONSTANT,
    'overview': OVERVIEW_CONSTANT,
    'stackComponents': STACK_COMPONENTS_CONSTANT
};
