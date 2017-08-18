import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ComponentLevelComponent} from './component-level.component';
import {EllipsisDirective} from '../utils/ellipsis.directive';
import {TableFilter} from '../utils/table-filter.pipe';

describe ('ComponentLevelComponent', () => {
    let component: ComponentLevelComponent;
    let fixture: ComponentFixture<ComponentLevelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ComponentLevelComponent,
                EllipsisDirective,
                TableFilter
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
