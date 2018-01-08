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
import { PipelinesHistoryToolbarComponent } from '../history-toolbar/history-toolbar.pipeline.component';
import { PipelinesHistoryComponent } from '../history/history.pipeline.component';
import { TestAppModule } from './../../../../app.test.module';
import { StageTimePipe } from './../build-stage-view/stage-time.pipe';
import { PipelinesHistoryPage } from './history-page.pipeline.component';

import { StackDetailsModule } from 'fabric8-stack-analysis-ui';
import { InputActionDialog } from '../input-action-dialog/input-action-dialog.component';

describe('PipelinesHistoryPage', () => {
  let component: PipelinesHistoryPage;
  let fixture: ComponentFixture<PipelinesHistoryPage>;

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
        PipelinesHistoryPage,
        PipelinesHistoryComponent,
        PipelinesHistoryToolbarComponent,
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
    fixture = TestBed.createComponent(PipelinesHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
