import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ServiceEditToolbarComponent } from "./edit-toolbar.service.component";
import { MockBackend } from "@angular/http/testing";
import { RequestOptions, BaseRequestOptions, Http } from "@angular/http";
import { KubernetesStoreModule } from "../../../kubernetes.store.module";
import { RestangularModule } from "ng2-restangular";

describe('ServiceEditToolbarComponent', () => {
  let service: ServiceEditToolbarComponent;
  let fixture: ComponentFixture<ServiceEditToolbarComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          imports: [
            RouterTestingModule.withRoutes([]),
            RestangularModule.forRoot(),
            KubernetesStoreModule,
            TestAppModule
          ],
          declarations: [ServiceEditToolbarComponent],
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
    fixture = TestBed.createComponent(ServiceEditToolbarComponent);
    service = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(service).toBeTruthy(); });
});
