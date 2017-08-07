import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import {
  AppGeneratorService,
  FieldCollection,
  FieldWidgetClassificationOptions,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IAppGeneratorState,
  IField
} from '../contracts/app-generator-service';

/** mock app generator service */

@Injectable()
export class MockAppGeneratorService extends AppGeneratorService {
  static instanceCount: number = 1;

  constructor(loggerFactory: LoggerFactory) {
    super();
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, MockAppGeneratorService.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance...`);
  }

  getFields(options: IAppGeneratorRequest): Observable<IAppGeneratorResponse> {
    switch ( options.command.name ) {
      case 'first': {
        return getFirstFieldSet();
      }
      case 'second': {
        return getSecondFieldSet();
      }
      default: {
        return Observable.empty();
      }
    }
  }

  private log: ILoggerDelegate = () => {};

}

function getFirstFieldSet(): Observable<IAppGeneratorResponse> {
  return Observable.create((observer: Observer<IAppGeneratorResponse>) => {
    let items: IField[] =
      [
        {
          name: 'mock-f1',
          value: 'f1-value',
          display: {
            choices: [],
            description: 'f1-description',
            hasChoices: false,
            inputType: FieldWidgetClassificationOptions.SingleInput,
            label: 'label-f1',
            enabled: true,
            readonly: false,
            required: true,
            visible: true,
            index: 0
          }
        },
        {
          name: 'mock-f2',
          value: 'f2-value',
          display: {
            choices: [],
            description: 'f2-description',
            hasChoices: false,
            inputType: FieldWidgetClassificationOptions.SingleInput,
            label: 'label-f2',
            enabled: true,
            readonly: false,
            required: true,
            visible: true,
            index: 0
          }
        }
      ];
    let set = new FieldCollection(... items);
    observer.next({ payload: { state: {} as IAppGeneratorState, fields: set }  } as IAppGeneratorResponse);
    observer.complete();
  });
}
function getSecondFieldSet(): Observable<IAppGeneratorResponse> {
  return Observable.create((observer: Observer<IAppGeneratorResponse>) => {
    observer.next({
                    payload: {
                      state: {} as IAppGeneratorState,
                      fields: [
                        {
                          name: 'mock-f3',
                          value: 'f3-value',
                          display: {
                            choices: [],
                            description: 'f3-description',
                            hasChoices: false,
                            inputType: FieldWidgetClassificationOptions.SingleInput,
                            label: 'label-f3',
                            enabled: true,
                            required: true,
                            visible: true,
                            index: 0
                          }
                        },
                        {
                          name: 'mock-f4',
                          value: 'f4-value',
                          display: {
                            choices: [],
                            description: 'f4-description',
                            hasChoices: false,
                            inputType: FieldWidgetClassificationOptions.SingleInput,
                            label: 'label-f4',
                            enabled: true,
                            required: true,
                            visible: true,
                            index: 0
                          }
                        },
                        {
                          name: 'mock-f5',
                          value: 'f5-value',
                          display: {
                            choices: [],
                            description: 'f5-description',
                            hasChoices: false,
                            inputType: FieldWidgetClassificationOptions.SingleInput,
                            label: 'label-f5',
                            enabled: true,
                            required: true,
                            visible: true,
                            index: 0
                          }
                        }
                      ]
                    }
                  } as IAppGeneratorResponse);
    observer.complete();
  });
}
