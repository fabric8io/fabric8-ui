import { Entity } from 'ngx-login-client';
import { LinkType } from './link-type';
import { ContextType } from './context-type';
import { Space } from './space';
import { Team } from './team';

export class Context {
    // The entity that this context is for
    entity: Entity;
    space?: Space;
    team?: Team;
    // This is a union type
    // The UI will load this as a string, but will then convert it to a ContextType
    type: string | ContextType;
    path: string;
    name: string;
}
