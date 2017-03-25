import { WizardStepConfig } from './wizard-step-config';
import { Wizard } from './wizard';

// The navigator is used to inject wizard navigation into components and allow them to participate
// in wizard navigation
export class WizardNavigator {
  navigate(wizard: Wizard, steps: Array<WizardStepConfig> = [], wizardStepName: string = '') {
    try {
      let wizardStepConfig = steps.find((wizardStepConfig) => {
        return wizardStepConfig.name.toLowerCase() === (wizardStepName || '').toLowerCase()
      });
      if (wizardStepConfig) {
        wizard.step(wizardStepConfig.step);
      } else {
        console.error(`WizardNavigationError: The ${wizardStepName} wizard step was not found or configured.`)
      }
    } catch (err) {
      console.error(`WizardNavigationException:${err.message}.`)
    }
  }
};
