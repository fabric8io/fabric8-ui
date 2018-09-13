import { CommonModule } from '@angular/common';
import {
  Component,
  Input
} from '@angular/core';
import {
  async,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Space, SpaceService } from 'ngx-fabric8-wit';
import { InfiniteScrollModule } from 'ngx-widgets';
import { Observable, of as observableOf,  throwError as observableThrowError } from 'rxjs';
import { first } from 'rxjs/operators';
import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';
import { MySpacesSearchSpacesDialog, ViewState } from './my-spaces-search-spaces-dialog.component';

@Component({
  template: '<my-spaces-search-spaces-dialog></my-spaces-search-spaces-dialog>'
})
class HostComponent { }

@Component({
  template: '',
  selector: 'my-spaces-search-spaces-dialog-space-item'
})
class MockSpaceItem {
  @Input() space: Space;
}

describe('MySpacesSearchSpacesDialog', () => {

  type TestingContext = TestContext<MySpacesSearchSpacesDialog, HostComponent>;
  initContext(MySpacesSearchSpacesDialog, HostComponent, {
    imports: [
      CommonModule,
      FormsModule,
      InfiniteScrollModule,
      ModalModule.forRoot()
    ],
    declarations: [ MockSpaceItem ],
    providers: [
      { provide: SpaceService, useFactory: (): jasmine.SpyObj<SpaceService> => createMock(SpaceService) }
    ]
  });

  it('should be instantiable', function(this: TestingContext): void {
    expect(this.testedDirective).toBeDefined();
  });

  describe('#init', () => {
    it('should set spaces list to empty array', function(this: TestingContext, done: DoneFn): void {
      this.testedDirective.spaces.pipe(
        first())
        .subscribe((spaces: Space[]): void => {
          expect(spaces).toEqual([]);
          done();
        });
    });

    it('should set totalCount to 0', function(this: TestingContext, done: DoneFn): void {
      this.testedDirective.totalCount.pipe(
        first())
        .subscribe((count: number): void => {
          expect(count).toEqual(0);
          done();
        });
    });

    it('should set view state to INIT', function(this: TestingContext, done: DoneFn): void {
      this.testedDirective.viewState.pipe(
        first())
        .subscribe((state: ViewState): void => {
          expect(state).toEqual(ViewState.INIT);
          done();
        });
    });

    it('should set search term to empty', function(this: TestingContext): void {
      expect(this.testedDirective.searchTerm).toBe('');
    });
  });

  describe('#clear', () => {
    beforeEach(async(function(this: TestingContext): void {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spaceService.search.and.returnValue(observableOf([
        { name: 'foo-space' }
      ]));
      spaceService.getTotalCount.and.returnValue(observableOf(1));
      this.testedDirective.searchTerm = 'mocksearch';
      this.testedDirective.search();
      this.testedDirective.initItems({ pageSize: 10 });
    }));

    it('should reset spaces list to empty array', function(this: TestingContext, done: DoneFn): void {
      this.testedDirective.spaces.pipe(
        first())
        .subscribe((spaces: Space[]): void => {
          expect(spaces).toEqual([{ name: 'foo-space' } as Space]);
          this.testedDirective.clear();
          this.testedDirective.spaces.pipe(
            first()
          ).subscribe((spaces: Space[]): void => {
            expect(spaces).toEqual([]);
            done();
          });
        });
    });

    it('should set totalCount to 0', function(this: TestingContext, done: DoneFn): void {
      this.testedDirective.totalCount.pipe(
        first())
        .subscribe((count: number): void => {
          expect(count).toEqual(1);
          this.testedDirective.clear();
          this.testedDirective.totalCount.pipe(
            first()
          ).subscribe((count: number): void => {
            expect(count).toEqual(0);
            done();
          });
        });
    });

    it('should set view state to INIT', function(this: TestingContext, done: DoneFn): void {
      this.testedDirective.viewState.pipe(
        first())
        .subscribe((state: ViewState): void => {
          expect(state).toEqual(ViewState.SHOW);
          this.testedDirective.clear();
          this.testedDirective.viewState.pipe(
            first()
          ).subscribe((state: ViewState): void => {
            expect(state).toEqual(ViewState.INIT);
            done();
          });
        });
    });

    it('should reset search term', function(this: TestingContext): void {
      expect(this.testedDirective.searchTerm).toEqual('mocksearch');
      this.testedDirective.clear();
      expect(this.testedDirective.searchTerm).toEqual('');
    });
  });

  describe('#initItems', () => {
    beforeEach(function(this: TestingContext): void {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spaceService.search.and.returnValue(observableOf([
        { name: 'foo-space' }
      ]));
      spaceService.getTotalCount.and.returnValue(observableOf(1));
      this.testedDirective.searchTerm = 'mocksearch';
    });

    it('should set page size', fakeAsync(function(this: TestingContext): void {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      const pageSize: number = 123;
      this.testedDirective.initItems({ pageSize });
      this.testedDirective.search();
      tick();
      this.testedDirective.spaces.pipe(
        first()
      ).subscribe(() => {
        expect(spaceService.search).toHaveBeenCalledWith(jasmine.any(String), pageSize);
      });
    }));

    it('should set view state to LOADING', fakeAsync(function(this: TestingContext): void {
      this.testedDirective.initItems({ pageSize: 10 });
      tick();
      this.testedDirective.viewState.pipe(
        first()
      ).subscribe((state: ViewState): void => {
        expect(state).toEqual(ViewState.LOADING);
      });
    }));
  });

  describe('#search', () => {
    beforeEach(function(this: TestingContext): void {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spaceService.search.and.returnValue(observableOf([
        { name: 'foo-space' }
      ]));
      spaceService.getTotalCount.and.returnValue(observableOf(456));
      this.testedDirective.searchTerm = ' mocksearch ';
    });

    it('should call SpaceService#search with trimmed search term', fakeAsync(function(this: TestingContext): void {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      expect(spaceService.search).not.toHaveBeenCalled();
      this.testedDirective.search();
      const pageSize: number = 123;
      this.testedDirective.initItems({ pageSize });
      tick();
      expect(spaceService.search).toHaveBeenCalledWith('mocksearch', pageSize);
    }));

    it('should call SpaceService#getTotalCount and update', fakeAsync(function(this: TestingContext): void {
      this.testedDirective.totalCount.pipe(
        first())
        .subscribe((count: number): void => {
          expect(count).toBe(0);
        });

      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      expect(spaceService.getTotalCount).not.toHaveBeenCalled();
      this.testedDirective.search();
      this.testedDirective.initItems({ pageSize: 123 });
      tick();
      expect(spaceService.getTotalCount).toHaveBeenCalled();

      this.testedDirective.totalCount.pipe(
        first()
      ).subscribe((count: number): void => {
        expect(count).toBe(456);
      });
    }));

    it('should set view state to SHOW when results are received', fakeAsync(function(this: TestingContext): void {
      this.testedDirective.viewState.pipe(
        first()
      ).subscribe((state: ViewState): void => {
        expect(state).toEqual(ViewState.INIT);
      });
      this.testedDirective.search();
      this.testedDirective.initItems({ pageSize: 123 });
      tick();
      this.testedDirective.viewState.pipe(
        first()
      ).subscribe((state: ViewState): void => {
        expect(state).toEqual(ViewState.SHOW);
      });
    }));

    it('should set view state to EMPTY when no results are received', fakeAsync(function(this: TestingContext): void {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spaceService.search.and.returnValue(observableOf([]));
      this.testedDirective.viewState.pipe(
        first()
      ).subscribe((state: ViewState): void => {
        expect(state).toEqual(ViewState.INIT);
      });
      this.testedDirective.search();
      this.testedDirective.initItems({ pageSize: 123 });
      tick();
      this.testedDirective.viewState.pipe(
        first()
      ).subscribe((state: ViewState): void => {
        expect(state).toEqual(ViewState.EMPTY);
      });
    }));

    it('should update spaces with received results', fakeAsync(function(this: TestingContext): void {
      this.testedDirective.spaces.pipe(
        first()
      ).subscribe((spaces: Space[]): void => {
        expect(spaces).toEqual([]);
      });
      this.testedDirective.search();
      this.testedDirective.initItems({ pageSize: 123 });
      tick();
      this.testedDirective.spaces.pipe(
        first()
      ).subscribe((spaces: Space[]): void => {
        expect(spaces).toEqual([ { name: 'foo-space' } as Space ]);
      });
    }));
  });

  describe('#fetchMoreSpaces', () => {
    it('should append spaces to spaces list', function(this: TestingContext): void {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spaceService.getMoreSearchResults.and.returnValue(observableOf([ { name: 'more-space' } ]));

      this.testedDirective.spaces.pipe(
        first()
      ).subscribe((spaces: Space[]): void => {
        expect(spaces).toEqual([]);
      });
      this.testedDirective.fetchMoreSpaces();
      this.testedDirective.spaces.pipe(
        first()
      ).subscribe((spaces: Space[]): void => {
        expect(spaces).toEqual([ { name: 'more-space' } as Space ]);
      });
    });

    it('should silently fail if no more spaces are found', function(this: TestingContext): void {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spaceService.getMoreSearchResults.and.returnValue(observableThrowError('No more spaces found'));

      this.testedDirective.spaces.pipe(
        first()
      ).subscribe((spaces: Space[]): void => {
        expect(spaces).toEqual([]);
      });
      this.testedDirective.fetchMoreSpaces();
      this.testedDirective.spaces.pipe(
        first()
      ).subscribe((spaces: Space[]): void => {
        expect(spaces).toEqual([]);
      });
    });
  });
});
