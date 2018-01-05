/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ServiceEditComponent } from "./edit.service.component";
import { FormsModule } from "@angular/forms";

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
