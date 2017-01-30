import { Stack } from './stack';
import { Team } from './team';
import { ProcessTemplate } from './process-template';

export interface Space {
    name: string;
    path: String;
    process?: ProcessTemplate;
    privateSpace?: boolean;
    teams: Team[];
    defaultTeam: Team;
    id: string;
    attributes: SpaceAttributes;
    type: string;
    stacks?: Stack[];
}

export class SpaceAttributes {
    name: string;
    description: string;
    'updated-at': string;
    'created-at': string;
    version: number;
}
