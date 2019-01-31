import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { async, fakeAsync, tick } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Space, SpaceService } from 'ngx-fabric8-wit';
import { InfiniteScrollModule } from 'ngx-widgets';
import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import { first } from 'rxjs/operators';
import { createMock } from 'testing/mock';
import { initContext, TestContext } from 'testing/test-context';
import { MySpacesSearchSpacesDialog, ViewState } from './my-spaces-search-spaces-dialog.component';

@Component({
  template: '<my-spaces-search-spaces-dialog></my-spaces-search-spaces-dialog>',
})
class HostComponent {}

@Component({
  template: '',
  selector: 'my-spaces-search-spaces-dialog-space-item',
})
class MockSpaceItem {
  @Input() space: Space;
}

describe('MySpacesSearchSpacesDialog', () => {
  type TestingContext = TestContext<MySpacesSearchSpacesDialog, HostComponent>;
  const testContext = initContext(MySpacesSearchSpacesDialog, HostComponent, {
    imports: [CommonModule, FormsModule, InfiniteScrollModule, ModalModule.forRoot()],
    declarations: [MockSpaceItem],
    providers: [
      {
        provide: SpaceService,
        useFactory: (): jasmine.SpyObj<SpaceService> => createMock(SpaceService),
      },
    ],
  });

  it('should be instantiable', (): void => {
    expect(testContext.testedDirective).toBeDefined();
  });

  describe('#init', () => {
    it('should set spaces list to empty array', (done: DoneFn): void => {
      testContext.testedDirective.spaces.pipe(first()).subscribe(
        (spaces: Space[]): void => {
          expect(spaces).toEqual([]);
          done();
        },
      );
    });

    it('should set totalCount to 0', (done: DoneFn): void => {
      testContext.testedDirective.totalCount.pipe(first()).subscribe(
        (count: number): void => {
          expect(count).toEqual(0);
          done();
        },
      );
    });

    it('should set view state to INIT', (done: DoneFn): void => {
      testContext.testedDirective.viewState.pipe(first()).subscribe(
        (state: ViewState): void => {
          expect(state).toEqual(ViewState.INIT);
          done();
        },
      );
    });

    it('should set search term to empty', (): void => {
      expect(testContext.testedDirective.searchTerm).toBe('');
    });
  });

  describe('#clear', () => {
    beforeEach(async((): void => {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spaceService.search.and.returnValue(observableOf([{ name: 'foo-space' }]));
      spaceService.getTotalCount.and.returnValue(observableOf(1));
      testContext.testedDirective.searchTerm = 'mocksearch';
      testContext.testedDirective.search();
      testContext.testedDirective.initItems({ pageSize: 10 });
    }));

    it('should reset spaces list to empty array', (done: DoneFn): void => {
      testContext.testedDirective.spaces.pipe(first()).subscribe(
        (spaces: Space[]): void => {
          expect(spaces).toEqual([{ name: 'foo-space' } as Space]);
          testContext.testedDirective.clear();
          testContext.testedDirective.spaces.pipe(first()).subscribe(
            (spaces: Space[]): void => {
              expect(spaces).toEqual([]);
              done();
            },
          );
        },
      );
    });

    it('should set totalCount to 0', (done: DoneFn): void => {
      testContext.testedDirective.totalCount.pipe(first()).subscribe(
        (count: number): void => {
          expect(count).toEqual(1);
          testContext.testedDirective.clear();
          testContext.testedDirective.totalCount.pipe(first()).subscribe(
            (count: number): void => {
              expect(count).toEqual(0);
              done();
            },
          );
        },
      );
    });

    it('should set view state to INIT', (done: DoneFn): void => {
      testContext.testedDirective.viewState.pipe(first()).subscribe(
        (state: ViewState): void => {
          expect(state).not.toEqual(ViewState.INIT);
          testContext.testedDirective.clear();
          testContext.testedDirective.viewState.pipe(first()).subscribe(
            (state: ViewState): void => {
              expect(state).toEqual(ViewState.INIT);
              done();
            },
          );
        },
      );
    });

    it('should reset search term', (): void => {
      expect(testContext.testedDirective.searchTerm).toEqual('mocksearch');
      testContext.testedDirective.clear();
      expect(testContext.testedDirective.searchTerm).toEqual('');
    });
  });

  describe('#initItems', () => {
    beforeEach(
      (): void => {
        const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
        spaceService.search.and.returnValue(observableOf([{ name: 'foo-space' }]));
        spaceService.getTotalCount.and.returnValue(observableOf(1));
        testContext.testedDirective.searchTerm = 'mocksearch';
      },
    );

    it('should set page size', fakeAsync((): void => {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      const pageSize: number = 123;
      testContext.testedDirective.initItems({ pageSize });
      testContext.testedDirective.search();
      tick();
      testContext.testedDirective.spaces.pipe(first()).subscribe(() => {
        expect(spaceService.search).toHaveBeenCalledWith(jasmine.any(String), pageSize);
      });
    }));

    it('should set view state to LOADING', fakeAsync((): void => {
      testContext.testedDirective.initItems({ pageSize: 10 });
      tick();
      testContext.testedDirective.viewState.pipe(first()).subscribe(
        (state: ViewState): void => {
          expect(state).toEqual(ViewState.LOADING);
        },
      );
    }));
  });

  describe('#search', () => {
    beforeEach(
      (): void => {
        const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
        spaceService.search.and.returnValue(observableOf([{ name: 'foo-space' }]));
        spaceService.getTotalCount.and.returnValue(observableOf(456));
        testContext.testedDirective.searchTerm = ' mocksearch ';
      },
    );

    it('should call SpaceService#search with trimmed search term', fakeAsync((): void => {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      expect(spaceService.search).not.toHaveBeenCalled();
      const pageSize: number = 123;
      testContext.testedDirective.initItems({ pageSize });
      testContext.testedDirective.search();
      tick();
      expect(spaceService.search).toHaveBeenCalledWith('mocksearch', pageSize);
    }));

    it('should call SpaceService#getTotalCount and update', (): void => {
      testContext.testedDirective.totalCount.pipe(first()).subscribe(
        (count: number): void => {
          expect(count).toBe(0);
        },
      );

      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      expect(spaceService.getTotalCount).not.toHaveBeenCalled();
      testContext.testedDirective.search();
      expect(spaceService.getTotalCount).toHaveBeenCalled();

      testContext.testedDirective.totalCount.pipe(first()).subscribe(
        (count: number): void => {
          expect(count).toBe(456);
        },
      );
    });

    it('should set view state to SHOW when results are received', (): void => {
      testContext.testedDirective.viewState.pipe(first()).subscribe(
        (state: ViewState): void => {
          expect(state).toEqual(ViewState.INIT);
        },
      );
      testContext.testedDirective.search();
      testContext.testedDirective.viewState.pipe(first()).subscribe(
        (state: ViewState): void => {
          expect(state).toEqual(ViewState.SHOW);
        },
      );
    });

    it('should set view state to EMPTY when no results are received', (): void => {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spaceService.search.and.returnValue(observableOf([]));
      testContext.testedDirective.viewState.pipe(first()).subscribe(
        (state: ViewState): void => {
          expect(state).toEqual(ViewState.INIT);
        },
      );
      testContext.testedDirective.search();
      testContext.testedDirective.viewState.pipe(first()).subscribe(
        (state: ViewState): void => {
          expect(state).toEqual(ViewState.EMPTY);
        },
      );
    });

    it('should update spaces with received results', (): void => {
      testContext.testedDirective.spaces.pipe(first()).subscribe(
        (spaces: Space[]): void => {
          expect(spaces).toEqual([]);
        },
      );
      testContext.testedDirective.search();
      testContext.testedDirective.spaces.pipe(first()).subscribe(
        (spaces: Space[]): void => {
          expect(spaces).toEqual([{ name: 'foo-space' } as Space]);
        },
      );
    });
  });

  describe('#fetchMoreSpaces', () => {
    it('should append spaces to spaces list', (): void => {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spaceService.getMoreSearchResults.and.returnValue(observableOf([{ name: 'more-space' }]));

      testContext.testedDirective.spaces.pipe(first()).subscribe(
        (spaces: Space[]): void => {
          expect(spaces).toEqual([]);
        },
      );
      testContext.testedDirective.fetchMoreSpaces();
      testContext.testedDirective.spaces.pipe(first()).subscribe(
        (spaces: Space[]): void => {
          expect(spaces).toEqual([{ name: 'more-space' } as Space]);
        },
      );
    });

    it('should silently fail if no more spaces are found', (): void => {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spaceService.getMoreSearchResults.and.returnValue(
        observableThrowError('No more spaces found'),
      );

      testContext.testedDirective.spaces.pipe(first()).subscribe(
        (spaces: Space[]): void => {
          expect(spaces).toEqual([]);
        },
      );
      testContext.testedDirective.fetchMoreSpaces();
      testContext.testedDirective.spaces.pipe(first()).subscribe(
        (spaces: Space[]): void => {
          expect(spaces).toEqual([]);
        },
      );
    });
  });
});
