import { Injectable } from '@angular/core';
import { UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScaledMemoryStat } from '../../../space/create/deployments/models/scaled-memory-stat';
import {
  DeploymentApiService,
  EnvironmentStat,
} from '../../../space/create/deployments/services/deployment-api.service';

const FAKE_SPACE_ID = 'f461b06c-3833-11e8-b467-0ed5f89f718b';

enum CLASSES {
  ICON_OK = 'pficon-ok',
  ICON_WARN = 'pficon-warning-triangle-o',
  ICON_ERR = 'pficon-error-circle-o',
}

export interface UsageSeverityEnvironmentStat {
  environmentStat: EnvironmentStat;
  iconClass: string;
}

@Injectable()
export class ResourceService {
  private static readonly WARNING_THRESHOLD = 0.6;

  constructor(
    private readonly apiService: DeploymentApiService,
    private readonly userService: UserService,
  ) {}

  getEnvironmentsWithScaleAndIcon(): Observable<UsageSeverityEnvironmentStat[]> {
    const envResponse: Observable<EnvironmentStat[]> = this.apiService.getEnvironments(
      FAKE_SPACE_ID,
    );
    return envResponse.pipe(
      map(
        (stats: EnvironmentStat[]): UsageSeverityEnvironmentStat[] =>
          this.transformAndSortEnvironments(stats),
      ),
    );
  }

  transformAndSortEnvironments(stats: EnvironmentStat[]): UsageSeverityEnvironmentStat[] {
    stats.sort(
      (a: EnvironmentStat, b: EnvironmentStat): number =>
        -1 * a.attributes.name.localeCompare(b.attributes.name),
    );

    stats.forEach(
      (stat: EnvironmentStat): void => {
        this.scaleMemoryStat(stat);
        this.renameEnvironment(stat);
      },
    );
    return stats.map(
      (stat: EnvironmentStat): UsageSeverityEnvironmentStat => this.packageStatAndClass(stat),
    );
  }

  renameEnvironment(envStat: EnvironmentStat): void {
    const loggedInUser: string = this.userService.currentLoggedInUser.attributes.username;
    const curName: string = envStat.attributes.name;
    envStat.attributes.name = curName === 'test' ? loggedInUser : loggedInUser + '/' + curName;
  }

  scaleMemoryStat(envStat: EnvironmentStat): void {
    const scaledStat: ScaledMemoryStat = new ScaledMemoryStat(
      envStat.attributes.quota.memory.used,
      envStat.attributes.quota.memory.quota,
    );

    envStat.attributes.quota.memory = scaledStat;
  }

  packageStatAndClass(environmentStat: EnvironmentStat): UsageSeverityEnvironmentStat {
    const cpuQuota: number =
      environmentStat.attributes.quota.cpucores.used /
      environmentStat.attributes.quota.cpucores.quota;
    const memQuota: number =
      environmentStat.attributes.quota.memory.used / environmentStat.attributes.quota.memory.quota;
    const iconClass: string = this.calculateEnvironmentStatusClass(cpuQuota, memQuota);

    return { environmentStat, iconClass };
  }

  calculateEnvironmentStatusClass(cpuQuota: number, memQuota: number): string {
    let icon: string = CLASSES.ICON_OK;

    if (cpuQuota >= 1 || memQuota >= 1) {
      icon = CLASSES.ICON_ERR;
    } else if (
      cpuQuota >= ResourceService.WARNING_THRESHOLD ||
      memQuota >= ResourceService.WARNING_THRESHOLD
    ) {
      icon = CLASSES.ICON_WARN;
    }

    return icon;
  }
}
