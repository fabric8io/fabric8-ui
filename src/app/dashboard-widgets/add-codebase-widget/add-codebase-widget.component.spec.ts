import {
  Component,
  NO_ERRORS_SCHEMA
} from '@angular/core';

import {
  Observable,
  Subject
} from 'rxjs';

import { Broadcaster } from 'ngx-base';
import {
  Context,
  Contexts
} from 'ngx-fabric8-wit';

import { Codebase } from '../../space/create/codebases/services/codebase';
import { CodebasesService } from '../../space/create/codebases/services/codebases.service';
import { AddCodebaseWidgetComponent } from './add-codebase-widget.component';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

@Component({
  template: '<fabric8-add-codebase-widget></fabric8-add-codebase-widget>'
})
class HostComponent { }

describe('AddCodebaseWidgetComponent', () => {
  type TestingContext = TestContext<AddCodebaseWidgetComponent, HostComponent>;

  let mockBroadcaster: jasmine.SpyObj<Broadcaster>;
  let codebaseAddedSubject: Subject<Codebase>;
  let codebaseDeletedSubject: Subject<Codebase>;

  let mockContexts: Contexts;
  let contextSubject: Subject<Context>;

  let mockCodebasesService: jasmine.SpyObj<CodebasesService>;
  let codebasesSubject: Subject<Codebase[]>;

  beforeEach(() => {
    mockBroadcaster = createMock(Broadcaster);
    codebaseAddedSubject = new Subject<Codebase>();
    codebaseDeletedSubject = new Subject<Codebase>();
    mockBroadcaster.on.and.callFake((key: string): Observable<Codebase> => {
      if (key === 'codebaseAdded') {
        return codebaseAddedSubject;
      } else if (key === 'codebaseDeleted') {
        return codebaseDeletedSubject;
      } else {
        throw new Error(`Unknown broadcast key ${key}`);
      }
    });

    contextSubject = new Subject<Context>();
    mockContexts = {
      current: contextSubject,
      recent: Observable.empty(),
      default: Observable.empty()
    } as Contexts;

    mockCodebasesService = createMock(CodebasesService);
    codebasesSubject = new Subject<Codebase[]>();
    mockCodebasesService.getCodebases.and.returnValue(codebasesSubject);
  });

  initContext(AddCodebaseWidgetComponent, HostComponent, {
    providers: [
      { provide: Broadcaster, useFactory: () => mockBroadcaster },
      { provide: Contexts, useFactory: () => mockContexts },
      { provide: CodebasesService, useFactory: () => mockCodebasesService }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  });

  it('should be instantiable', function(this: TestingContext) {
    expect(this.testedDirective).toBeTruthy();
  });

  it('should listen for codebaseAdded events', function(this: TestingContext) {
    expect(mockBroadcaster.on).toHaveBeenCalledWith('codebaseAdded');
  });

  it('should listen for codebaseDeleted events', function(this: TestingContext) {
    expect(mockBroadcaster.on).toHaveBeenCalledWith('codebaseDeleted');
  });

  it('should listen for context space changes', function(this: TestingContext) {
    expect(this.testedDirective.context).toBeUndefined();
    expect(this.testedDirective.contextPath).toBeUndefined();

    const contextA: Context = {
      path: 'context-path',
        space: {
        id: 'space-id'
      }
    } as Context;
    contextSubject.next(contextA);
    expect(this.testedDirective.context).toEqual(contextA);
    expect(this.testedDirective.contextPath).toEqual(contextA.path);

    const contextB: Context = {
      path: 'context-path-2',
      space: {
        id: 'space-id-2'
      }
    } as Context;
    contextSubject.next(contextB);
    expect(this.testedDirective.context).toEqual(contextB);
    expect(this.testedDirective.contextPath).toEqual(contextB.path);
  });

  it('should add Codebase when codebaseAdded event observed', function(this: TestingContext) {
    expect(this.testedDirective.codebases).toEqual([]);

    const codebaseA: Codebase = {
      attributes: {
        url: 'git@github.com:fabric8-ui/fabric8-ui.git'
      },
      id: '1',
      name: 'fabric8-ui/fabric8-ui'
    } as Codebase;
    codebaseAddedSubject.next(codebaseA);
    expect(this.testedDirective.codebases).toEqual([codebaseA]);

    const codebaseB: Codebase = {
      attributes: {
        url: 'git@github.com:openshiftio/openshift.io.git'
      },
      id: '2',
      name: 'openshiftio/openshift.io'
    } as Codebase;
    codebaseAddedSubject.next(codebaseB);
    expect(this.testedDirective.codebases).toEqual([codebaseB, codebaseA]);
  });

  it('should remove Codebase when codebaseRemoved event observed', function(this: TestingContext) {
    expect(this.testedDirective.codebases).toEqual([]);

    const codebaseA: Codebase = {
      attributes: {
        url: 'git@github.com:fabric8-ui/fabric8-ui.git'
      },
      id: '1',
      name: 'fabric8-ui/fabric8-ui'
    } as Codebase;
    codebaseAddedSubject.next(codebaseA);
    expect(this.testedDirective.codebases).toEqual([codebaseA]);

    const codebaseB: Codebase = {
      attributes: {
        url: 'git@github.com:openshiftio/openshift.io.git'
      },
      id: '2',
      name: 'openshiftio/openshift.io'
    } as Codebase;
    codebaseAddedSubject.next(codebaseB);
    expect(this.testedDirective.codebases).toEqual([codebaseB, codebaseA]);

    codebaseDeletedSubject.next(codebaseA);
    expect(this.testedDirective.codebases).toEqual([codebaseB]);
  });

  it('should load Codebases from service when current context changes and contains a space', function(this: TestingContext) {
    const context: Context = {
      path: 'context-path',
        space: {
        id: 'space-id'
      }
    } as Context;
    contextSubject.next(context);
    expect(mockCodebasesService.getCodebases).toHaveBeenCalledWith('space-id');

    const uiCodebase: Codebase = {
      attributes: {
        url: 'git@github.com:fabric8-ui/fabric8-ui.git'
      },
      id: '1',
      name: 'fabric8-ui/fabric8-ui'
    } as Codebase;
    const osioCodebase: Codebase = {
      attributes: {
        url: 'git@github.com:openshiftio/openshift.io'
      },
      id: '2',
      name: 'openshiftio/openshift.io'
    } as Codebase;
    const witCodebase: Codebase = {
      attributes: {
        url: 'git@github.com:fabric8-services/fabric8-wit.git'
      },
      id: '3',
      name: 'fabric8-services/fabric8-wit'
    } as Codebase;
    expect(this.testedDirective.codebases).toEqual([]);
    codebasesSubject.next([uiCodebase, osioCodebase, witCodebase]);
    expect(this.testedDirective.codebases).toEqual([osioCodebase, uiCodebase, witCodebase]);

    expect(mockCodebasesService.getCodebases).toHaveBeenCalledTimes(1);
    const newContext: Context = {
      path: 'context-path'
    } as Context;
    contextSubject.next(newContext);
    expect(mockCodebasesService.getCodebases).toHaveBeenCalledTimes(1);
  });
});
