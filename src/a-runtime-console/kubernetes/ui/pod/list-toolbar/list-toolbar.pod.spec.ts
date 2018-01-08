/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Fabric8CommonModule } from '../../../../common/common.module';
import { PodsListToolbarComponent } from './list-toolbar.pod.component';

describe('PodsListToolbarComponent', () => {
  let component: PodsListToolbarComponent;
  let fixture: ComponentFixture<PodsListToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        Fabric8CommonModule
      ],
      declarations: [PodsListToolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodsListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
