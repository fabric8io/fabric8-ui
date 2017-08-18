import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {StackLevelComponent} from './stack-level.component';
import {TriggerFilterComponent} from '../utils/trigger-filter/trigger-filter.component';
import {ChartModule} from '../utils/chart/chart.module';

describe ('StackLevelComponent', () => {
    let component: StackLevelComponent;
    let fixture: ComponentFixture<StackLevelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ChartModule
            ],
            declarations: [
                StackLevelComponent,
                TriggerFilterComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StackLevelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
