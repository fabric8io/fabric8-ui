/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigMapViewToolbarComponent } from './view-toolbar.configmap.component';

describe('ConfigMapViewToolbarComponent', () => {
  let configmap: ConfigMapViewToolbarComponent;
  let fixture: ComponentFixture<ConfigMapViewToolbarComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          imports: [
            RouterTestingModule.withRoutes([])
          ],
          declarations: [ConfigMapViewToolbarComponent]
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigMapViewToolbarComponent);
    configmap = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(configmap).toBeTruthy(); });
});
