import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Http} from '@angular/http';
import {Contexts} from 'ngx-fabric8-wit';
import {ComponentLevelComponent} from './component-level.component';
import {EllipsisDirective} from '../utils/ellipsis.directive';
import {TableFilter} from '../utils/table-filter.pipe';
import {AddWorkFlowService} from '../stack-details/add-work-flow.service';

describe ('ComponentLevelComponent', () => {
    let component: ComponentLevelComponent;
    let fixture: ComponentFixture<ComponentLevelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ComponentLevelComponent,
                EllipsisDirective,
                TableFilter
            ],
            providers: [
                Http,
                AddWorkFlowService,
                Contexts
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComponentLevelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
