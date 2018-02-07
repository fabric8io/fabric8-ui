/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ConfigMapEditComponent } from './edit.configmap.component';

describe('ConfigMapEditComponent', () => {
  let configmap: ConfigMapEditComponent;
  let fixture: ComponentFixture<ConfigMapEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        ConfigMapEditComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigMapEditComponent);
    configmap = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(configmap).toBeTruthy();
  });
});
