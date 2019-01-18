import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { BehaviorSubject, never as observableNever, Observable } from 'rxjs';
import { initContext, TestContext } from 'testing/test-context';
import { ApplicationsPipelineComponent } from './applications-pipeline.component';

@Component({
  template: '<fabric8-applications-pipeline></fabric8-applications-pipeline>',
})
class HostComponent {}

describe('ApplicationsPipelineComponent', () => {
  type TestingContext = TestContext<ApplicationsPipelineComponent, HostComponent>;

  let contexts: Contexts;

  let pipelineStage = {
    jenkinsInputURL: 'https://example.com/app1.git',
    name: 'Build Release',
    status: 'SUCCESS',
  };

  beforeEach(() => {
    contexts = {
      current: new BehaviorSubject<Context>({
        name: 'space',
        path: '/user/space',
        space: {
          attributes: {
            name: 'space',
          },
        },
      } as Context),
      recent: observableNever(),
      default: observableNever(),
    };
  });

  const testContext = initContext(
    ApplicationsPipelineComponent,
    HostComponent,
    {
      imports: [CommonModule],
      providers: [{ provide: Contexts, useFactory: () => contexts }],
    },
    (component: ApplicationsPipelineComponent): void => {
      component.stage = pipelineStage as any;
    },
  );

  describe('Applications pipeline with stage', () => {
    it('Pipeline stage should be set', function() {
      expect(testContext.testedDirective.stage as any).toEqual(pipelineStage);
    });

    it('Show line should be set', function() {
      expect(testContext.testedDirective.showLine).toBeTruthy();
    });
  });
});
