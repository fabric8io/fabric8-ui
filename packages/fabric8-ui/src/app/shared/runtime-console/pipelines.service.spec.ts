import { TestBed } from '@angular/core/testing';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { Observable, of as observableOf } from 'rxjs';
import {
  Build,
  BuildConfig,
  BuildConfigStore,
  Builds,
  BuildStore,
} from '../../../a-runtime-console/index';
import { Fabric8RuntimeConsoleService } from './fabric8-runtime-console.service';
import { PipelinesService } from './pipelines.service';

describe('Runtime Console Pipelines Service', () => {
  let service: PipelinesService;

  beforeEach(function(): void {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Contexts,
          useFactory: (): jasmine.SpyObj<Contexts> => {
            let mock: jasmine.SpyObj<Contexts> = jasmine.createSpyObj('Contexts', ['current']);
            let mockContext = {
              path: '/user/spOne',
            } as Context;
            mock.current.and.returnValue(mockContext);
            return mock;
          },
        },
        {
          provide: BuildConfigStore,
          useFactory: (): jasmine.SpyObj<BuildConfigStore> => {
            let mock: jasmine.SpyObj<BuildConfigStore> = jasmine.createSpyObj('BuildConfigStore', [
              'loadAll',
            ]);
            let items = [
              // The BuildConfig system contains a bug breaking type assertions
              // so there are no types in these mock items.
              {
                name: 'bcOne',
                statusPhase: 'Running',
                labels: {
                  space: 'spOne',
                },
                isPipeline: true,
              },
              {
                name: 'bcTwo',
                statusPhase: 'Complete',
                labels: {
                  space: 'spOne',
                },
                isPipeline: true,
              },
              {
                name: 'bcThree',
                statusPhase: 'Complete',
                labels: {
                  space: 'spTwo',
                },
                isPipeline: true,
              },
              {
                name: 'bcFour',
                statusPhase: 'Complete',
                labels: {
                  space: 'spTwo',
                },
                isPipeline: true,
              },
              {
                name: 'bcFive',
                statusPhase: 'Complete',
                labels: {
                  space: 'spTwo',
                },
                isPipeline: true,
              },
            ];

            mock.loadAll.and.returnValue(observableOf(items));
            return mock;
          },
        },
        {
          provide: BuildStore,
          useFactory: (): jasmine.SpyObj<BuildStore> => {
            let mock: jasmine.SpyObj<BuildStore> = jasmine.createSpyObj('BuildStore', ['loadAll']);
            let items: Builds = [
              {
                name: 'bOne',
                buildConfigName: 'bcOne',
              } as Build,
              {
                name: 'bTwo',
                buildConfigName: 'bcOne',
              } as Build,
            ];

            mock.loadAll.and.returnValue(observableOf(items));
            return mock;
          },
        },
        {
          provide: Fabric8RuntimeConsoleService,
          useFactory: (): jasmine.SpyObj<Fabric8RuntimeConsoleService> => {
            let mock: jasmine.SpyObj<Fabric8RuntimeConsoleService> = jasmine.createSpyObj(
              'Fabric8RuntimeConsoleService',
              ['loading'],
            );
            mock.loading.and.returnValue(observableOf(true));
            return mock;
          },
        },
        PipelinesService,
      ],
    });
    service = TestBed.get(PipelinesService);
  });

  describe('Current pipelines', () => {
    it('should show builds for the context space', function(): void {
      service.current.subscribe((buildConfigs: BuildConfig[]) => {
        expect(buildConfigs.length).toBe(2);
      });
    });
  });

  describe('Recent pipelines', () => {
    it('should show last four builds including completed builds', function(): void {
      service.recentPipelines.subscribe((buildConfigs: BuildConfig[]) => {
        expect(buildConfigs.length).toBe(4);
      });
    });
  });
});
