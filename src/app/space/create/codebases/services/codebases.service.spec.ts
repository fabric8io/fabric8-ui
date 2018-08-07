import { TestBed } from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

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
  let mockService: MockBackend;
  let codebasesService: CodebasesService;

  beforeEach(() => {
      mockLog = jasmine.createSpyObj('Logger', ['error']);
      mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);
      mockUserService = jasmine.createSpy('UserService');

      TestBed.configureTestingModule({
        imports: [HttpModule],
        providers: [
          {
            provide: Logger, useValue: mockLog
          },
          {
            provide: XHRBackend, useClass: MockBackend
          },
          {
            provide: AuthenticationService,
            useValue: mockAuthService
          },
          {
            provide: UserService,
            useValue: mockUserService
          },
          {
            provide: WIT_API_URL,
            useValue: 'http://example.com'
          },
          CodebasesService
        ]
      });
      codebasesService = TestBed.get(CodebasesService);
      mockService = TestBed.get(XHRBackend);
    });

    const codebase = {
      'attributes': {
        'type': 'git',
        'url': 'https://github.com/fabric8-ui/fabric8-ui.git'
      },
      'type': 'codebases'
    } as Codebase;
    const githubData = {
      'attributes': {
        'createdAt': '2017-04-28T14:09:52.099148Z',
        'last_used_workspace': '',
        'stackId': '',
        'type': 'git',
        'cve-scan': true,
        'url': 'https://github.com/airbnb/enzyme.git'
      },
      'id': 'c071bc6b-a241-41e4-8db1-83a3db12c4a1',
      'links': {
        'edit': 'https://api.prod-preview.openshift.io/api/codebases/c071bc6b-a241-41e4-8db1-83a3db12c4a1/edit',
        'self': 'https://api.prod-preview.openshift.io/api/codebases/c071bc6b-a241-41e4-8db1-83a3db12c4a1'
      },
      'relationships': {
        'space': {
          'data': {
            'id': '1d7af8bf-0346-432d-9096-4e2b59d2db87',
            'type': 'spaces'
          },
          'links': {
            'self': 'https://api.prod-preview.openshift.io/api/spaces/1d7af8bf-0346-432d-9096-4e2b59d2db87'
          }
        }
      },
      'type': 'codebases'};

    it('Add codebase', (done: DoneFn) => {
      // given
      const expectedResponse = {'data': githubData};
      mockService.connections.subscribe((connection: any) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: JSON.stringify(expectedResponse),
            status: 200
          })
        ));
      });
      // when
      codebasesService.addCodebase('mySpace', codebase).subscribe((data: any) => {
        // then
        expect(data.id).toEqual(expectedResponse.data.id);
        expect(data.attributes.type).toEqual(expectedResponse.data.attributes.type);
        expect(data.attributes.url).toEqual(expectedResponse.data.attributes.url);
        done();
      });
  });

  it('Add codebase in error', (done: DoneFn) => {
      // given
      const expectedResponse = {'data': githubData};
      mockService.connections.subscribe((connection: any) => {
        connection.mockError(new Error('some error'));
      });
      // when
      codebasesService.addCodebase('mySpace', codebase).subscribe((data: any) => {
        done.fail('Add codebase in error');
      }, // then
      error => {
        expect(error).toEqual('some error');
        done();
      });
  });

  it('List codebases', (done: DoneFn) => {
    // given
    const githubData2 = cloneDeep(githubData);
    githubData2.attributes.url = 'git@github.com:fabric8-services/fabric8-wit.git';
    const githubData3 = cloneDeep(githubData);
    githubData3.attributes.type = 'whatever';
    githubData3.attributes.url = 'http://something.com';
    const expectedResponse = {'data': [githubData, githubData2, githubData3], 'metadata': {'totalCount': 3}};
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedResponse),
          status: 200
        })
      ));
    });
    // when
    codebasesService.getCodebases('mySpace').subscribe((data: any) => {
      // then
      expect(data.length).toEqual(expectedResponse.data.length);
      // TODO(corinne): do we want this name/url formatting for https clone?
      expect(data[0].name).toEqual('https://github.com/airbnb/enzyme');
      expect(data[0].url).toEqual('https///github.com/airbnb/enzyme');
      expect(data[1].name).toEqual('fabric8-services/fabric8-wit');
      expect(data[1].url).toEqual('https://github.com/fabric8-services/fabric8-wit');
      expect(data[2].name).toEqual('http://something.com');
      expect(data[2].url).toEqual('http://something.com');
      done();
    });
  });

  it('List codebases in error', (done: DoneFn) => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });
    // when
    codebasesService.getCodebases('mySpace').subscribe((data: any) => {
      done.fail('List codebases in error');
    }, // then
    error => {
      expect(error).toEqual('some error');
      done();
    });
  });

  // TODO(corinne): pagination is never used
  it('List paginated codebases with empty links', (done: DoneFn) => {
    // given
    const expectedResponse = {'data': [githubData], 'links': {}};
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedResponse),
          status: 200
        })
      ));
    });
    // when
    codebasesService.getPagedCodebases('mySpace', 2).subscribe((data: any) => {
      // then
      expect(data.length).toEqual(expectedResponse.data.length);
      done();
    });
  });

  it('List paginated codebases with next link', (done: DoneFn) => {
    // given
    const expectedResponse = {'data': [githubData], 'links': {'next': 'https://morelinks.com'}};
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedResponse),
          status: 200
        })
      ));
    });
    // when
    codebasesService.getPagedCodebases('mySpace', 2).subscribe((data: any) => {
      // then
      expect(data.length).toEqual(expectedResponse.data.length);
      done();
    });
  });

  it('Get more paginated codebases with empty next link', (done: DoneFn) => {
    // given
    const expectedResponse = {'data': [githubData], 'links': {'next': 'https://morelinks.com'}};

    // when
    codebasesService.getMoreCodebases().subscribe((data: any) => {
      done.fail('Get more paginated codebases with empty next link');
    }, // then
    error => {
      expect(error).toEqual('No more codebases found');
      done();
    });
  });

  it('List paginated codebases in error', (done: DoneFn) => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });
    // when
    codebasesService.getPagedCodebases('mySpace', 2).subscribe((data: any) => {
      // then
      done.fail('List paginated codebases in error');
    }, error => {
      expect(error).toEqual('some error');
      done();
    });
  });

  it('Update codebase with CVE alert notification', (done: DoneFn) => {
    // given
    const expectedResponse = {'data': [githubData]};
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedResponse),
          status: 200
        })
      ));
    });
    // when
    codebasesService.updateCodebases(codebase).subscribe((data: any) => {
      // then
      expect(data.length).toEqual(expectedResponse.data.length);
      done();
    });
  });

  it('Update codebase with CVE alert notification in error', (done: DoneFn) => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });
    // when
    codebasesService.updateCodebases(codebase).subscribe((data: any) => {
      done.fail('Update codebases in error');
    }, // then
    error => {
      expect(error).toEqual('some error');
      done();
    });
  });

  it('Update codebases', (done: DoneFn) => {
    // given
    const expectedResponse = {'data': [githubData]};
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedResponse),
          status: 200
        })
      ));
    });
    // when
    codebasesService.update(codebase).subscribe((data: any) => {
      // then
      expect(data.length).toEqual(expectedResponse.data.length);
      done();
    });
  });

  it('Update codebases in error', (done: DoneFn) => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });
    // when
    codebasesService.update(codebase).subscribe((data: any) => {
      done.fail('Update codebases in error');
    }, // then
    error => {
      expect(error).toEqual('some error');
      done();
    });
  });

  it('Delete codebase', (done: DoneFn) => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          status: 204
        })
      ));
    });
    // when
    codebasesService.deleteCodebase(codebase).subscribe((data: any) => {
      // then
      expect(data).toEqual(codebase);
      done();
    });
  });

  it('Delete codebase in error', (done: DoneFn) => {
    let deleteError = 'delete error';
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error(deleteError));
    });
    // when
    codebasesService.deleteCodebase(codebase).subscribe((data: any) => {
        done.fail('Delete codebase in error');
      }, // then
      error => {
        expect(error).toEqual(deleteError);
        done();
      });
  });
});
