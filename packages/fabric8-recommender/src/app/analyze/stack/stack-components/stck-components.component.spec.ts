/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';


import { StackComponents } from './stack-components.component';
import { TableFilter } from './table-filter.pipe';
import { TableOrderByPipe } from './table-orderby.pipe';

describe('StackComponentsComponent', () => {
    let component: StackComponents;
    let fixture: ComponentFixture<StackComponents>;

    beforeEach(async(() => {
        let fakeAuthService: any = {
            getToken: function () {
                return '';
            },
            isLoggedIn: function () {
                return true;
            }
        };
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpModule
            ],
            declarations: [StackComponents,
                TableFilter,
                TableOrderByPipe],
            providers: []
        })
            .compileComponents();
    }));

    it('Component has to be present', () => {
        fixture = TestBed.createComponent(StackComponents);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
