import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RedirectStatusComponent } from './redirect-status.component';

describe('Redirect Status Component', () => {
  let fixture: ComponentFixture<RedirectStatusComponent>;
  let routeMock: any;

  beforeEach(() => {
    routeMock = {
      snapshot: {
        params: {
          redirectType: '_verifyEmail'
        },
        queryParams: {
          status: 'fail',
          error: 'Some error'
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [ RouterTestingModule.withRoutes([]) ],
      declarations: [ RedirectStatusComponent ],
      providers: [
        {
          provide: ActivatedRoute, useValue: routeMock
        }
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(RedirectStatusComponent);
  });

  it('should verify redirect status and error message is set through activated route', async(() => {
    let comp = fixture.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(comp.redirectStatus).toBe('fail');
      expect(comp.redirectData.statusMessage).toBe('Some error');
    });
  }));
});
