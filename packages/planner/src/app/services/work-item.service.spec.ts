import { TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import { Spaces, WIT_API_URL } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { Observable, of, throwError } from 'rxjs';

import { delay } from 'rxjs/operators';
import {
  HttpBackendClient,
  HttpClientService
} from '../shared/http-module/http.service';
import { WorkItem } from './../models/work-item';
import { AreaService } from './area.service';
import { WorkItemService } from './work-item.service';
import {
  commentsSnapshot,
  getMoreWorkItemResponseSnapshot,
  getSingleWorkItemSnapShot,
  getWorkItemResponseSnapshot,
  linkResponseSnapShot,
  resolveLinkExpectedOutputSnapShot,
  singleCommentResponseSnapshot,
  workItemEventsSnapshot,
  workItemSnapshot,
  workItemTypesResponseSnapshot
} from './work-item.snapshot';

describe('Unit Test :: WorkItemService', () => {
  beforeEach(() => {
    const mockHttpService = jasmine.createSpyObj('HttpClientService', [
      'get',
      'delete',
      'post',
      'patch'
    ]);

    const mockHttpBackendClient = jasmine.createSpyObj('HttpBackendClient', [
      'get',
      'post'
    ]);

    const mockLoggerService = jasmine.createSpyObj('LoggerService', ['log']);

    const mockAreaService = jasmine.createSpyObj('AreaService', ['getAreas']);

    const mockUserService = jasmine.createSpyObj('AreaService', [
      'getSavedLoggedInUser',
      'getLocallySavedUsers'
    ]);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClientService,
          useValue: mockHttpService
        },
        {
          provide: HttpBackendClient,
          useValue: mockHttpBackendClient
        },
        {
          provide: Logger,
          useValue: mockLoggerService
        },
        {
          provide: AreaService,
          useValue: mockAreaService
        },
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: Spaces,
          useValue: { current: of({}) }
        },
        {
          provide: WIT_API_URL,
          useValue: ''
        },
        WorkItemService
      ]
    });
  });

  afterEach(() => {});

  it('cannery :: Should pass the cannery test', done => {
    const wiService = TestBed.get(WorkItemService);
    expect(wiService).not.toBeNull();
    expect(wiService).not.toBeUndefined();
    done();
  });

  it('logger :: Should call logger.log during class construction and on call notifyError', done => {
    const wiService = TestBed.get(WorkItemService);
    expect(wiService.logger.log.calls.count()).toBe(1);
    wiService.notifyError('Some error', { message: 'Some error' });
    expect(wiService.logger.log.calls.count()).toBe(
      2,
    );
    done();
  });

  it('getChildren :: Should get the list of workitems when getChildren is called', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService['baseApiUrl'] = 'link/to/spaces/';
    wiService.httpClientService.get.and.returnValue(
      of(workItemSnapshot)
    );
    wiService.getChildren('').subscribe(data => {
      expect(data).toEqual(workItemSnapshot.data);
      done();
    });
  });

  it('getWorkItems :: Should get the list of workitems in proper format when getWorkItems is called', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService['baseApiUrl'] = 'link/to/spaces/';
    wiService.httpClientService.get.and.returnValue(
      of(workItemSnapshot).pipe(delay(200))
    );
    wiService.getWorkItems('', {}).subscribe(data => {
      expect(wiService.httpClientService.get).toHaveBeenCalledWith(
        'link/to/spaces/search?page[limit]=&'
      );
      expect(data).toEqual(getWorkItemResponseSnapshot);
      done();
    });
  });

  it('getWorkItems :: Should call notifyError if error response comes', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService['baseApiUrl'] = 'link/to/spaces/';
    wiService.httpClientService.get.and.returnValue(
      throwError(new Error('Internal service error')).pipe(delay(100))
    );
    spyOn(wiService, 'notifyError');
    wiService.getWorkItems('', {}).subscribe(
      () => {},
      err => {
        expect(wiService.httpClientService.get).toHaveBeenCalledTimes(1);
        expect(wiService.httpClientService.get).toHaveBeenCalledWith(
          'link/to/spaces/search?page[limit]=&'
        );
        expect(wiService.notifyError).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  it('getMoreWorkItems :: Should get the list of workitems in proper format when getMoreWorkItems is called', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService.httpClientService.get.and.returnValue(
      of(workItemSnapshot).pipe(delay(100))
    );
    wiService.getMoreWorkItems('some/url').subscribe(data => {
      expect(wiService.httpClientService.get).toHaveBeenCalledWith('some/url');
      expect(data).toEqual(getMoreWorkItemResponseSnapshot);
      done();
    });
  });

  it('getMoreWorkItems :: Should call notifyError if error response comes', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService.httpClientService.get.and.returnValue(
      throwError(new Error('Internal service error')).pipe(delay(100))
    );
    spyOn(wiService, 'notifyError');
    wiService.getMoreWorkItems('some/url').subscribe(
      () => {},
      err => {
        expect(wiService.httpClientService.get).toHaveBeenCalledWith(
          'some/url'
        );
        expect(wiService.notifyError).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  it('getMoreWorkItems :: Should `No more item found` error when url is null or empty', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService.getMoreWorkItems('').subscribe(
      () => {},
      err => {
        expect(wiService.httpClientService.get).toHaveBeenCalledTimes(0);
        expect(err).toBe('No more item found');
        done();
      }
    );
  });

  it(`getWorkItemByNumber :: Should construct the right URL if 'owner' is
        not provided considering to fetch workItem by the ID`, done => {
    const wiService = TestBed.get(WorkItemService);
    wiService['baseApiUrl'] = 'link/to/';
    wiService.httpClientService.get.and.returnValue(
      of(getSingleWorkItemSnapShot).pipe(delay(100))
    );
    // We are providing the owner name as empty to the function
    wiService.getWorkItemByNumber('1', '', 'space1').subscribe(data => {
      expect(wiService.httpClientService.get).toHaveBeenCalledWith(
        'link/to/workitems/1'
      );
      expect(data).toEqual(getSingleWorkItemSnapShot.data);
      done();
    });
  });

  it(`getWorkItemByNumber :: Should construct the right URL if 'space'
        is not provided considering to fetch workItem by the ID`, done => {
    const wiService = TestBed.get(WorkItemService);
    wiService['baseApiUrl'] = 'link/to/';
    wiService.httpClientService.get.and.returnValue(
      of(getSingleWorkItemSnapShot).pipe(delay(100))
    );
    // We are providing the space name as empty to the function
    wiService.getWorkItemByNumber('1', 'owner1', '').subscribe(data => {
      expect(wiService.httpClientService.get).toHaveBeenCalledWith(
        'link/to/workitems/1'
      );
      expect(data).toEqual(getSingleWorkItemSnapShot.data);
      done();
    });
  });

  it(`getWorkItemByNumber :: Should log error when work item is requested by
        the ID considering 'space' or 'owner' is not provided`, done => {
    const wiService = TestBed.get(WorkItemService);
    wiService['baseApiUrl'] = 'link/to/';
    wiService.httpClientService.get.and.returnValue(
      throwError(new Error('Internal service error')).pipe(delay(100))
    );
    spyOn(wiService, 'notifyError');
    // We are providing the space name as empty to the function
    wiService.getWorkItemByNumber('1', 'owner1', '').subscribe(
      () => {},
      err => {
        expect(wiService.httpClientService.get).toHaveBeenCalledWith(
          'link/to/workitems/1'
        );
        expect(wiService.notifyError).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  it(`getWorkItemByNumber :: Should construct the right URL if 'owner' and
        'space' are provided considering to fetch workItem by the number`, done => {
    const wiService = TestBed.get(WorkItemService);
    wiService['baseApiUrl'] = 'link/to/';
    wiService.httpBackendClient.get.and.returnValue(
      of(getSingleWorkItemSnapShot).pipe(delay(100))
    );
    // We are providing the owner name as empty to the function
    wiService.getWorkItemByNumber('1', 'owner1', 'space1').subscribe(data => {
      expect(wiService.httpBackendClient.get).toHaveBeenCalledWith(
        'link/to/namedspaces/owner1/space1/workitems/1'
      );
      expect(data).toEqual(getSingleWorkItemSnapShot.data);
      done();
    });
  });

  it(`getWorkItemByNumber :: Should log error when work item is requested by
        the number considering 'space' or 'owner' is provided`, done => {
    const wiService = TestBed.get(WorkItemService);
    wiService['baseApiUrl'] = 'link/to/';
    wiService.httpBackendClient.get.and.returnValue(
      throwError(new Error('Internal service error')).pipe(delay(100))
    );
    spyOn(wiService, 'notifyError');
    // We are providing the space name as empty to the function
    wiService.getWorkItemByNumber('1', 'owner1', 'space1').subscribe(
      () => {},
      err => {
        expect(wiService.httpBackendClient.get).toHaveBeenCalledWith(
          'link/to/namedspaces/owner1/space1/workitems/1'
        );
        expect(wiService.notifyError).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  it('getEvents :: Should return the list of events', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService.httpClientService.get.and.returnValue(
      of(workItemEventsSnapshot).pipe(delay(100))
    );
    wiService.getEvents('link/to/events').subscribe(data => {
      expect(wiService.httpClientService.get).toHaveBeenCalledWith(
        'link/to/events'
      );
      expect(data).toEqual(workItemEventsSnapshot.data);
      done();
    });
  });

  it('resolveComments :: Should fetch comments', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService.httpClientService.get.and.returnValue(
      of(commentsSnapshot).pipe(delay(100))
    );
    wiService.resolveComments('link/to/comments').subscribe(data => {
      expect(wiService.httpClientService.get).toHaveBeenCalledWith(
        'link/to/comments'
      );
      expect(data).toEqual(commentsSnapshot);
      done();
    });
  });

  it('resolveLinks :: Should fetch links', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService.httpClientService.get.and.returnValue(
      of(linkResponseSnapShot).pipe(delay(100))
    );
    wiService.resolveLinks('link/to/links').subscribe(data => {
      expect(wiService.httpClientService.get).toHaveBeenCalledWith(
        'link/to/links'
      );
      expect(data).toEqual(resolveLinkExpectedOutputSnapShot);
      done();
    });
  });

  it('getWorkItemTypes :: Should fetch work item types', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService.httpClientService.get.and.returnValue(
      of(workItemTypesResponseSnapshot).pipe(delay(100))
    );
    wiService.getWorkItemTypes('link/to/types').subscribe(data => {
      expect(wiService.httpClientService.get).toHaveBeenCalledWith(
        'link/to/types'
      );
      expect(data).toEqual(workItemTypesResponseSnapshot.data);
      done();
    });
  });

  it('getWorkItemTypes :: Should call notifyError on error', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService.httpClientService.get.and.returnValue(
      throwError(new Error('Internal server error')).pipe(delay(100))
    );
    spyOn(wiService, 'notifyError');
    wiService.getWorkItemTypes('link/to/types').subscribe(
      () => {},
      err => {
        expect(wiService.httpClientService.get).toHaveBeenCalledWith(
          'link/to/types'
        );
        expect(wiService.notifyError).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  it('delete :: Should call httpClientService delete', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService.httpClientService.delete.and.returnValue(
      of(undefined).pipe(delay(100))
    );
    wiService.delete({ links: { self: 'link/to/delete' } }).subscribe(data => {
      expect(wiService.httpClientService.delete).toHaveBeenCalledWith(
        'link/to/delete'
      );
      expect(data).toBeUndefined(); // void output
      done();
    });
  });

  it('create :: Should call httpClientService post to create work item', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService.httpClientService.post.and.returnValue(
      of(getSingleWorkItemSnapShot).pipe(delay(100))
    );
    wiService
      .create('link/to/create', getSingleWorkItemSnapShot.data)
      .subscribe(data => {
        expect(wiService.httpClientService.post).toHaveBeenCalledWith(
          'link/to/create',
          JSON.stringify(getSingleWorkItemSnapShot)
        );
        expect(data).toEqual(getSingleWorkItemSnapShot.data);
        done();
      });
  });

  it('update :: Should call httpClientService patch to update work item', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService.httpClientService.patch.and.returnValue(
      of(getSingleWorkItemSnapShot).pipe(delay(100))
    );
    wiService.update(getSingleWorkItemSnapShot.data).subscribe(data => {
      expect(wiService.httpClientService.patch).toHaveBeenCalledWith(
        getSingleWorkItemSnapShot.data.links.self,
        JSON.stringify(getSingleWorkItemSnapShot)
      );
      expect(data).toEqual(getSingleWorkItemSnapShot.data);
      done();
    });
  });

  it('createComment :: Should call httpClientService post to create comment', done => {
    const wiService = TestBed.get(WorkItemService);
    wiService.httpClientService.post.and.returnValue(
      of(singleCommentResponseSnapshot).pipe(delay(100))
    );
    wiService
      .createComment(
        'link/to/create/comment',
        singleCommentResponseSnapshot.data
      )
      .subscribe(data => {
        expect(wiService.httpClientService.post).toHaveBeenCalledWith(
          'link/to/create/comment',
          singleCommentResponseSnapshot
        );
        expect(data).toEqual(singleCommentResponseSnapshot.data);
        done();
      });
  });
});
