import { HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from 'ngx-login-client';
import { createMock } from 'testing/mock';
import { JenkinsService } from './jenkins.service';
import { FABRIC8_JENKINS_API_URL } from './runtime-console/fabric8-ui-jenkins-api';

describe('Service: JenkinsService', () => {
  let service: JenkinsService;
  let controller: HttpTestingController;
  const fakeJenkinsStatus = {
    'data': {
      'state': 'idled'
    }
  };

  beforeEach(() => {
    const mockAuthenticationService: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
    mockAuthenticationService.getToken.and.returnValue('mock-token');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: FABRIC8_JENKINS_API_URL, useValue: 'http://example.com' },
        JenkinsService
      ]
    });
    service = TestBed.get(JenkinsService);
    controller = TestBed.get(HttpTestingController);
  });


  it('should return jenkins status', (done: DoneFn) => {
    service.getJenkinsStatus()
      .subscribe((resp: HttpResponse<any>) => {
        expect(resp['data'].state).toBe('idled');
        done();
      });

    const req: TestRequest = controller.expectOne('http://example.com/api/jenkins/start');
    expect(req.request.method).toEqual('POST');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
    req.flush(fakeJenkinsStatus);
  });
});
