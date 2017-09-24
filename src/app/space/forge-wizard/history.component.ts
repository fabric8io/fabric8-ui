import { Gui, Input, SubmittableInput } from "./gui.model";
import { Injectable } from "@angular/core";

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
        submittableGui.inputs = submittableGui.inputs.concat(inputs);
      }
    }
    return submittableGui;
  }

  updateFormValues(values: any, stepIndex = this.stepIndex - 1): void {
    let gui = this.state[stepIndex];
    gui.inputs.forEach(input => {
      Object.keys(values).forEach(key => {
        if (input.name === key) {
          if (input instanceof SubmittableInput) {
            input.value = values[key];
          } else {
            input = new Input({name: key, value: values[key]} as Input);
          }
        }
      });
    });
  }

  toString(): string {
    return btoa(JSON.stringify(this.convert()));
  }
}
