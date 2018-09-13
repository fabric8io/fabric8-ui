import {
  Injectable
} from '@angular/core';
import { UserService } from 'ngx-login-client';
import {
  Observable
} from 'rxjs';
import { map } from 'rxjs/operators';
import { ScaledMemoryStat } from '../../../space/create/deployments/models/scaled-memory-stat';
import { DeploymentApiService, EnvironmentStat } from '../../../space/create/deployments/services/deployment-api.service';

const FAKE_SPACE_ID = 'f461b06c-3833-11e8-b467-0ed5f89f718b';

enum CLASSES {
  ICON_OK = 'pficon-ok',
  ICON_WARN = 'pficon-warning-triangle-o',
  ICON_ERR = 'pficon-error-circle-o'
}

export declare interface UsageSeverityEnvironmentStat {
  environmentStat: EnvironmentStat;
  iconClass: string;
}

@Injectable()
export class ResourceService {

  constructor(
    private apiService: DeploymentApiService,
    private userService: UserService
  ) {}

  public getEnvironmentsWithScaleAndIcon(): Observable<UsageSeverityEnvironmentStat[]> {
    let envResponse: Observable<EnvironmentStat[]> = this.apiService.getEnvironments(FAKE_SPACE_ID);
    return envResponse.pipe(
      map((stats: EnvironmentStat[]) => this.transformAndSortEnvironments(stats))
    );
  }

  transformAndSortEnvironments(stats: EnvironmentStat[]): UsageSeverityEnvironmentStat[] {
    stats.sort(((a: EnvironmentStat, b: EnvironmentStat) => -1 * a.attributes.name.localeCompare(b.attributes.name)));

    stats.forEach((stat) => {
      this.scaleMemoryStat(stat);
      this.renameEnvironment(stat);
    });
    return stats.map((stat) => this.packageStatAndClass(stat));
  }

  renameEnvironment(envStat: EnvironmentStat) {
    let loggedInUser: string = this.userService.currentLoggedInUser.attributes.username;
    let curName = envStat.attributes.name;
    envStat.attributes.name = (curName === 'test') ? loggedInUser : loggedInUser + '/' + curName;
  }

  scaleMemoryStat(envStat: EnvironmentStat): void {
    let scaledStat: ScaledMemoryStat = new ScaledMemoryStat(
      envStat.attributes.quota.memory.used,
      envStat.attributes.quota.memory.quota
    );

    envStat.attributes.quota.memory = scaledStat;
  }

  packageStatAndClass(envStat: EnvironmentStat): UsageSeverityEnvironmentStat {
    let cpuQuota = envStat.attributes.quota.cpucores.used / envStat.attributes.quota.cpucores.quota;
    let memQuota = envStat.attributes.quota.memory.used / envStat.attributes.quota.memory.quota;
    let icon: string = this.calculateEnvironmentStatusClass(cpuQuota, memQuota);

    return {environmentStat: envStat, iconClass: icon} as UsageSeverityEnvironmentStat;
  }

  calculateEnvironmentStatusClass(cpuQuota: number, memQuota: number): string {
    let icon: string = CLASSES.ICON_OK;

    if (cpuQuota == 1 || memQuota == 1) {
      icon = CLASSES.ICON_ERR;
    } else if (cpuQuota >= .6 || memQuota >= .6) {
      icon = CLASSES.ICON_WARN;
    }

    return icon;
  }

}

