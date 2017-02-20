// TODO: refactor and refine domain model for wizard and configurator
export class Wizard {

  activeStep: number = 0;

  constructor() { }

  step(step: number = 0) {
    this.activeStep = step;
  }

};
