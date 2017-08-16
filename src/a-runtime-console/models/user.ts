import { Entity } from './entity';
import { Profile } from './profile';

export class User implements Entity {
  attributes: Profile;
  id: string;
  type: string;
}
