import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'f8-app',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  public stackUrl: string;
  public apiData: any;
  public gateway: any = {};
  public label: string;
  public routerLink: string;
  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
        this.label = params.get('id');
    });

    window.onhashchange = () => {
        let url: string = location.hash;
        let id: string = url.replace('#/analyze/', '');
        let splitParams: Array<string> = id.split('?');
        this.label = splitParams[0];
        this.onAppLoad();
    };
  }

  onAppLoad(): void {
      let url: string = location.hash;
      let id: string = url.replace('#/analyze/', '');
      let splitParams: Array<string> = id.split('?');
      if (!this.label) {
          this.label = splitParams[0];
      }
      if (splitParams && splitParams.length > 1) {
          this.apiData = decodeURIComponent(splitParams[1].split('api_data=')[1]);
          try {
              this.apiData = JSON.parse(this.apiData);
          } catch (err) {
              console.log('Error parsing JSON');
          }
          if (this.apiData) {
              this.changeLabel();
          }
      }
  }

  changeLabel(): void {
      console.log(this.label);
      if (this.label && this.label.trim() !== '') {
          this.routerLink = '/analyze/' + this.label;
          // this.gateway['user_key'] = this.apiData['user_key'];
          this.gateway['access_token'] = this.apiData['access_token'];
          this.gateway['config'] = this.apiData['route_config'];

          // {
          //     "route_config": {
          //         "api_url": ""
          //     }
          // }
          // In case of 3 scale
          // {
          //     "route_config": {
          //         "api_url": "",
          //         "user_key": ""
          //     }
          // }
          if (this.gateway['config'] && this.gateway['config']['api_url']) {
              let apiHost: string = this.gateway['config']['api_url'];
              if (apiHost.charAt(apiHost.length - 1) !== '/') {
                  apiHost += '/';
                  this.gateway['config']['api_url'] = apiHost;
              }
              this.stackUrl = apiHost + 'api/v1/stack-analyses/' + this.label;
              console.log('=========================');
              console.log(this.gateway);
              console.log(this.stackUrl);
              console.log('=========================');
          }
      }
  }

  ngOnInit(): void {
      this.onAppLoad();
  }
}

// format of the url
// http://localhost:8088/#/analyze/4460cedfec3e49b5b6cf5712ccf7750b?api_data={
    // "access_token": "<ACCESS_TOKEN>",
    // "route_config": {
        // "api_url": "https://recommender.api.openshift.io/"
    // }
// }
