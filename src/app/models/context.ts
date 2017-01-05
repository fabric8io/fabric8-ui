import { ContextType } from './context-type';
import { Entity } from './entity';
import { Space } from './space';
import { Team } from './team';

export class Context {
    // The entity that this context is for
    entity: Entity;
    space?: Space;
    team?: Team;
    type: ContextType;
    path: string;
    name: string;
}
