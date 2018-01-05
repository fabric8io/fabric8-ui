import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBackend } from "@angular/http/testing";
import { RequestOptions, BaseRequestOptions, Http } from "@angular/http";
import { RestangularModule } from "ng2-restangular";
import { SpacesListPage } from "./list-page.space.component";
import { SpacesListComponent } from "../list/list.space.component";
import { SpacesListToolbarComponent } from "../list-toolbar/list-toolbar.space.component";
import { Fabric8CommonModule } from "../../../../common/common.module";
import { KubernetesStoreModule } from "../../../kubernetes.store.module";
import { ModalModule } from "ngx-modal";
import { MomentModule } from "angular2-moment";
import { SpaceDeleteDialog } from "../delete-dialog/delete-dialog.space.component";
import { FormsModule } from "@angular/forms";
import { KubernetesComponentsModule } from "../../../components/components.module";

describe('SpacesListPage', () => {
  let component: SpacesListPage;
  let fixture: ComponentFixture<SpacesListPage>;

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
        TestAppModule
      ],
      declarations: [
        SpacesListPage,
        SpacesListComponent,
        SpacesListToolbarComponent,
        SpaceDeleteDialog,
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
    fixture = TestBed.createComponent(SpacesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
