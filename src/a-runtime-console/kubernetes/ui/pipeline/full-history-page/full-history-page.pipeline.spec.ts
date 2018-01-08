/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { RestangularModule } from 'ng2-restangular';
import { ModalModule } from 'ngx-modal';
import { Fabric8CommonModule } from '../../../../common/common.module';
import { KubernetesComponentsModule } from '../../../components/components.module';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { BuildConfigDialogsModule } from '../../buildconfig/delete-dialog/buildconfig.dialogs.module';
import { BuildStageViewComponent } from '../build-stage-view/build-stage-view.component';
import { PipelinesFullHistoryToolbarComponent } from '../full-history-toolbar/full-history-toolbar.pipeline.component';
import { PipelinesFullHistoryComponent } from '../full-history/full-history.pipeline.component';
import { TestAppModule } from './../../../../app.test.module';
import { StageTimePipe } from './../build-stage-view/stage-time.pipe';
import { PipelinesFullHistoryPage } from './full-history-page.pipeline.component';

import { StackDetailsModule } from 'fabric8-stack-analysis-ui';
import { InputActionDialog } from '../input-action-dialog/input-action-dialog.component';

describe('PipelinesFullHistoryPage', () => {
  let component: PipelinesFullHistoryPage;
  let fixture: ComponentFixture<PipelinesFullHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        Fabric8CommonModule,
        RouterTestingModule.withRoutes([]),
        RestangularModule.forRoot(),
        FormsModule,
        MomentModule,
        ModalModule,
        KubernetesStoreModule,
        KubernetesComponentsModule,
        BuildConfigDialogsModule,
        TestAppModule,
        StackDetailsModule
      ],
      declarations: [
        BuildStageViewComponent,
        InputActionDialog,
        PipelinesFullHistoryPage,
        PipelinesFullHistoryComponent,
        PipelinesFullHistoryToolbarComponent,
        StageTimePipe
      ],
      providers: [
        MockBackend,
        { provide: RequestOptions, useClass: BaseRequestOptions },
        {
          provide: Http, useFactory: (backend, options) => {
            return new Http(backend, options);
          }, deps: [MockBackend, RequestOptions]
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinesFullHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
