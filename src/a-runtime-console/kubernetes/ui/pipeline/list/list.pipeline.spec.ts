import { StageTimePipe } from './../build-stage-view/stage-time.pipe';
import { StackDetailsModule } from 'fabric8-stack-analysis-ui';
import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {PipelinesListComponent} from "./list.pipeline.component";
import {Fabric8CommonModule} from "../../../../common/common.module";
import {RouterTestingModule} from "@angular/router/testing";
import {MomentModule} from "angular2-moment";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {ModalModule} from "ng2-modal";
import {FormsModule} from "@angular/forms";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {RestangularModule} from "ng2-restangular";
import {MockBackend} from "@angular/http/testing";
import {BuildConfigDialogsModule} from "../../buildconfig/delete-dialog/buildconfig.dialogs.module";
import {KubernetesComponentsModule} from "../../../components/components.module";
import {BuildStageViewComponent} from "../build-stage-view/build-stage-view.component";
import {InputActionDialog} from "../input-action-dialog/input-action-dialog.component";

describe('PipelinesListComponent', () => {
  let component: PipelinesListComponent;
  let fixture: ComponentFixture<PipelinesListComponent>;

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
        StackDetailsModule,
      ],
      declarations: [
        BuildStageViewComponent,
        InputActionDialog,
        PipelinesListComponent,
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
    fixture = TestBed.createComponent(PipelinesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
