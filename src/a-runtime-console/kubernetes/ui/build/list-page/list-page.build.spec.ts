import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockBackend} from "@angular/http/testing";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {RestangularModule} from "ng2-restangular";
import {BuildsListPage} from "./list-page.build.component";
import {BuildsListComponent} from "../list/list.build.component";
import {BuildsListToolbarComponent} from "../list-toolbar/list-toolbar.build.component";
import {Fabric8CommonModule} from "../../../../common/common.module";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {ModalModule} from "ng2-modal";
import {MomentModule} from "angular2-moment";
import {BuildDeleteDialog} from "../delete-dialog/delete-dialog.build.component";
import {FormsModule} from "@angular/forms";

describe('BuildsListPage', () => {
  let component: BuildsListPage;
  let fixture: ComponentFixture<BuildsListPage>;

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
        TestAppModule,
      ],
      declarations: [
        BuildsListPage,
        BuildsListComponent,
        BuildsListToolbarComponent,
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
    fixture = TestBed.createComponent(BuildsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
