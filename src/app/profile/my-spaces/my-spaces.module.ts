import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { InfiniteScrollModule } from 'ngx-widgets';
import { ListModule } from 'patternfly-ng';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ForgeWizardModule } from '../../space/forge-wizard/forge-wizard.module';
import { MySpacesComponent }     from './my-spaces.component';
import { MySpacesItemModule } from './my-spaces-item/my-spaces-item.module';
import { MySpacesItemActionsModule } from './my-spaces-item-actions/my-spaces-item-actions.module';
import { MySpacesItemHeadingModule } from './my-spaces-item-heading/my-spaces-item-heading.module';
import { MySpacesToolbarModule } from './my-spaces-toolbar/my-spaces-toolbar.module';
import { MySpacesRoutingModule } from './my-spaces-routing.module';
import { SpaceWizardModule } from '../../space/wizard/space-wizard.module';

@NgModule({
  imports: [
    CommonModule,
    Fabric8WitModule,
    ForgeWizardModule,
    InfiniteScrollModule,
    ListModule,
    ModalModule.forRoot(),
    MySpacesItemModule,
    MySpacesItemActionsModule,
    MySpacesItemHeadingModule,
    MySpacesToolbarModule,
    MySpacesRoutingModule,
    SpaceWizardModule
  ],
  declarations: [ MySpacesComponent ]
})
export class MySpacesModule {
  constructor(http: Http) {}
}
