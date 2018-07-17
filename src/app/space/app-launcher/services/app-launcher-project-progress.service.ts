import { Injectable } from '@angular/core';

import {
  HelperService,
  ProjectProgressService
} from 'ngx-launcher';

@Injectable()
export class AppLauncherProjectProgressService implements ProjectProgressService {
  private END_POINT: string = '';

  constructor(private helperService: HelperService) {
    if (this.helperService) {
      this.END_POINT = this.helperService.getBackendUrl();
      this.END_POINT = this.END_POINT.split('/api')[0];
      if (this.END_POINT.indexOf('https') !== -1) {
        this.END_POINT = this.END_POINT.replace('https', 'wss');
      } else if (this.END_POINT.indexOf('http') !== -1) {
        this.END_POINT = this.END_POINT.replace('http', 'ws');
      }
    }
  }

  getProgress(uuidLink: string): WebSocket {
    const socket = new WebSocket(this.END_POINT + uuidLink);
    return socket;
  }
}
