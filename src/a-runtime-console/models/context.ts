import { ContextType } from './context-type';
import { Entity } from './entity';
import { DevSpace } from './space';
import { Team } from './team';

export class Context {
    // The entity that this context is for
    entity: Entity;
    space?: DevSpace;
    team?: Team;
    type: ContextType;
    path: string;
    name: string;
}
