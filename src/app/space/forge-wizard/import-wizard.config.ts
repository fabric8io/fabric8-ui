import { WizardStepConfig } from 'patternfly-ng';

// TODO fix the nextEnabled
// bug in the wizard component, since we have introduced substeps, the nextEnabled which enable/disable next button is
// "broken". The way we use the component is to set all step/substep as nextEnabled: false.
// As we move on in the flow, we enabled each steps. I have a parent step1 whith substep1_1 and substep1_2,
// I put substep1_2 to nextEnabled:true but the next button is still nextEnable false bc
// the wizard component checks the parent step which in turn is enabled if all steps are nextEnabled.
// however step1_2 is not yet. To me this logic here:
// https://github.com/patternfly/patternfly-ng/blob/master/src/app/wizard/wizard-step.component.ts#L128-L132 is a bug
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
    id: 'review',
    priority: 3,
    title: 'Review'
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
    allowClickNav: false
  } as WizardStepConfig);
  steps.push({
    id: 'ConfigurePipeline',
    priority: 3,
    title: 'Configure Pipeline'
  } as WizardStepConfig);
  steps.push({
    id: 'CreateBuildConfigStep',
    priority: 4,
    title: 'Build Config',
    allowClickNav: false
  } as WizardStepConfig);
  steps.push({
    id: 'Review',
    priority: 5,
    title: 'Review',
    allowClickNav: false
  } as WizardStepConfig);
  return steps;
}
