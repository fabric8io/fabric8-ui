/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RestangularModule } from 'ng2-restangular';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { DeploymentEditToolbarComponent } from '../edit-toolbar/edit-toolbar.deployment.component';
import { DeploymentEditWrapperComponent } from '../edit-wrapper/edit-wrapper.deployment.component';
import { DeploymentEditComponent } from '../edit/edit.deployment.component';
import { TestAppModule } from './../../../../app.test.module';
import { DeploymentEditPage } from './edit-page.deployment.component';


describe('DeploymentEditPage', () => {
  let deployment: DeploymentEditPage;
  let fixture: ComponentFixture<DeploymentEditPage>;

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
          DeploymentEditPage,
          DeploymentEditWrapperComponent,
          DeploymentEditToolbarComponent,
          DeploymentEditComponent
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
    fixture = TestBed.createComponent(DeploymentEditPage);
    deployment = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(deployment).toBeTruthy(); });
});
