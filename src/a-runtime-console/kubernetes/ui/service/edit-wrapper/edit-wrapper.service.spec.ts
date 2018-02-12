/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { RestangularModule } from 'ng2-restangular';
import { ModalModule } from 'ngx-modal';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { ServiceEditToolbarComponent } from '../edit-toolbar/edit-toolbar.service.component';
import { ServiceEditComponent } from '../edit/edit.service.component';
import { TestAppModule } from './../../../../app.test.module';
import { ServiceEditWrapperComponent } from './edit-wrapper.service.component';

describe('ServiceEditWrapperComponent', () => {
  let service: ServiceEditWrapperComponent;
  let fixture: ComponentFixture<ServiceEditWrapperComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          RestangularModule.forRoot(),
          FormsModule,
          MomentModule,
          ModalModule,
          KubernetesStoreModule,
          TestAppModule
        ],
        declarations: [
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
    fixture = TestBed.createComponent(ServiceEditWrapperComponent);
    service = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(service).toBeTruthy(); });
});
