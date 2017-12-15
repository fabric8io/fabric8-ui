import { CodebasesItemHeadingComponent } from './codebases-item-heading.component';
import { Che } from '../services/che';
import { Broadcaster } from 'ngx-base';
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import {
  async,
  TestBed,
} from '@angular/core/testing';

describe('Codebases Item Heading Component', () => {
  let broadcasterMock: any;
  let fixture;

  beforeEach(() => {
    broadcasterMock = jasmine.createSpyObj('Broadcaster', ['on']);

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [CodebasesItemHeadingComponent],
      providers: [
        {
          provide: Broadcaster, useValue: broadcasterMock
        }
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(CodebasesItemHeadingComponent);
  });

  it('Che starting message', async(() => {
    let comp = fixture.componentInstance;
    comp.cheState = { running: false } as Che;
    fixture.detectChanges();

    expect(comp.getNotificationMessage()).toEqual(comp.cheStartingMessage);
  }));

  it('Che running message', async(() => {
    let comp = fixture.componentInstance;
    comp.cheState = { running: true } as Che;
    fixture.detectChanges();

    expect(comp.getNotificationMessage()).toEqual(comp.cheRunningMessage);
  }));

  it('Che performing multi-tenant migration message', async(() => {
    let comp = fixture.componentInstance;
    comp.cheState = { running: false, multiTenant: true } as Che;
    fixture.detectChanges();

    expect(comp.getNotificationMessage()).toEqual(comp.chePerformingMultiTenantMigrationMessage);
  }));

  it('Che finished multi-tenant migration message', async(() => {
    let comp = fixture.componentInstance;
    comp.cheState = { running: true, multiTenant: true } as Che;
    fixture.detectChanges();

    expect(comp.getNotificationMessage()).toEqual(comp.cheFinishedMultiTenantMigrationMessage);
  }));
});
