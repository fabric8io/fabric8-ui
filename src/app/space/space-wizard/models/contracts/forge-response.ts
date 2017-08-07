export interface IForgeResponse<T> {
  /** the primary payload */
  payload: T;
  /** Used for any other 'out of band' data that is contextual to the payload */
  context?: any;
  /** Other dynamic properties */
  [propertyName: string]: any;

}


