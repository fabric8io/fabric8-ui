import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()
export class ModalService {
  private clientSource = new Subject<string>();
  private componentSource = new Subject<string[]>();
  private clientSource$ = this.clientSource.asObservable();
  private componentSource$ = this.componentSource.asObservable();

  constructor() {}

  public openModal(
    title: string,
    message: string,
    buttonText: string,
    actionKey?: string,
  ): Observable<string> {
    this.componentSource.next([title, message, buttonText, actionKey]);
    console.log('Opened modal dialog for key ' + actionKey);
    return this.clientSource$;
  }

  public doAction(actionKey: string) {
    console.log('Received confirm action for key ' + actionKey + ', sending to clients');
    this.clientSource.next(actionKey);
  }

  public getComponentObservable(): Observable<string[]> {
    return this.componentSource$;
  }
}
