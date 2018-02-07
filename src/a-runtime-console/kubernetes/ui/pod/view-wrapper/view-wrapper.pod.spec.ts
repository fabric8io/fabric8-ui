/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { RestangularModule } from 'ng2-restangular';
import { ModalModule } from 'ngx-modal';
import { Fabric8CommonModule } from '../../../../common/common.module';
import { KubernetesComponentsModule } from '../../../components/components.module';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { PodDeleteDialog } from '../delete-dialog/delete-dialog.pod.component';
import { PodViewToolbarComponent } from '../view-toolbar/view-toolbar.pod.component';
import { PodViewComponent } from '../view/view.pod.component';
import { TestAppModule } from './../../../../app.test.module';
import { PodViewWrapperComponent } from './view-wrapper.pod.component';

describe('PodViewWrapperComponent', () => {
  let pod: PodViewWrapperComponent;
  let fixture: ComponentFixture<PodViewWrapperComponent>;

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
          KubernetesComponentsModule,
          TestAppModule
        ],
        declarations: [
          PodViewWrapperComponent,
          PodViewToolbarComponent,
          PodViewComponent,
          PodDeleteDialog
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
    fixture = TestBed.createComponent(PodViewWrapperComponent);
    pod = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(pod).toBeTruthy(); });
});
