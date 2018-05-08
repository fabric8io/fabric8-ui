import { Component, Inject, ViewChild } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';

import { FABRIC8_FORGE_API_URL } from 'app/shared/runtime-console/fabric8-ui-forge-api';

import { Notification, Notifications, NotificationType } from 'ngx-base';
import { OnLogin } from '../../../../shared/onlogin.service';
import { Build, PendingInputAction } from '../../../model/build.model';
import { PipelineStage } from '../../../model/pipelinestage.model';
import { pathJoin } from '../../../model/utils';

@Component({
  selector: 'input-action-dialog',
  templateUrl: './input-action-dialog.component.html',
  styleUrls: ['./input-action-dialog.component.less']
})
export class InputActionDialog {
  build: Build = new Build();
  stage: PipelineStage = null;
  inputAction: PendingInputAction = new PendingInputAction();

  @ViewChild('inputModal') modal: any;

  constructor(private http: Http,
              private notifications: Notifications,
              private authService: AuthenticationService,
              @Inject(FABRIC8_FORGE_API_URL) private forgeApiUrl: string
  ) {
  }

  get messageLines(): string[] {
    let msg = this.inputAction.message || '';
    return msg.split('\n');
  }

  open() {
    console.log('opening the dialog for ' + this.build.name + ' on modal ' + this.modal);
    this.modal.open();
  }

  proceed() {
    console.log('Proceeding pipeline ' + this.build.name);
    this.checkIfJenkinsIsUpAndProceedURL();
  }

  abort() {
    console.log('Aborting pipeline ' + this.build.name);
    return this.invokeUrl(this.inputAction.abortUrl);
  }

  invokeUrl(url: string) {
    if (url) {
      if (url.startsWith('//')) {
        url = url.substring(1);
      }
      // lets replace URL which doesn't seem to work right ;)
      const postfix = '/wfapi/inputSubmit?inputId=Proceed';
      if (url.endsWith(postfix)) {
        url = url.substring(0, url.length - postfix.length) + '/input/Proceed/proceedEmpty';
      }

      let jenkinsNamespace = this.build.jenkinsNamespace;
      let forgeUrl = this.forgeApiUrl;
      if (!forgeUrl) {
        console.log('Warning no $FABRIC8_FORGE_API_URL environment variable!');
      } else if (!jenkinsNamespace) {
        console.log('Warning no jenkinsNamespace on the Build!');
      } else {
        url = pathJoin(forgeUrl, '/api/openshift/services/jenkins/', jenkinsNamespace, url);
        let token = this.authService.getToken();
        console.log('about to invoke ' + url);
        let options = new RequestOptions();
        let headers = new Headers();
        headers.set('Authorization', 'Bearer ' + token);
        options.headers = headers;
        let body = null;
        this.http.post(url, body, options).subscribe(res => {
          console.log('posting to url: ' + url + ' and returned response ' + res.status);
        });
      }
    }
    this.close();
  }

  close() {
    this.modal.close();
  }

  checkIfJenkinsIsUpAndProceedURL() {
    let url = 'https://jenkins.prod-preview.openshift.io';
    this.http.get(url)
      .subscribe((response) => {
        if (response.status == 200) {
          this.notifications.message({
            message: `Got ${response.status}, Jenkins is up and running...`,
            type: NotificationType.SUCCESS
          } as Notification);
          this.invokeUrl(this.inputAction.proceedUrl);
          return;
        } else if (response.status == 307 || response.status == 302) {
          this.notifications.message({
            message: `Got ${response.status}, Connecting to Jenkins...`,
            type: NotificationType.INFO
          } as Notification);
        } else if (response.status == 503) {
          this.notifications.message({
            message: `Got ${response.status}, Cluster resources capacity is full. waiting along...`,
            type: NotificationType.INFO
          } as Notification);
        } else if (response.status == 202) {
          this.notifications.message({
            message: `Got ${response.status}, Jenkins is currently idled. Please wait while we start it. waiting along...`,
            type: NotificationType.WARNING
          } as Notification);
        } else {
          this.notifications.message({
            message: `Got status ${response.status}`,
            type: NotificationType.DANGER
          } as Notification);
          return;
        }
        setTimeout (this.checkIfJenkinsIsUpAndProceedURL(), 10000);
      });
    this.close();
  }
}
