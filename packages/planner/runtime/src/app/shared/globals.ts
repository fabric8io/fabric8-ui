import { Observable } from 'rxjs/Observable';

export class GlobalSettings {
  private mode: boolean = true;

  constructor() {
    this.mode = process.env.ENV == 'inmemory';
  }

  public isTestmode() {
    return this.mode;
  }
}
