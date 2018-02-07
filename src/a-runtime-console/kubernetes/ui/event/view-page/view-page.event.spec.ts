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
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { EventViewToolbarComponent } from '../view-toolbar/view-toolbar.event.component';
import { EventViewWrapperComponent } from '../view-wrapper/view-wrapper.event.component';
import { EventViewComponent } from '../view/view.event.component';
import { TestAppModule } from './../../../../app.test.module';
import { EventViewPage } from './view-page.event.component';

describe('EventViewPage', () => {
  let event: EventViewPage;
  let fixture: ComponentFixture<EventViewPage>;

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
          TestAppModule
        ],
        declarations: [
          EventViewPage,
          EventViewWrapperComponent,
          EventViewToolbarComponent,
          EventViewComponent
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
    fixture = TestBed.createComponent(EventViewPage);
    event = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(event).toBeTruthy(); });
});
