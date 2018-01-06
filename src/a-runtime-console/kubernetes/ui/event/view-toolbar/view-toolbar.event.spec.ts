/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EventViewToolbarComponent } from './view-toolbar.event.component';

describe('EventViewToolbarComponent', () => {
  let event: EventViewToolbarComponent;
  let fixture: ComponentFixture<EventViewToolbarComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          imports: [
            RouterTestingModule.withRoutes([])
          ],
          declarations: [EventViewToolbarComponent]
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventViewToolbarComponent);
    event = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(event).toBeTruthy(); });
});
