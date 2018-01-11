import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions } from '@angular/http';

import { ComponentSnippetComponent } from './component-snippet.component';

describe ('ComponentSnippetComponent', () => {
    let component: ComponentSnippetComponent;
    let fixture: ComponentFixture<ComponentSnippetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ComponentSnippetComponent
            ],
            providers: [
                Http,
                ConnectionBackend,
                { provide: RequestOptions, useClass: BaseRequestOptions }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComponentSnippetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
