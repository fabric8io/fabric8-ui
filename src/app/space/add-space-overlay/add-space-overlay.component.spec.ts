import { CommonModule } from '@angular/common';
import { DebugNode } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from 'a-runtime-console/models/user';
import { Broadcaster, Notifications } from 'ngx-base';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Fabric8WitModule, SpaceNameModule } from 'ngx-fabric8-wit';
import { SpaceService  } from 'ngx-fabric8-wit';
import { UniqueSpaceNameValidatorDirective  } from 'ngx-fabric8-wit/spaces/unique-space-name.directive';
import { ValidSpaceNameValidatorDirective  } from 'ngx-fabric8-wit/spaces/valid-space-name.directive';
import { UserService } from 'ngx-login-client';
import { ConnectableObservable, of as observableOf, Subscription, throwError } from 'rxjs';
import { SpaceNamespaceService } from '../../shared/runtime-console/space-namespace.service';
import { AddSpaceOverlayComponent } from './add-space-overlay.component';
import { osioMocks } from './osio-data-structure-mocks';

describe('AddSpaceOverlayComponent', () => {

  let mockSpaceService: any;
  let mockSpaceNamespaceService: any;
  let mockUserService: any;
  let mockNotifications: any;
  let mockRouter: any;
  let mockBroadcaster: any;

  let fixture: ComponentFixture<AddSpaceOverlayComponent>;
  let component: DebugNode['componentInstance'];

  beforeEach(() => {
    mockSpaceService = jasmine.createSpyObj('SpaceService', ['create', 'getSpaceByName']);
    mockSpaceNamespaceService = jasmine.createSpyObj('SpaceNamespaceService', ['updateConfigMap']);
    mockUserService = jasmine.createSpy('UserService');
    mockUserService.currentLoggedInUser = osioMocks.createUser();
    mockNotifications = jasmine.createSpyObj('Notifications', ['message']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockBroadcaster = jasmine.createSpyObj('Broadcaster', ['on', 'broadcast']);
    mockBroadcaster.on.and.returnValue(observableOf('dummy'));

    TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, Fabric8WitModule, SpaceNameModule, ModalModule.forRoot()],
      declarations: [AddSpaceOverlayComponent],
      providers: [
        { provide: SpaceService, useValue: mockSpaceService },
        { provide: SpaceNamespaceService, useValue: mockSpaceNamespaceService },
        { provide: UserService, useValue: mockUserService },
        { provide: Notifications, useValue: mockNotifications },
        { provide: Router, useValue: mockRouter },
        { provide: Broadcaster, useValue: mockBroadcaster }
      ]
    });

    fixture = TestBed.createComponent(AddSpaceOverlayComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  describe('page data mapping', () => {
    it('space name', () => {
      let nameElement = getNameElement();
      setValue(nameElement, 'space');

      expect(component.spaceName).toBe('space');
    });

    it('space description', () => {
      let descriptionElement = getDescriptionElement();
      setValue(descriptionElement, 'desc');

      expect(component.spaceDescription).toBe('desc');
    });
  });

  describe('page data validation', () => {
    beforeEach(() => {
      mockUserService.loggedInUser = observableOf(mockUserService.currentLoggedInUser) as ConnectableObservable<User>;
      mockSpaceService.getSpaceByName.and.returnValue(observableOf(null));
    });

    it('valid space name', fakeAsync(() => {
      let nameElement = getNameElement();
      setValue(nameElement, 'SpaceA');

      tick(5000);
      fixture.detectChanges();
      tick(5000);

      expect(component.spaceForm.valid).toBeTruthy();
      expect(getCreateSpaceButtonElement().disabled).toBeFalsy();
      expect(getNameErrorsElement()).toBeNull();
    }));

    it('empty space name', fakeAsync(() => {
      let nameElement = getNameElement();
      setValue(nameElement, ' ');

      tick(5000);
      fixture.detectChanges();
      tick(5000);
      tick(5000);

      expect(component.spaceForm.valid).toBeFalsy();
      expect(getCreateSpaceButtonElement().disabled).toBeTruthy();
      expect(getNameErrorsElement()).not.toBeNull();
      expect(getNameErrorsElement().textContent).toContain('Space Name is required to create a Space.');
    }));

    it('space name validators are called', fakeAsync(() => {
      let validSpaceNameEl = fixture.debugElement.query(By.directive(ValidSpaceNameValidatorDirective));
      let validSpaceNameInstance = validSpaceNameEl.injector.get(ValidSpaceNameValidatorDirective);
      spyOn(validSpaceNameInstance, 'validate');

      let uniqueSpaceNameEl = fixture.debugElement.query(By.directive(UniqueSpaceNameValidatorDirective));
      let uniqueSpaceNameInstance = uniqueSpaceNameEl.injector.get(UniqueSpaceNameValidatorDirective);
      spyOn(uniqueSpaceNameInstance, 'validate');

      let nameElement = getNameElement();
      setValue(nameElement, 'space a***0---__');

      tick(5000);
      fixture.detectChanges();
      tick(5000);

      expect(component.spaceForm.valid).toBeFalsy();
      expect(validSpaceNameInstance.validate).toBeCalled();
      expect(uniqueSpaceNameInstance.validate).toBeCalled();
      expect(getCreateSpaceButtonElement().disabled).toBeTruthy();
    }));
  });

  describe('page actions mapping', () => {

    it('create space and exit button', () => {
      mockSpaceService.create.and.returnValue(observableOf(osioMocks.createSpace()));
      mockSpaceNamespaceService.updateConfigMap.and.returnValue(observableOf({}));

      spyOn(component, 'createSpace');

      let button: any = getCreateSpaceAndExitButtonElement();
      click(button);

      expect(component.createSpace).toBeCalledWith(false);
    });

    it('create space and continue button', () => {
      mockSpaceService.create.and.returnValue(observableOf(osioMocks.createSpace()));
      mockSpaceNamespaceService.updateConfigMap.and.returnValue(observableOf({}));

      spyOn(component, 'createSpace');

      let button: any = getCreateSpaceButtonElement();
      click(button);

      expect(component.createSpace).toBeCalledWith(true);
    });

    it('cancel button', () => {
      let broadcastArgument: any[] = [];
      mockBroadcaster.broadcast.and.callFake(function() {
        broadcastArgument.push([arguments[0], arguments[1]]);
      });

      spyOn(component, 'createSpace');
      spyOn(component.spaceForm, 'reset');

      let button = getCancelButtonElement();
      click(button);

      cancelFlowExpectations();

      expect(broadcastArgument[0][0]).toBe('showAddSpaceOverlay');
      expect(broadcastArgument[0][1]).toBe(false);

      expect(component.createSpace).not.toBeCalled();
    });

    it('X cancel button', () => {
      let broadcastArgument: any[] = [];
      mockBroadcaster.broadcast.and.callFake(function() {
        broadcastArgument.push([arguments[0], arguments[1]]);
      });

      spyOn(component, 'createSpace');
      spyOn(component.spaceForm, 'reset');

      let button = getXCancelButtonElement();
      click(button);

      cancelFlowExpectations();

      expect(broadcastArgument[0][0]).toBe('showAddSpaceOverlay');
      expect(broadcastArgument[0][1]).toBe(false);

      expect(component.createSpace).not.toBeCalled();
    });
  });

  describe('#ngOnDestroy', () => {
    it('should unsubscribe subscriptions', () => {
      let s1: Subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      let s2: Subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);

      component.subscriptions.push(s1);
      component.subscriptions.push(s2);
      component.ngOnDestroy();

      expect(s1.unsubscribe).toBeCalled();
      expect(s2.unsubscribe).toBeCalled();
    });
  });

  describe('#createSpace', () => {

    beforeEach(() => {
      spyOn(component.spaceForm, 'reset');
    });

    it('should call create service with proper data', () => {
      testCreateSpace(true);
    });

    it('should call create service with proper data and exit if argument is false', () => {
      testCreateSpace(false);
    });

    function testCreateSpace(showAddAppOverlay: boolean) {
      component.spaceName = 'SpaceA';
      component.spaceDescription = 'DescriptionA';

      mockSpaceNamespaceService.updateConfigMap.and.callFake(function() {
        return observableOf({});
      });

      let createSpaceArgument: any;
      mockSpaceService.create.and.callFake(function() {
        createSpaceArgument = arguments[0];
        return observableOf(osioMocks.createSpace());
      });

      let navigateArgument: any;
      mockRouter.navigate.and.callFake(function() {
        navigateArgument = arguments[0];
      });

      let broadcastArgument: any[] = [];
      mockBroadcaster.broadcast.and.callFake(function() {
        broadcastArgument.push([arguments[0], arguments[1]]);
      });

      component.createSpace(showAddAppOverlay);
      fixture.detectChanges();

      successFlowExpectations();

      expect(createSpaceArgument.attributes.name).toBe('SpaceA');
      expect(createSpaceArgument.attributes.description).toBe('DescriptionA');
      expect(createSpaceArgument.relationships['owned-by'].data.id).toBe('mock-id');

      expect(navigateArgument[0]).toBe('mock-username');
      expect(navigateArgument[1]).toBe('mock-attribute');

      if (showAddAppOverlay) {
        expect(broadcastArgument[0][0]).toBe('showAddAppOverlay');
        expect(broadcastArgument[0][1]).toBe(true);
        expect(broadcastArgument[2][0]).toBe('showAddSpaceOverlay');
        expect(broadcastArgument[2][1]).toBe(false);
      } else {
        expect(broadcastArgument[0][0]).toBe('showAddSpaceOverlay');
        expect(broadcastArgument[0][1]).toBe(false);
      }
    }

    describe('should handle', () => {
      it('user is not set', () => {
        mockUserService.currentLoggedInUser = undefined;

        component.createSpace();

        errorFlowExpectations();
        expect(mockSpaceService.create).not.toBeCalled();
      });

      it('user id is not set', () => {
        mockUserService.currentLoggedInUser = {
          id: undefined,
          attributes: osioMocks.createUserProfile(),
          type: 'mock-type'
        };

        component.createSpace();

        errorFlowExpectations();
        expect(mockSpaceService.create).not.toBeCalled();
      });

      it('SpaceService#create throws error', () => {
        mockSpaceService.create.and.returnValue(throwError('Some error'));

        component.createSpace();

        errorFlowExpectations();
      });

      it('SpaceNamespaceService#updateConfigMap throws error', fakeAsync(() => {
        mockSpaceService.create.and.returnValue(observableOf(osioMocks.createSpace()));
        mockSpaceNamespaceService.updateConfigMap.and.returnValue(throwError('Some error'));

        component.createSpace();
        fixture.detectChanges();
        tick(5000);

        successFlowExpectations();
      }));
    });
  });

  function getElementByID(id: string): any {
    let debugElement = fixture.debugElement.query(By.css(`#${id}`));
    if (debugElement === null) {
      return null;
    }
    return debugElement.nativeElement;
  }

  function getNameElement(): HTMLInputElement {
    return getElementByID('add-space-overlay-name');
  }

  function getNameErrorsElement(): HTMLDivElement {
    return getElementByID('add-space-overlay-name-errors');
  }

  function getDescriptionElement(): HTMLInputElement {
    return getElementByID('add-space-overlay-description');
  }

  function getCreateSpaceButtonElement(): HTMLButtonElement {
    return getElementByID('createSpaceButton');
  }

  function getCreateSpaceAndExitButtonElement(): HTMLButtonElement {
    return getElementByID('createSpaceAndExitButton');
  }

  function getCancelButtonElement(): HTMLButtonElement {
    return getElementByID('cancelSpaceButton');
  }

  function getXCancelButtonElement(): HTMLButtonElement {
    return getElementByID('cancelSpaceButtonX');
  }

  function setValue(input: HTMLInputElement, value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function click(button: HTMLButtonElement): void {
    button.click();
    fixture.detectChanges();
  }

  function successFlowExpectations() {
    expect(mockSpaceService.create).toBeCalled();
    expect(mockSpaceNamespaceService.updateConfigMap).toBeCalled();
    expect(mockRouter.navigate).toBeCalled();
    expect(mockBroadcaster.broadcast).toBeCalled();

    expect(mockNotifications.message).not.toBeCalled();

    expect(component.canSubmit).toBeTruthy();
    expect(component.subscriptions.length).toBe(2);

    expect(component.spaceForm.reset).toBeCalled();
  }

  function errorFlowExpectations() {
    expect(mockNotifications.message).toBeCalled();

    expect(mockRouter.navigate).not.toBeCalled();
    expect(mockBroadcaster.broadcast).not.toBeCalled();

    expect(component.canSubmit).toBeTruthy();

    expect(component.spaceForm.reset).not.toBeCalled();
  }

  function cancelFlowExpectations() {
    expect(mockBroadcaster.broadcast).toBeCalled();

    expect(mockSpaceService.create).not.toBeCalled();
    expect(mockSpaceNamespaceService.updateConfigMap).not.toBeCalled();
    expect(mockRouter.navigate).not.toBeCalled();
    expect(mockNotifications.message).not.toBeCalled();
    expect(component.spaceForm.reset).toBeCalled();
  }
});
