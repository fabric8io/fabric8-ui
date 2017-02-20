/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, NgForm } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

import { DataTableModule } from 'angular2-datatable';
import { ModalModule } from 'ngx-modal';
import { AuthenticationService } from 'ngx-login-client';
import { ContainerTogglerModule } from 'ngx-widgets';

import { Stack } from '../../../models/stack';
import { StackRecommendationModule } from '../stack-recommendation/stack-recommendation.module';
import { StackDetailsComponent } from './stack-details.component';

import { recommenderApiUrlProvider } from './../../../shared/recommender-api.provider';
import { ApiLocatorService } from './../../../shared/api-locator.service';
import { witApiUrlProvider } from './../../../shared/wit-api.provider';

describe('StackDetailsComponent', () => {
  let component: StackDetailsComponent;
  let fixture: ComponentFixture<StackDetailsComponent>;

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
      imports: [ContainerTogglerModule,
        DataTableModule,
        ModalModule,
        StackRecommendationModule,
        HttpModule,
        ReactiveFormsModule
      ],
      declarations: [StackDetailsComponent, NgForm],
      providers: [
        FormBuilder,
        {
          provide: AuthenticationService,
          useValue: fakeAuthService
        },
        witApiUrlProvider,
        recommenderApiUrlProvider,
        ApiLocatorService
      ]
    })
      .compileComponents();
  }));

  it('Component has to be present', () => {
    fixture = TestBed.createComponent(StackDetailsComponent);
    component = fixture.componentInstance;
    let stack: Stack = new Stack();
    stack.uuid = '2ec2749ef0711bad2112ef45c2a5ee47bd32a6e4';
    component.stack = stack;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
