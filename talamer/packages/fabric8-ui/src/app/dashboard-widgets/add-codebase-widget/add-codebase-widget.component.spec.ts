import {
  Component,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { Broadcaster } from 'ngx-base';
import {
  Context,
  Contexts
} from 'ngx-fabric8-wit';
import { empty as observableEmpty,
  Observable,
  Subject
} from 'rxjs';
import { createMock } from 'testing/mock';
import { MockFeatureToggleComponent } from 'testing/mock-feature-toggle.component';
import {
  initContext,
  TestContext
} from 'testing/test-context';
import { Codebase } from '../../space/create/codebases/services/codebase';
import { CodebasesService } from '../../space/create/codebases/services/codebases.service';
import { LoadingWidgetModule } from '../loading-widget/loading-widget.module';
import { AddCodebaseWidgetComponent } from './add-codebase-widget.component';

@Component({
  template: '<fabric8-add-codebase-widget [userOwnsSpace]="userOwnsSpace"></fabric8-add-codebase-widget>'
})
class HostComponent {
  userOwnsSpace: boolean;
}

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
      recent: observableEmpty(),
      default: observableEmpty()
    } as Contexts;

    mockCodebasesService = createMock(CodebasesService);
    codebasesSubject = new Subject<Codebase[]>();
    mockCodebasesService.getCodebases.and.returnValue(codebasesSubject);
  });

  const testContext = initContext(AddCodebaseWidgetComponent, HostComponent, {
    declarations: [ MockFeatureToggleComponent ],
    imports: [ LoadingWidgetModule ],
    providers: [
      { provide: Broadcaster, useFactory: () => mockBroadcaster },
      { provide: Contexts, useFactory: () => mockContexts },
      { provide: CodebasesService, useFactory: () => mockCodebasesService }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  });

  it('should be instantiable', function() {
    expect(testContext.testedDirective).toBeTruthy();
  });

  it('should listen for codebaseAdded events', function() {
    expect(mockBroadcaster.on).toHaveBeenCalledWith('codebaseAdded');
  });

  it('should listen for codebaseDeleted events', function() {
    expect(mockBroadcaster.on).toHaveBeenCalledWith('codebaseDeleted');
  });

  it('should enable buttons if the user owns the space', function() {
    testContext.testedDirective.userOwnsSpace = true;
    testContext.testedDirective.loading = false;
    testContext.detectChanges();

    expect(testContext.fixture.debugElement.query(By.css('#test-add-codebase-circle-button'))).not.toBeNull();
    expect(testContext.fixture.debugElement.query(By.css('#test-add-codebase-button'))).not.toBeNull();
  });

  it('should disable buttons if the user does not own the space', function() {
    testContext.testedDirective.userOwnsSpace = false;
    testContext.testedDirective.loading = false;
    testContext.detectChanges();

    expect(testContext.fixture.debugElement.query(By.css('#test-add-codebase-circle-button'))).toBeNull();
    expect(testContext.fixture.debugElement.query(By.css('#test-add-codebase-button'))).toBeNull();
  });

  it('should listen for context space changes', function() {
    expect(testContext.testedDirective.context).toBeUndefined();
    expect(testContext.testedDirective.contextPath).toBeUndefined();

    const contextA: Context = {
      path: 'context-path',
        space: {
        id: 'space-id'
      }
    } as Context;
    contextSubject.next(contextA);
    expect(testContext.testedDirective.context).toEqual(contextA);
    expect(testContext.testedDirective.contextPath).toEqual(contextA.path);

    const contextB: Context = {
      path: 'context-path-2',
      space: {
        id: 'space-id-2'
      }
    } as Context;
    contextSubject.next(contextB);
    expect(testContext.testedDirective.context).toEqual(contextB);
    expect(testContext.testedDirective.contextPath).toEqual(contextB.path);
  });

  it('should add Codebase when codebaseAdded event observed', function() {
    expect(testContext.testedDirective.codebases).toEqual([]);

    const codebaseA: Codebase = {
      attributes: {
        url: 'git@github.com:fabric8-ui/fabric8-ui.git'
      },
      id: '1',
      name: 'fabric8-ui/fabric8-ui'
    } as Codebase;
    codebaseAddedSubject.next(codebaseA);
    expect(testContext.testedDirective.codebases).toEqual([codebaseA]);

    const codebaseB: Codebase = {
      attributes: {
        url: 'git@github.com:openshiftio/openshift.io.git'
      },
      id: '2',
      name: 'openshiftio/openshift.io'
    } as Codebase;
    codebaseAddedSubject.next(codebaseB);
    expect(testContext.testedDirective.codebases).toEqual([codebaseB, codebaseA]);
  });

  it('should remove Codebase when codebaseRemoved event observed', function() {
    expect(testContext.testedDirective.codebases).toEqual([]);

    const codebaseA: Codebase = {
      attributes: {
        url: 'git@github.com:fabric8-ui/fabric8-ui.git'
      },
      id: '1',
      name: 'fabric8-ui/fabric8-ui'
    } as Codebase;
    codebaseAddedSubject.next(codebaseA);
    expect(testContext.testedDirective.codebases).toEqual([codebaseA]);

    const codebaseB: Codebase = {
      attributes: {
        url: 'git@github.com:openshiftio/openshift.io.git'
      },
      id: '2',
      name: 'openshiftio/openshift.io'
    } as Codebase;
    codebaseAddedSubject.next(codebaseB);
    expect(testContext.testedDirective.codebases).toEqual([codebaseB, codebaseA]);

    codebaseDeletedSubject.next(codebaseA);
    expect(testContext.testedDirective.codebases).toEqual([codebaseB]);
  });

  it('should load Codebases from service when current context changes and contains a space', function() {
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
    expect(testContext.testedDirective.codebases).toEqual([]);
    codebasesSubject.next([uiCodebase, osioCodebase, witCodebase]);
    expect(testContext.testedDirective.codebases).toEqual([osioCodebase, uiCodebase, witCodebase]);

    expect(mockCodebasesService.getCodebases).toHaveBeenCalledTimes(1);
    const newContext: Context = {
      path: 'context-path'
    } as Context;
    contextSubject.next(newContext);
    expect(mockCodebasesService.getCodebases).toHaveBeenCalledTimes(1);
  });
});
