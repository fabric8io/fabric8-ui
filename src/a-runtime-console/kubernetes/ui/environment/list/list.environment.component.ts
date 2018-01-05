import { ServiceService } from './../../../service/service.service';
import { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SpaceStore } from './../../../store/space.store';
import { Deployments } from './../../../model/deployment.model';
import { Component, Input, ViewChild } from "@angular/core";

import { Observable, ConnectableObservable, Subject, BehaviorSubject } from 'rxjs';

import {
  TreeNode,
  TREE_ACTIONS,
  IActionMapping
} from 'angular2-tree-component';

import { ParentLinkFactory } from "../../../../common/parent-link-factory";
import { CompositeDeploymentStore } from './../../../store/compositedeployment.store';
import { ServiceStore } from './../../../store/service.store';
import { createDeploymentViews } from '../../../view/deployment.view';
import { ReplicaSetService } from './../../../service/replicaset.service';
import { PodService } from './../../../service/pod.service';
import { EventService } from './../../../service/event.service';
import { ConfigMapService } from './../../../service/configmap.service';
import { DeploymentConfigService } from './../../../service/deploymentconfig.service';
import { DeploymentConfigs } from './../../../model/deploymentconfig.model';
import { DeploymentService } from './../../../service/deployment.service';
import { Space, Environment } from './../../../model/space.model';
import { KindNode } from "../list-page/list-page.environment.component";

@Component({
  selector: 'fabric8-environments-list',
  templateUrl: './list.environment.component.html',
  styleUrls: ['./list.environment.component.less']
})
export class EnvironmentListComponent {

  // See: https://angular2-tree.readme.io/docs/options
  options = {
    actionMapping: {
      mouse: {
        click: (tree, node, $event) => {
          TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        }
      }
    },
    allowDrag: false,
    isExpandedField: 'expanded'
  };

  parentLink: string;

  @Input() loading: boolean;
  @Input() environments: any;

  constructor(
    parentLinkFactory: ParentLinkFactory
  ) {
    this.parentLink = parentLinkFactory.parentLink;
  }


  selectTab(node: KindNode) {
    if (node) {
      node.ensureLoaded();
    }
  }
}
