import { WizardStepConfig } from 'patternfly-ng';

export function configureSteps(): WizardStepConfig[] {
  let steps: WizardStepConfig[] = [];
  steps.push({
    id: 'stack',
    priority: 1,
    title: 'Stack and Code'
  } as WizardStepConfig);
  steps.push({
    id: 'deployment',
    priority: 2,
    title: 'Deployment'
  } as WizardStepConfig);
  steps.push({
    id: 'summary',
    priority: 3,
    title: 'Summary'
  } as WizardStepConfig);
  steps.push({
    id: 'SelectStack',
    priority: 1,
    title: 'Select Stack',
    allowClickNav: false,
    disabled: false,
    nextEnabled: false
  } as WizardStepConfig);
  steps.push({
    id: 'DefineProject',
    priority: 2,
    title: 'Define Project',
    allowClickNav: false,
    nextEnabled: false
  } as WizardStepConfig);
  steps.push({
    id: 'ConfigurePipeline',
    priority: 3,
    title: 'Configure Pipeline',
    nextEnabled: false
  } as WizardStepConfig);
  steps.push({
    id: 'CreateBuildConfigStep',
    priority: 4,
    title: 'Build Config',
    allowClickNav: false,
    nextEnabled: false
  } as WizardStepConfig);
  steps.push({
    id: 'summarysubstep',
    priority: 5,
    title: 'Summary',
    allowClickNav: false,
    nextEnabled: false
  } as WizardStepConfig);
  return steps;
}
