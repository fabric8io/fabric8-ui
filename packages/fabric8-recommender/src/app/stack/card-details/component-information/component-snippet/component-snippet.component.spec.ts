import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions } from '@angular/http';

import {
    MComponentInformation,
    MGithub,
    MOsio
} from '../../../models/ui.model';

import { ComponentSnippetComponent } from './component-snippet.component';

describe ('ComponentSnippetComponent', () => {
    let component: ComponentSnippetComponent;
    let fixture: ComponentFixture<ComponentSnippetComponent>;
    let element: HTMLElement;

    let view: string = 'split';
    let componentInformation: MComponentInformation = new MComponentInformation (
        'component',
        '1.3.2',
        '1.4.3',
        null,
        false,
        false,
        false,
        null,
        null,
        new MGithub(
            2,
            3,
            4,
            5,
            3,
            null
        ),
        new MOsio(
            3
        ),
        '',
        false,
        null,
        false,
        null,
        '',
        '',
        null
    );

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
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        component.component = componentInformation;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('check if the input received is of the type MComponentInformation', () => {
        expect(component.component instanceof MComponentInformation).toBeTruthy();
    });

    it('should have the class name as normal-version-box if the "view" is "split', () => {
        component.view = 'split';
        component.ngOnInit();
        fixture.detectChanges();
        let parent = element.querySelector('.analytics-snippet-information');
        let versionContainer = parent.querySelector('.component-version');
        expect(versionContainer.classList.contains('normal-version-box')).toBeTruthy();
    });

    it('should have the class name as small-version-box if the "view" is "normal', () => {
        component.view = 'normal';
        component.ngOnInit();
        fixture.detectChanges();
        let parent = element.querySelector('.analytics-snippet-information');
        let versionContainer = parent.querySelector('.component-version');
        expect(versionContainer.classList.contains('small-version-box')).toBeTruthy();
    });

    it('should have the current version in the text', () => {
        component.view = 'normal';
        component.ngOnInit();
        fixture.detectChanges();
        let parent = element.querySelector('.analytics-snippet-information');
        let versionContainer = parent.querySelector('.component-version');
        expect((<HTMLParagraphElement>versionContainer.children[0].children[1]).innerText).toBe(componentInformation.currentVersion);
    });

    it('should have the latest version in the text', () => {
        component.view = 'normal';
        component.ngOnInit();
        fixture.detectChanges();
        let parent = element.querySelector('.analytics-snippet-information');
        let versionContainer = parent.querySelector('.component-version');
        expect((<HTMLParagraphElement>versionContainer.children[1].children[1]).innerText).toBe(componentInformation.latestVersion);
    });

    //TODO improve coverage
});
