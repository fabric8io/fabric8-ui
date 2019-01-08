import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgLetModule } from '../../shared/ng-let';
import { TooltipModule } from 'ngx-bootstrap';
import { ExportCsvComponent } from './export-csv.component';
import { SpaceQuery } from '../../models/space';
import { FilterService } from '../../services/filter.service';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { HttpClientService } from '../../shared/http-module/http.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { of } from 'rxjs';

describe('Export-CSV Component:', () => {
  let fixture: ComponentFixture<ExportCsvComponent>,
    component: ExportCsvComponent,
    activatedRoute: ActivatedRouteStub;

  function createComponent() {
    fixture = TestBed.createComponent(ExportCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
    });
  }

  beforeEach(() => {
    activatedRoute = new ActivatedRouteStub({ q: {} });
    activatedRoute.setQueryParams({ q: "(typegroup.name:'Work Items')" });
  });
  beforeEach(async(() => {
    const spaceQuery = {
      ...jasmine.createSpyObj('SpaceQuery', ['getCurrentSpace']),
      getCurrentSpace: of({ id: 'asdfg' }),
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, NgLetModule],
      declarations: [ExportCsvComponent],
      providers: [
        FilterService,
        HttpClientService,
        HttpClient,
        HttpHandler,
        { provide: SpaceQuery, useValue: spaceQuery },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: WIT_API_URL, useValue: 'http://mock/api' },
      ],
    }).compileComponents();
  }));

  it('should create', () => {
    createComponent();
    expect(component).toBeDefined();
  });

  it('should create value for href attribute', () => {
    const expectedoutput: string =
      'http://mock/apisearch/workitems/csv?filter[expression]=%7B%22%24AND%22%3A%5B%7B%22typegroup.name%22%3A%7B%22%24EQ%22%3A%22%27Work%20Items%27%22%7D%7D%2C%7B%22space%22%3A%7B%22%24EQ%22%3A%22asdfg%22%7D%7D%5D%7D';
    createComponent();
    let downloadLink: string = fixture.debugElement.nativeElement.querySelector('a').href;
    expect(downloadLink).toEqual(expectedoutput);
  });

  it('should create value for href attribute', (done) => {
    const expectedoutput: string =
      'http://mock/apisearch/workitems/csv?filter[expression]=%7B%22%24AND%22%3A%5B%7B%22typegroup.name%22%3A%7B%22%24EQ%22%3A%22%27Work%20Items%27%22%7D%7D%2C%7B%22space%22%3A%7B%22%24EQ%22%3A%22asdfg%22%7D%7D%5D%7D';
    createComponent();
    let downloadLink: string = fixture.debugElement.nativeElement.querySelector('a').href;
    expect(downloadLink).toEqual(expectedoutput);
    done();
  });

  it('disable the <a> tag when input property isDisabled set to true', () => {
    createComponent();
    let comp = fixture.componentInstance;
    comp.isDisabled = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a').classList.contains('disabled')).toBe(true);
  });

  it('<a> tag is clickable when input property isDisabled set to false', () => {
    createComponent();
    let comp = fixture.componentInstance;
    comp.isDisabled = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a').classList.contains('disabled')).toBe(false);
  });
});
