import { Component, Input, ViewChild } from '@angular/core';
import { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Deployments } from './../../../model/deployment.model';
import { ServiceService } from './../../../service/service.service';
import { SpaceStore } from './../../../store/space.store';

import { BehaviorSubject, ConnectableObservable, Observable, Subject } from 'rxjs';

import {
  IActionMapping,
  TREE_ACTIONS,
  TreeNode
} from 'angular2-tree-component';

import { ParentLinkFactory } from '../../../../common/parent-link-factory';
import { createDeploymentViews } from '../../../view/deployment.view';
import { KindNode } from '../list-page/list-page.environment.component';
import { DeploymentConfigs } from './../../../model/deploymentconfig.model';
import { Environment, Space } from './../../../model/space.model';
import { ConfigMapService } from './../../../service/configmap.service';
import { DeploymentService } from './../../../service/deployment.service';
import { DeploymentConfigService } from './../../../service/deploymentconfig.service';
import { EventService } from './../../../service/event.service';
import { PodService } from './../../../service/pod.service';
import { ReplicaSetService } from './../../../service/replicaset.service';
import { CompositeDeploymentStore } from './../../../store/compositedeployment.store';
import { ServiceStore } from './../../../store/service.store';

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
