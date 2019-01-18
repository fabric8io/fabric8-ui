import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot, initTestScheduler } from 'jasmine-marbles';

import { Notifications } from 'ngx-base';
import { isObservable, Observable, of, throwError } from 'rxjs';
import * as Actions from '../actions/infotip.actions';
import { InfotipService } from '../services/infotip.service';
import { InfotipState } from '../states/infotip.state';
import { InfotipEffects } from './infotip.effects';
import { ErrorHandler } from './work-item-utils';

describe('InfotipEffects', () => {
  let effects: InfotipEffects;
  let actions: Observable<any>;
  let infotipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        InfotipEffects,
        provideMockActions(() => actions),
        {
          provide: InfotipService,
          useValue: jasmine.createSpyObj('infotipService', ['getInfotips']),
        },
        ErrorHandler,
        Notifications,
      ],
    });

    effects = TestBed.get(InfotipEffects);
    infotipService = TestBed.get(InfotipService);
    initTestScheduler();
  });

  it('should fetch infotips', () => {
    let payload: InfotipState = {
      '6cff4ab8-c380-4aa9-9980-17b6f223d181': {
        term: 'alternate dependency',
        en:
          'Dependencies recommended by OpenShift.io to replace restrictive licenses or usage outliers.',
      },
    };
    const action = new Actions.Get();
    const success = new Actions.GetSuccess(payload);

    infotipService.getInfotips.and.returnValue(of(payload));

    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: success });

    expect(isObservable(effects.getInfotips$)).toBeTruthy();
  });

  it('should dispatch an error action', () => {
    const action = new Actions.Get();
    const error = new Actions.GetError();

    infotipService.getInfotips.and.returnValue(throwError(new Error()));

    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: error });

    expect(isObservable(effects.getInfotips$)).toBeTruthy();
  });
});
