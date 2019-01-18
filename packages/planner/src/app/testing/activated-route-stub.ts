import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';

/**
 * An ActivateRoute test double with a `paramMap` `queryParams` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 * Use the `setQueryParams()` method to add the next `queryParams` value.
 */
export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();

  private querySubject = new ReplaySubject<Params>();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
    this.setQueryParams(initialParams);
  }

  /** The mock paramMap observable */
  readonly paramMap = this.subject.asObservable();

  readonly queryParams = this.querySubject.asObservable();

  /** Set the paramMap observables's next value */
  setQueryParams(params?: Params) {
    this.querySubject.next(params);
  }

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
  }
}
