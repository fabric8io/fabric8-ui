import { IFieldCollection } from './field-set';
import { IAppGeneratorResponseContext } from './app-generator-response-context';
import { IAppGeneratorState } from './app-generator-state';

export interface IAppGeneratorResponse {
  payload: {
    /** the collection of fields representing required information needed from the appgenerator
     * to generate an application
     */
    fields: IFieldCollection;
    /** the state that the app generator is currently in */
    state: IAppGeneratorState;
  };
  /** Any contextual information relevant to the response. */
  context?: IAppGeneratorResponseContext;
  /** Other dynamic fields. */
  [key: string]: any;
}

