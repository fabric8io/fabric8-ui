import { WizardStepConfig } from 'patternfly-ng';

export function configureSteps(): WizardStepConfig[] {
  let steps: WizardStepConfig[] = [];
  steps.push({
    id: 'stack',
    priority: 1,
    allowClickNav: false,
    title: 'Stack and Code'
  } as WizardStepConfig);
  steps.push({
    id: 'deployment',
    priority: 2,
    allowClickNav: false,
    title: 'Deployment'
  } as WizardStepConfig);
  steps.push({
    id: 'summary',
    priority: 3,
    allowClickNav: false,
    title: 'Summary'
  } as WizardStepConfig);
  steps.push({
    id: 'GithubImportPickOrganisationStep',
    priority: 1,
    title: 'GitHub Organisation',
    allowClickNav: false,
    disabled: false,
    nextEnabled: false
  } as WizardStepConfig);
  steps.push({
    id: 'GithubRepositoriesStep',
    priority: 2,
    title: 'GitHub Repositories',
    allowClickNav: false,
    nextEnabled: false
  } as WizardStepConfig);
  steps.push({
    id: 'ConfigurePipeline',
    priority: 3,
    title: 'Configure Pipeline',
    nextEnabled: false,
    allowClickNav: false
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
