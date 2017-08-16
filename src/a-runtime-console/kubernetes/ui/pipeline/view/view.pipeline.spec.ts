import { StageTimePipe } from './../build-stage-view/stage-time.pipe';
import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import {async, TestBed, ComponentFixture} from "@angular/core/testing";
import {PipelineViewComponent} from "./view.pipeline.component";
import {MomentModule} from "angular2-moment";
import {ModalModule} from "ngx-modal";
import {FormsModule} from "@angular/forms";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {RestangularModule} from "ng2-restangular";
import {RouterTestingModule} from "@angular/router/testing";
import {Fabric8CommonModule} from "../../../../common/common.module";
import {BuildConfigDialogsModule} from "../../buildconfig/delete-dialog/buildconfig.dialogs.module";

describe('PipelineViewComponent', () => {
  let pipeline: PipelineViewComponent;
  let fixture: ComponentFixture<PipelineViewComponent>;

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
          TestAppModule
        ],
        declarations: [
          PipelineViewComponent,
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
      },
    )
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineViewComponent);
    pipeline = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(pipeline).toBeTruthy();
  });
});
