import { Gui, Input, SubmittableInput } from './gui.model';
import { Injectable } from '@angular/core';

@Injectable()
export class History {
  state: Gui[] = [];
  ready: boolean;

  add(gui: Gui) {
    this.state.push(gui);
    gui.stepIndex = this.stepIndex;
  }

  done() {
    this.ready = true;
  }

  get(index: number): Gui {
    return this.state[index - 1];
  }

  get currentGui(): Gui {
    return this.ready ? this.state[this.stepIndex - 1] : new Gui();
  }

  get stepIndex(): number {
    return Math.max(0, this.state.length);
  }

  resetTo(index: number) {
    this.ready = false;
    this.state.splice(index, this.state.length);
  }

  convert(stepIndex = this.stepIndex - 1): Gui {
    let submittableGui = new Gui();
    submittableGui.stepIndex = stepIndex;
    submittableGui.inputs = [];
    for (let gui of this.state) {
      let inputs = gui.inputs;
      if (inputs) {
        let submittableInputs = this.convertToSubmittable(inputs);
        submittableGui.inputs = submittableGui.inputs.concat(submittableInputs);
      }
    }
    return submittableGui;
  }

  updateFormValues(values: any, stepIndex = this.stepIndex - 1): void {
    let gui = this.state[stepIndex];
    for (let input of gui.inputs) {
      for (let key of Object.keys(values)) {
        if (input.name === key) {
          input.value = values[key];
        }
      }
    }
  }

  toString(): string {
    return btoa(JSON.stringify(this.convert()));
  }

  private convertToSubmittable(inputs: Input[]): Input[] {
    let array: SubmittableInput[] = [];
    if (inputs) {
      for (let input of inputs) {
        array.push(new SubmittableInput(input));
      }
    }
    return array as Input[];
  }
}
