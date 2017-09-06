export class Gui {
  metadata: MetaData;
  state: State = new State();
  inputs: SubmittableInput[];
  private _messages: Message[];
  results: Result[];
  stepIndex: number;

  get messages(): Message[] {
    if (!this._messages) {
      this._messages = [];
    }
    return this._messages;
  }
  set messages(messages: Message[]) {
    this._messages = messages;
  }
}

export class MetaData {
  category: string;
  name: string;
  description: string;
  deprecated: boolean;
  intro: string;
}

export class State {
  valid: boolean;
  canExecute: boolean;
  canMoveToNextStep: boolean;
  canMoveToPreviousStep: boolean;
  wizard: boolean;
  steps: string[];
}

export class SubmittableInput {
  name: string;
  value: any;

  constructor(input?: SubmittableInput) {
    if (input) {
      this.name = input.name;
      this.value = input.value;
    }
  }
}

export class Input extends SubmittableInput {
  shortName: string;
  label: string;
  valueType: string;
  valueChoices: Option[];
  inputType: string;
  enabled: boolean;
  required: boolean;
  deprecated: boolean;
  class: string;
}

export class Option {
  id: string;
  description: string;
  name: string;
}

export class DownloadFile {
  filename: string;
  binary: Blob;
}

export class Result {
  message: string;
  status: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class StatusResult {
  uuid_link: string;
}

export class StatusEvent {
  messageKey: string;
  data: Map<string, any>;
}

export class StatusMessage {
  messageKey: string;
  message: string;
  data: any;
  done: boolean;

  constructor(messageKey: string, message: string) {
    this.messageKey = messageKey;
    this.message = message;
  }
}

export class Message {
  constructor(desciption: string) {
    this.description = desciption;
  }
  description: string;
  input: string;
  severity: string;
  showError: boolean;
}

export class Version {
  forgeVersion: string;
  backendVersion: string;
}

export enum Error {
  ERROR, WARN, INFO
}
