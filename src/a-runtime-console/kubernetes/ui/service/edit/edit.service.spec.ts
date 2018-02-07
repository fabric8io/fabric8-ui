/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ServiceEditComponent } from './edit.service.component';

describe('ServiceEditComponent', () => {
  let service: ServiceEditComponent;
  let fixture: ComponentFixture<ServiceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        ServiceEditComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceEditComponent);
    service = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
