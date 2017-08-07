import { ClassProvider, FactoryProvider, OpaqueToken } from '@angular/core';
import { Http } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';

import { ApiLocatorService } from '../../../../shared/api-locator.service';
import { LoggerFactory } from '../../common/logger';

import { Fabric8ForgeService } from '../fabric8-forge.service';

import { ForgeService, IForgeServiceToken } from '../contracts/forge-service';

/**
 * When using this provider and you take a dependency on the interface type
 * it will be necessary to use the @inject(IForgeServiceProvider.InjectToken)
 * annotation to resolve the dependency. Benefits are that it is a more strict
 * contract first based approach, thus allowing multiple concrete implementations
 * without requiring a base type hierarchy.
 */

export class IForgeServiceProvider {
  static get FactoryProvider(): FactoryProvider {
    return {
      provide: IForgeServiceToken,
      useFactory: (loggerFactory, http, apiLocator, authenticationService) => {
        return new Fabric8ForgeService(http, loggerFactory, apiLocator, authenticationService);
      },
      deps: [ LoggerFactory, Http, ApiLocatorService, AuthenticationService ]
    };
  }

  static get InjectToken(): OpaqueToken {
    return IForgeServiceToken;
  }
}
/**
 * These providers uses the abstract base class as a contract as opposed to
 * an interface. The benefits are that it is simpler because does not require
 * using the @inject annotation to resolved the contract when  a class that
 * takes the service as a dependency. As typescript adds interface reflective
 * capabilities the interface based approach will probably be the preferred
 * approach as it lends itself to strong decoupling.
 */
export class ForgeServiceProvider {

  static get ClassProvider(): ClassProvider {
    return {
      provide: ForgeService,
      useClass: Fabric8ForgeService
    };
  }
  static get FactoryProvider(): FactoryProvider {
    return {
      provide: ForgeService,
      useFactory: (loggerFactory, http, apiLocator, authenticationService) => {
        return new Fabric8ForgeService(http, loggerFactory, apiLocator, authenticationService);
      },
      deps: [ LoggerFactory, Http, ApiLocatorService, AuthenticationService ],
      multi: false
    };
  }
}



