import { StageTimePipe } from './../build-stage-view/stage-time.pipe';
import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBackend } from "@angular/http/testing";
import { RequestOptions, BaseRequestOptions, Http } from "@angular/http";
import { RestangularModule } from "ng2-restangular";
import { PipelineViewWrapperComponent } from "./view-wrapper.pipeline.component";
import { PipelineViewToolbarComponent } from "../view-toolbar/view-toolbar.pipeline.component";
import { PipelineViewComponent } from "../view/view.pipeline.component";
import { MomentModule } from "angular2-moment";
import { ModalModule } from "ngx-modal";
import { FormsModule } from "@angular/forms";
import { KubernetesStoreModule } from "../../../kubernetes.store.module";
import { Fabric8CommonModule } from "../../../../common/common.module";
import { BuildConfigDialogsModule } from "../../buildconfig/delete-dialog/buildconfig.dialogs.module";

describe('PipelineViewWrapperComponent', () => {
  let pipeline: PipelineViewWrapperComponent;
  let fixture: ComponentFixture<PipelineViewWrapperComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          Fabric8CommonModule,
          FormsModule,
          MomentModule,
          ModalModule,
          RouterTestingModule.withRoutes([]),
          RestangularModule.forRoot(),
          KubernetesStoreModule,
          BuildConfigDialogsModule,
          TestAppModule
        ],
        declarations: [
          PipelineViewWrapperComponent,
          PipelineViewToolbarComponent,
          PipelineViewComponent,
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
    fixture = TestBed.createComponent(PipelineViewWrapperComponent);
    pipeline = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(pipeline).toBeTruthy(); });
});
