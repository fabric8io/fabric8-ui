import { ResourceService, UsageSeverityEnvironmentStat } from './resource.service';

import { User, UserService } from 'ngx-login-client';
import { createMock } from 'testing/mock';

import { DeploymentApiService, EnvironmentStat } from '../../../space/create/deployments/services/deployment-api.service';

describe('ResourceService', (): void => {

  enum CLASSES {
    ICON_OK = 'pficon-ok',
    ICON_WARN = 'pficon-warning-triangle-o',
    ICON_ERR = 'pficon-error-circle-o'
  }

  const spaceId = 'mockSpaceId';
  const environmentName = 'mockEnvName';
  const applicationName = 'mockAppName';

  let svc: ResourceService;
  let deploymentsApiService: jasmine.SpyObj<DeploymentApiService>;
  let userService: jasmine.SpyObj<UserService>;
  let envStats: EnvironmentStat[];


  beforeEach((): void => {
    deploymentsApiService = createMock(DeploymentApiService);
    userService = createMock(UserService);

    userService.currentLoggedInUser = {attributes: {username: 'userName'}} as User & jasmine.Spy;

    let testEnvStat = {
      attributes: {
        name: 'test',
        quota: {
          cpucores: {
            used: 1,
            quota: 3
          },
          memory: {
            used: 5242880,
            quota: 5242880 * 2
          }
        }
      },
      id: 'fakeId',
      type: 'fakeType'
    } as EnvironmentStat;

    let otherEnvStat = {
      attributes: {
        name: 'fakeName',
        quota: {
          cpucores: {
            used: 1,
            quota: 3
          },
          memory: {
            used: 5242880,
            quota: 5242880 * 2
          }
        }
      },
      id: 'fakeId',
      type: 'fakeType'
    } as EnvironmentStat;

    envStats = [otherEnvStat, testEnvStat];
    svc = new ResourceService(deploymentsApiService, userService);
  });

  it('should rename environments appropriately', (): void => {
    svc.renameEnvironment(envStats[0]);
    expect(envStats[0].attributes.name).toBe('userName/fakeName');

    svc.renameEnvironment(envStats[1]);
    expect(envStats[1].attributes.name).toBe('userName');
  });

  it('should scale an environments memory stat', () => {
    svc.scaleMemoryStat(envStats[0]);
    expect(envStats[0].attributes.quota.memory.used).toBe(5);
  });

  it('should package a class with the stat', () => {
    let packagedStat: UsageSeverityEnvironmentStat = svc.packageStatAndClass(envStats[0]);
    expect(packagedStat.hasOwnProperty('iconClass')).toBe(true);
    expect(packagedStat.hasOwnProperty('environmentStat')).toBe(true);
  });

  it('should compute the correct class based on cpu usage', () => {
    expect(svc.calculateEnvironmentStatusClass(0.3, 0.3)).toBe(CLASSES.ICON_OK);
    expect(svc.calculateEnvironmentStatusClass(0.6, 0.3)).toBe(CLASSES.ICON_WARN);
    expect(svc.calculateEnvironmentStatusClass(0.3, 0.6)).toBe(CLASSES.ICON_WARN);
    expect(svc.calculateEnvironmentStatusClass(0.3, 1)).toBe(CLASSES.ICON_ERR);
    expect(svc.calculateEnvironmentStatusClass(0.7, 1)).toBe(CLASSES.ICON_ERR);
    expect(svc.calculateEnvironmentStatusClass(1, 0.3)).toBe(CLASSES.ICON_ERR);
    expect(svc.calculateEnvironmentStatusClass(1, 0.7)).toBe(CLASSES.ICON_ERR);
    expect(svc.calculateEnvironmentStatusClass(1, 1)).toBe(CLASSES.ICON_ERR);
  });

  it('should sort environments by name', () => {
    let transformedEnvironments: UsageSeverityEnvironmentStat[] = svc.transformAndSortEnvironments(envStats);
    expect(transformedEnvironments[0].environmentStat.attributes.name).toBe('userName');
    expect(transformedEnvironments[1].environmentStat.attributes.name).toBe('userName/fakeName');
  });
});
