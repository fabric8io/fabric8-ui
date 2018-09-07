import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MESSAGE_MAP } from './constants-mapper';

@Injectable()
export class GlobalConstants {
    constructor() { }

    /**
     * getMessages - gets the componentKey as a string and returns the Observable
     *
     * The component here is the key that enables to load the desired component.
     * For eg.) To load the messages for StackDetailsComponent,
     * call getMessages('stackDetails')
     *
     * The key mapping is found in constants-mapper.ts
     *
     * In case no match is found, it returns a null.
     */
    getMessages(component: string): Observable<any> {
        return Observable.create((observer) => {
            if (MESSAGE_MAP.hasOwnProperty(component)) {
                observer.next(MESSAGE_MAP[component]);
            } else {
                observer.next(null);
            }
            observer.complete();
        });
    }
}
