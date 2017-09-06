import { Gui, Input, SubmittableInput } from "./gui.model";
import { Injectable } from "@angular/core";

@Injectable()
export class History {
  private state: Gui[] = [];
  private ready: boolean;

  add(gui: Gui) {
    this.state.push(gui);
    gui.stepIndex = this.stepIndex;
  }

  done() {
    this.ready = true;
  }

  apply(state: string) {
    if (state == null) return;
    let submittableGui = JSON.parse(atob(state));
    if (submittableGui.inputs) {
      for (let input of submittableGui.inputs) {
        for (let gui of this.state) {
          for (let guiInput of gui.inputs) {
            if (guiInput.name === input.name) {
              guiInput.value = input.value;
            }
          }
        }
      }
    }
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
        let submittableInputs = History.convertToSubmittable(inputs as Input[]);
        submittableGui.inputs = submittableGui.inputs.concat(submittableInputs);
      }
    }
    return submittableGui;
  }

  private static convertToSubmittable(inputs: Input[]): SubmittableInput[] {
    let array: SubmittableInput[] = [];
    if (inputs) {
      for (let input of inputs) {
        array.push(new SubmittableInput(input));
      }
    }
    return array;
  }

  toString(): string {
    return btoa(JSON.stringify(this.convert()));
  }
}
