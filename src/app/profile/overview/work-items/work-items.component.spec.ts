import { Component, DebugElement, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { WorkItemService } from 'fabric8-planner';
import { List, take } from 'lodash';
import { Contexts, Space, SpaceNamePipe, Spaces, SpaceService, WIT_API_URL } from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { createMock } from 'testing/mock';
import { initContext, TestContext } from 'testing/test-context';
import { ContextService } from '../../../shared/context.service';
import { WorkItemsComponent } from './work-items.component';

@Component({
  template: '<alm-work-items></alm-work-items>'
})
class HostComponent {}

@Pipe({ name: 'take' })
class TakePipe implements PipeTransform {
  transform(arr: List<string>, n?: number): List<string> {
    return take(arr, n);
  }
}

describe('WorkItemsComponent', () => {
  type Context = TestContext<WorkItemsComponent, HostComponent>;
  const mockContext: any = {
    user: {
      attributes: {
        username: 'mock-username'
      },
      id: 'mock-user'
    }
  };

  const mockSpaces: any = [
    { name: 'mock-space-1', id: 'mock-space-id-1', attributes: { name: 'mock-space-1'} },
    { name: 'mock-space-2', id: 'mock-space-id-2', attributes: { name: 'mock-space-2'} },
    { name: 'mock-space-3', id: 'mock-space-id-3', attributes: { name: 'mock-space-3'} },
    { name: 'mock-space-4', id: 'mock-space-id-4', attributes: { name: 'mock-space-4'} },
    { name: 'mock-space-5', id: 'mock-space-id-5', attributes: { name: 'mock-space-5'} },
    { name: 'mock-space-6', id: 'mock-space-id-6', attributes: { name: 'mock-space-6'} },
    { name: 'mock-space-7', id: 'mock-space-id-7', attributes: { name: 'mock-space-7'} },
    { name: 'mock-space-8', id: 'mock-space-id-8', attributes: { name: 'mock-space-8'} },
    { name: 'mock-space-9', id: 'mock-space-id-9', attributes: { name: 'mock-space-9'} },
    { name: 'mock-space-10', id: 'mock-space-id-10', attributes: { name: 'mock-space-10'} },
    { name: 'mock-space-11', id: 'mock-space-id-11', attributes: { name: 'mock-space-11'} },
    { name: 'mock-space-12', id: 'mock-space-id-12', attributes: { name: 'mock-space-12'} },
    { name: 'mock-space-13', id: 'mock-space-id-13', attributes: { name: 'mock-space-13'} }
  ];

  const mockRecentSpaces: any = [
    { name: 'mock-space-1', id: 'mock-space-id-1', attributes: { name: 'mock-space-1'} },
    { name: 'mock-space-14', id: 'mock-space-id-14', attributes: { name: 'mock-space-14'} }
  ];

  initContext(WorkItemsComponent, HostComponent, {
    declarations: [SpaceNamePipe, TakePipe],
    imports: [HttpModule],
    providers: [
      { provide: Contexts, useFactory: () => {
          let mockContexts: any = createMock(Contexts);
          mockContexts.current = Observable.of(mockContext) as Observable<Context>;
          return mockContexts;
        }
      },
      { provide: Spaces, useFactory: () => {
          let mockSpacesService: any = createMock(Spaces);
          mockSpacesService.recent = Observable.of(mockRecentSpaces) as Observable<Space[]>;
          return mockSpacesService;
        }
      },
      { provide: SpaceService, useFactory: () => {
          let mockSpaceService: jasmine.SpyObj<SpaceService> = createMock(SpaceService);
          mockSpaceService.getSpacesByUser.and.returnValue(Observable.of(mockSpaces) as Observable<Space[]>);
          return mockSpaceService;
        }
      },
      { provide: WorkItemService, useFactory: () => {
          let mockWorkItemService: jasmine.SpyObj<WorkItemService> = createMock(WorkItemService);
          mockWorkItemService.getWorkItems.and.returnValue(Observable.of({ workItems: [] }) as Observable<{workItems}>);
          mockWorkItemService.buildUserIdMap.and.returnValue(Observable.of(mockContext.user) as Observable<User>);
          return mockWorkItemService;
        }
      },
      { provide: ContextService, useFactory: () => {
          let mockContextService: jasmine.SpyObj<ContextService> = createMock(ContextService);
          mockContextService.viewingOwnContext.and.returnValue(true);
          return mockContextService;
        }
      },
      { provide: WIT_API_URL, useValue: 'http://example.com' }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  });

  describe('Combobox', () => {
    it('should exist when > 0 spaces', function(this: Context) {
      let el: DebugElement = this.fixture.debugElement.query(By.css('.work-item-dropdown')).nativeElement;
      expect(el).toBeDefined();
    });

    it('should contain all the user\'s spaces and recent spaces', function(this: Context) {
      let de: DebugElement[] = this.fixture.debugElement.queryAll(By.css('option'));
      // Spaces duplicated in both user and recent should only exist once
      // default 'Select a space ..' message + 13 mock user spaces + 1 mock recent space +  = 15 options
      expect(de.length).toEqual(15);
      for (let i: number = 1; i < mockSpaces.length + 1; i++) {
        expect(de[i].nativeElement.textContent.trim()).toEqual(mockSpaces[i - 1].name);
      }

      expect(de[14].nativeElement.textContent.trim()).toEqual(mockRecentSpaces[1].name);
    });

    it('should limit the select size to 10 on a mousedown event', function(this: Context) {
      let select = this.fixture.debugElement.query(By.css('select'));
      expect(select.attributes['size']).toBeDefined();
      expect(select.attributes['onmousedown']).toContain('this.size=10');
    });

    it('should reset the select options size to 0 on change and blur', function(this: Context) {
      let select = this.fixture.debugElement.query(By.css('select'));
      expect(select.attributes['onchange']).toEqual('this.size=0;');
      expect(select.attributes['onblur']).toEqual('this.size=0;');
    });
  });

});
