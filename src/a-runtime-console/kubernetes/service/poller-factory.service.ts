import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Poller } from "./poller";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class PollerFactory {

  constructor(
  ) {}

  newInstance<L>(pollListFactory: () => Observable<L>, dataStream: BehaviorSubject<any>) {
    return new Poller( pollListFactory, dataStream);
  }
}
