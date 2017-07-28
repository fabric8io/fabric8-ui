import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {BuildsListComponent} from "./list.build.component";
import {Fabric8CommonModule} from "../../../../common/common.module";
import {RouterTestingModule} from "@angular/router/testing";
import {MomentModule} from "angular2-moment";
import {BuildDeleteDialog} from "../delete-dialog/delete-dialog.build.component";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {ModalModule} from "ng2-modal";
import {FormsModule} from "@angular/forms";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {RestangularModule} from "ng2-restangular";
import {MockBackend} from "@angular/http/testing";

describe('BuildsListComponent', () => {
  let component: BuildsListComponent;
  let fixture: ComponentFixture<BuildsListComponent>;

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
        TestAppModule
      ],
      declarations: [
        BuildsListComponent,
        BuildDeleteDialog,
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
    fixture = TestBed.createComponent(BuildsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
