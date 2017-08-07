import { IFieldCollection } from './field-set';
import { IForgeCommandParameters } from './forge-command-parameters';
/**
 * Extends the forge command parameters to also include the form fields from the
 * application.
 */
export interface IAppGeneratorCommandParameters extends IForgeCommandParameters {
  /** The  application form fields  */
  fields: IFieldCollection;
}
