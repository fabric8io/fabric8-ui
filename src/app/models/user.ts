import { Entity } from './entity';

export class User implements Entity {
  attributes: {
    fullName: string;
    imageURL: string;
  };
  id: string;
  type: string;
}
