import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { cloneDeep } from 'lodash';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Codebase } from './codebase';
import { CodebasesService } from './codebases.service';

describe('Codebase: CodebasesService', () => {
  let mockLog: any;
  let mockAuthService: any;
  let mockUserService: any;
  let controller: HttpTestingController;
  let codebasesService: CodebasesService;

  beforeEach(() => {
    mockLog = jasmine.createSpyObj('Logger', ['error']);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    mockUserService = jasmine.createSpy('UserService');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: Logger,
          useValue: mockLog,
        },
        {
          provide: AuthenticationService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: WIT_API_URL,
          useValue: 'http://example.com/',
        },
        CodebasesService,
      ],
    });
    codebasesService = TestBed.get(CodebasesService);
    controller = TestBed.get(HttpTestingController);
  });

  const codebase = {
    id: 'mockid',
    attributes: {
      type: 'git',
      url: 'https://github.com/fabric8-ui/fabric8-ui.git',
    },
    type: 'codebases',
  } as Codebase;
  const githubData = {
    attributes: {
      createdAt: '2017-04-28T14:09:52.099148Z',
      last_used_workspace: '',
      stackId: '',
      type: 'git',
      'cve-scan': true,
      url: 'https://github.com/airbnb/enzyme.git',
    },
    id: 'c071bc6b-a241-41e4-8db1-83a3db12c4a1',
    links: {
      edit:
        'https://api.prod-preview.openshift.io/api/codebases/c071bc6b-a241-41e4-8db1-83a3db12c4a1/edit',
      self:
        'https://api.prod-preview.openshift.io/api/codebases/c071bc6b-a241-41e4-8db1-83a3db12c4a1',
    },
    relationships: {
      space: {
        data: {
          id: '1d7af8bf-0346-432d-9096-4e2b59d2db87',
          type: 'spaces',
        },
        links: {
          self:
            'https://api.prod-preview.openshift.io/api/spaces/1d7af8bf-0346-432d-9096-4e2b59d2db87',
        },
      },
    },
    type: 'codebases',
  };

  it('Add codebase', (done: DoneFn) => {
    const expectedResponse = { data: githubData };
    codebasesService.addCodebase('mySpace', codebase).subscribe((data: any) => {
      expect(data.id).toEqual(expectedResponse.data.id);
      expect(data.attributes.type).toEqual(expectedResponse.data.attributes.type);
      expect(data.attributes.url).toEqual(expectedResponse.data.attributes.url);
      controller.verify();
      done();
    });
    controller.expectOne('http://example.com/spaces/mySpace/codebases').flush({ data: githubData });
  });

  it('Add codebase in error', (done: DoneFn) => {
    codebasesService.addCodebase('mySpace', codebase).subscribe(
      () => {
        done.fail('Add codebase in error');
      },
      (error) => {
        expect(error).toEqual(
          'Http failure response for http://example.com/spaces/mySpace/codebases: 0 ',
        );
        controller.verify();
        done();
      },
    );
    controller
      .expectOne('http://example.com/spaces/mySpace/codebases')
      .error(new ErrorEvent('some error'));
  });

  it('List codebases', (done: DoneFn) => {
    const githubData2 = cloneDeep(githubData);
    githubData2.attributes.url = 'git@github.com:fabric8-services/fabric8-wit.git';
    const githubData3 = cloneDeep(githubData);
    githubData3.attributes.type = 'whatever';
    githubData3.attributes.url = 'http://something.com';
    const expectedResponse = {
      data: [githubData, githubData2, githubData3],
      metadata: { totalCount: 3 },
    };
    codebasesService.getCodebases('mySpace').subscribe((data: any) => {
      expect(data.length).toEqual(expectedResponse.data.length);
      // TODO(corinne): do we want this name/url formatting for https clone?
      expect(data[0].name).toEqual('https://github.com/airbnb/enzyme');
      expect(data[0].url).toEqual('https///github.com/airbnb/enzyme');
      expect(data[1].name).toEqual('fabric8-services/fabric8-wit');
      expect(data[1].url).toEqual('https://github.com/fabric8-services/fabric8-wit');
      expect(data[2].name).toEqual('http://something.com');
      expect(data[2].url).toEqual('http://something.com');
      controller.verify();
      done();
    });
    controller.expectOne('http://example.com/spaces/mySpace/codebases').flush(expectedResponse);
  });

  it('List codebases in error', (done: DoneFn) => {
    codebasesService.getCodebases('mySpace').subscribe(
      () => {
        fail('List codebases in error');
      },
      (error) => {
        expect(error).toEqual(
          'Http failure response for http://example.com/spaces/mySpace/codebases: 0 ',
        );
        controller.verify();
        done();
      },
    );
    controller
      .expectOne('http://example.com/spaces/mySpace/codebases')
      .error(new ErrorEvent('some error'));
  });

  // TODO(corinne): pagination is never used
  it('List paginated codebases with empty links', (done: DoneFn) => {
    const expectedResponse = { data: [githubData], links: {} };
    codebasesService.getPagedCodebases('mySpace', 2).subscribe((data: any) => {
      expect(data.length).toEqual(expectedResponse.data.length);
      controller.verify();
      done();
    });
    controller
      .expectOne('http://example.com/spaces/mySpace/codebases?page[limit]=2')
      .flush(expectedResponse);
  });

  it('List paginated codebases with next link', (done: DoneFn) => {
    const expectedResponse = { data: [githubData], links: { next: 'https://morelinks.com' } };
    codebasesService.getPagedCodebases('mySpace', 2).subscribe((data: any) => {
      expect(data.length).toEqual(expectedResponse.data.length);
      controller.verify();
      done();
    });
    controller
      .expectOne('http://example.com/spaces/mySpace/codebases?page[limit]=2')
      .flush(expectedResponse);
  });

  it('Get more paginated codebases with empty next link', (done: DoneFn) => {
    codebasesService.getMoreCodebases().subscribe(
      () => {
        done.fail('Get more paginated codebases with empty next link');
      },
      (error) => {
        expect(error).toEqual('No more codebases found');
        controller.verify();
        done();
      },
    );
  });

  it('List paginated codebases in error', (done: DoneFn) => {
    codebasesService.getPagedCodebases('mySpace', 2).subscribe(
      () => {
        done.fail('List paginated codebases in error');
      },
      (error) => {
        expect(error).toEqual(
          'Http failure response for http://example.com/spaces/mySpace/codebases?page[limit]=2: 0 ',
        );
        controller.verify();
        done();
      },
    );
    controller
      .expectOne('http://example.com/spaces/mySpace/codebases?page[limit]=2')
      .error(new ErrorEvent('some error'));
  });

  it('Update codebase with CVE alert notification', (done: DoneFn) => {
    const expectedResponse = { data: [githubData] };
    codebasesService.updateCodebases(codebase).subscribe((data: any) => {
      expect(data.length).toEqual(expectedResponse.data.length);
      controller.verify();
      done();
    });
    controller.expectOne('http://example.com/codebases/mockid').flush(expectedResponse);
  });

  it('Update codebase with CVE alert notification in error', (done: DoneFn) => {
    codebasesService.updateCodebases(codebase).subscribe(
      () => {
        done.fail('Update codebases in error');
      },
      (error) => {
        expect(error).toEqual('Http failure response for http://example.com/codebases/mockid: 0 ');
        controller.verify();
        done();
      },
    );
    controller.expectOne('http://example.com/codebases/mockid').error(new ErrorEvent('some error'));
  });

  it('Update codebases', (done: DoneFn) => {
    const expectedResponse = { data: [githubData] };
    codebasesService.update(codebase).subscribe((data: any) => {
      expect(data.length).toEqual(expectedResponse.data.length);
      controller.verify();
      done();
    });
    controller.expectOne('http://example.com/spaces/mockid').flush(expectedResponse);
  });

  it('Update codebases in error', (done: DoneFn) => {
    codebasesService.update(codebase).subscribe(
      () => {
        done.fail('Update codebases in error');
      },
      (error) => {
        expect(error).toEqual('Http failure response for http://example.com/spaces/mockid: 0 ');
        controller.verify();
        done();
      },
    );
    controller.expectOne('http://example.com/spaces/mockid').error(new ErrorEvent('some error'));
  });

  it('Delete codebase', (done: DoneFn) => {
    codebasesService.deleteCodebase(codebase).subscribe((data: any) => {
      expect(data).toEqual(codebase);
      controller.verify();
      done();
    });
    controller
      .expectOne('http://example.com/codebases/mockid')
      .flush('', { status: 204, statusText: 'No Content' });
  });

  it('Delete codebase in error', (done: DoneFn) => {
    codebasesService.deleteCodebase(codebase).subscribe(
      () => {
        done.fail('Delete codebase in error');
      },
      (error) => {
        expect(error).toEqual('Http failure response for http://example.com/codebases/mockid: 0 ');
        controller.verify();
        done();
      },
    );
    controller
      .expectOne('http://example.com/codebases/mockid')
      .error(new ErrorEvent('delete error'));
  });
});
