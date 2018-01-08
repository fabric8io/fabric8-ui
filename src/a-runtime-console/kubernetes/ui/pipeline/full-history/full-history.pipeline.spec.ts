/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { RestangularModule } from 'ng2-restangular';
import { ModalModule } from 'ngx-modal';
import { TestAppModule } from '../../../../app.test.module';
import { Fabric8CommonModule } from '../../../../common/common.module';
import { KubernetesComponentsModule } from '../../../components/components.module';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { BuildConfigDialogsModule } from '../../buildconfig/delete-dialog/buildconfig.dialogs.module';
import { BuildStageViewComponent } from '../build-stage-view/build-stage-view.component';
import { StageTimePipe } from '../build-stage-view/stage-time.pipe';
import { PipelinesFullHistoryComponent } from './full-history.pipeline.component';

import { StackDetailsModule } from 'fabric8-stack-analysis-ui';
import { InputActionDialog } from '../input-action-dialog/input-action-dialog.component';

describe('PipelinesFullHistoryComponent', () => {
  let component: PipelinesFullHistoryComponent;
  let fixture: ComponentFixture<PipelinesFullHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        Fabric8CommonModule,
        FormsModule,
        MomentModule,
        ModalModule,
        RestangularModule.forRoot(),
        KubernetesStoreModule,
        BuildConfigDialogsModule,
        KubernetesComponentsModule,
        TestAppModule,
        StackDetailsModule
      ],
      declarations: [
        BuildStageViewComponent,
        InputActionDialog,
        PipelinesFullHistoryComponent,
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
    fixture = TestBed.createComponent(PipelinesFullHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
