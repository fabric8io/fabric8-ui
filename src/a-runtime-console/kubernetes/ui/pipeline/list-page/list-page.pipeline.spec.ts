import { StageTimePipe } from './../build-stage-view/stage-time.pipe';
import { StackDetailsModule } from 'fabric8-stack-analysis-ui';
import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBackend } from "@angular/http/testing";
import { RequestOptions, BaseRequestOptions, Http } from "@angular/http";
import { RestangularModule } from "ng2-restangular";
import { PipelinesListPage } from "./list-page.pipeline.component";
import { PipelinesListComponent } from "../list/list.pipeline.component";
import { PipelinesListToolbarComponent } from "../list-toolbar/list-toolbar.pipeline.component";
import { Fabric8CommonModule } from "../../../../common/common.module";
import { KubernetesStoreModule } from "../../../kubernetes.store.module";
import { ModalModule } from "ngx-modal";
import { MomentModule } from "angular2-moment";
import { FormsModule } from "@angular/forms";
import { BuildConfigDialogsModule } from "../../buildconfig/delete-dialog/buildconfig.dialogs.module";
import { KubernetesComponentsModule } from "../../../components/components.module";
import { BuildStageViewComponent } from "../build-stage-view/build-stage-view.component";
import {InputActionDialog} from "../input-action-dialog/input-action-dialog.component";

describe('PipelinesListPage', () => {
  let component: PipelinesListPage;
  let fixture: ComponentFixture<PipelinesListPage>;

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
        StackDetailsModule,
      ],
      declarations: [
        BuildStageViewComponent,
        InputActionDialog,
        PipelinesListPage,
        PipelinesListComponent,
        PipelinesListToolbarComponent,
        StageTimePipe,
      ],
      providers: [
        MockBackend,
        { provide: RequestOptions, useClass: BaseRequestOptions },
        {
          provide: Http, useFactory: (backend, options) => {
            return new Http(backend, options);
          }, deps: [MockBackend, RequestOptions],
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
