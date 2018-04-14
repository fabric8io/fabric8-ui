import { TestBed } from '@angular/core/testing';

import {
  Subject
} from 'rxjs';

import {
  Config,
  HelperService,
  TokenProvider
} from 'ngx-forge';

import { FABRIC8_FORGE_API_URL } from 'app/shared/runtime-console/fabric8-ui-forge-api';
import { NewForgeConfig } from '../shared/new-forge.config';
import { AppLauncherProjectProgressService } from './app-launcher-project-progress.service';


function initTestBed() {
  TestBed.configureTestingModule({
    providers: [
        AppLauncherProjectProgressService,
        HelperService,
        TokenProvider,
        { provide: Config, useClass: NewForgeConfig },
        { provide: FABRIC8_FORGE_API_URL, useValue: 'url-here' }
    ]
  });
}

describe('Progress: AppLauncherProjectProgressService', () => {
  let helperService: HelperService;
  let appLauncherProjectProgressService: AppLauncherProjectProgressService;

  beforeEach(() => {
    initTestBed();
    appLauncherProjectProgressService = TestBed.get(AppLauncherProjectProgressService);
    let fakeWebSocket = () => {
        let socket = new WebSocket('wss://url');
        let msgEvntInit: MessageEventInit = {'data': 'socket data message'};
        let event = new MessageEvent('worker', msgEvntInit);
        spyOn(socket, 'onmessage').and.returnValue(event);
        return socket;
      };
    spyOn(appLauncherProjectProgressService, 'getProgress').and.returnValue(fakeWebSocket);
  });

  it('Get progress messages', () => {
    let socket = appLauncherProjectProgressService.getProgress('wss://url');
    socket.onmessage = (event: MessageEvent) => {
      expect(event.data).toEqual('socket data message');
    };
  });

});
