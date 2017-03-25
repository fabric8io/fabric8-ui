import { Injectable } from '@angular/core';

@Injectable()
export class AboutService {

  get buildNumber(): string {
    return process.env.BUILD_NUMBER;
  }

  get buildTimestamp(): string {
    return process.env.BUILD_TIMESTAMP;
  }

  get buildVersion(): string {
    return (process.env.BUILD_VERSION !== '0.0.0-development' ? process.env.BUILD_VERSION : null);
  }

}
