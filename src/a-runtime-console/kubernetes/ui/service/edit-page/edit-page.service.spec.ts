/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RestangularModule } from 'ng2-restangular';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { ServiceEditToolbarComponent } from '../edit-toolbar/edit-toolbar.service.component';
import { ServiceEditWrapperComponent } from '../edit-wrapper/edit-wrapper.service.component';
import { ServiceEditComponent } from '../edit/edit.service.component';
import { TestAppModule } from './../../../../app.test.module';
import { ServiceEditPage } from './edit-page.service.component';


describe('ServiceEditPage', () => {
  let service: ServiceEditPage;
  let fixture: ComponentFixture<ServiceEditPage>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          RestangularModule.forRoot(),
          FormsModule,
          KubernetesStoreModule,
          TestAppModule
        ],
        declarations: [
          ServiceEditPage,
          ServiceEditWrapperComponent,
          ServiceEditToolbarComponent,
          ServiceEditComponent
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
    fixture = TestBed.createComponent(ServiceEditPage);
    service = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(service).toBeTruthy(); });
});
