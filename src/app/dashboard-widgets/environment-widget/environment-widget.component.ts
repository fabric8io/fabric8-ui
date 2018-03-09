import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Contexts, Spaces } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Rx';
import {
  ApplicationAttributesOverview,
  DeploymentsService
} from '../../../app/space/create/deployments/services/deployments.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-environment-widget',
  templateUrl: './environment-widget.component.html',
  styleUrls: ['./environment-widget.component.less'],
  providers: [DeploymentsService]
})
export class EnvironmentWidgetComponent implements OnInit {

  spaceId: Observable<string>;
  appInfos: Observable<ApplicationAttributesOverview[]>;
  contextPath: Observable<string>;

  constructor(private context: Contexts,
              private spaces: Spaces,
              private deploymentsService: DeploymentsService) {
    this.spaceId = this.spaces.current.first().map(space => space.id);
    // console.log('::LOADING....::');
  }

  ngOnInit() {
    this.spaceId.subscribe((spaceId: string) => {
      this.appInfos = this.deploymentsService.getAppsAndEnvironments(spaceId);
    });

    this.contextPath = this.context.current.map(context => context.path);
  }
}
