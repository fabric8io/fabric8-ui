import { ResourceObject } from './jsonapi';

export type UserType = 'identities';

export interface UserAttributes {
  /**
   * The bio
   */
  bio?: string;

  /**
   * The company
   */
  company?: string;

  /**
   * User context information of any type as a json
   */
  contextInformation?: any;

  /**
   * The date of creation of the user
   */
  'created-at'?: Date;

  /**
   * The email
   */
  email?: string;

  /**
   * The user's full name
   */
  fullName?: string;

  /**
   * The id of the corresponding Identity
   */
  identityID?: string;

  /**
   * The avatar image for the user
   */
  imageURL?: string;

  /**
   * The IDP provided this identity
   */
  providerType?: string;

  /**
   * Whether the registration has been completed
   */
  registrationCompleted?: boolean;

  /**
   * The date of update of the user
   */
  'updated-at'?: Date;

  /**
   * The url
   */
  url?: string;

  /**
   * The id of the corresponding User
   */
  userID?: string;

  /**
   * The username
   */
  username: string;
}

export interface UserResource extends ResourceObject<UserAttributes, UserType> {}
