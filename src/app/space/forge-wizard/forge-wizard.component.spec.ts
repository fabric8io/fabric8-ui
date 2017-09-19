import { CodebasesAddComponent } from './codebases-add.component';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Contexts } from 'ngx-fabric8-wit';
import { Broadcaster, Notifications } from 'ngx-base';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';
import { ForgeWizardComponent } from './forge-wizard.component';
import { ContextsMock } from '../create/codebases/services/github.service.mock';
import { ForgeService } from './forge.service';
import { AnalyzeOverviewComponent } from '../analyze/analyze-overview/analyze-overview.component';
import { CodebasesService } from '../create/codebases/services/codebases.service';
import { ContextService } from '../../shared/context.service';
import { Gui, State } from './gui.model';
import { By } from '@angular/platform-browser';
import { gui } from './forge.service.mock';

describe('Forge wizard component:', () => {

  let parentComponentMock: any;
  let codebasesServiceMock: any;
  let notificationMock: any;
  let contextsMock: any;
  let forgeServiceMock: any;
  let fixture;

  beforeEach(() => {
    codebasesServiceMock = jasmine.createSpyObj('CodebasesService', ['getCodebases', 'addCodebase']);
    contextsMock = jasmine.createSpy('Contexts');
    notificationMock = jasmine.createSpyObj('Notifications', ['message']);
    forgeServiceMock = jasmine.createSpyObj('ForgeService', ['loadGui']);
    parentComponentMock = jasmine.createSpy('AnalyzeOverviewComponent');

    TestBed.configureTestingModule({
      imports: [HttpModule],
      declarations: [ForgeWizardComponent],
      providers: [
        {
          provide: AnalyzeOverviewComponent, useValue: parentComponentMock
        },
        {
          provide: CodebasesService, useValue: codebasesServiceMock
        },
        {
          provide: ContextService, useClass: ContextsMock
        },
        {
          provide: Notifications, useValue: notificationMock
        },
        {
           provide: ForgeService, useValue: forgeServiceMock
        }
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    let p = new Promise<Gui>((resolve, reject) => {
      resolve(gui);
    });
    forgeServiceMock.loadGui.and.returnValue(p);
    fixture = TestBed.createComponent(ForgeWizardComponent);
  });

  it('Init component successfully', async(() => {
    // given
    const comp = fixture.componentInstance;
    spyOn(comp, 'move').and.callFake(function() {});
    const debug = fixture.debugElement;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(comp.history.state[0].inputs[0].name).toEqual('gitOrganisation');
      expect(comp.history.state[0].inputs[0].class).toEqual('UISelectOne');
      expect(comp.history.state[0].inputs[0].value).toEqual('corinnekrych');
    });
  }));
});


